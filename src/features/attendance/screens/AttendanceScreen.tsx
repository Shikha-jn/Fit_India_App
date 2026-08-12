import React, { useMemo, useState, useRef } from 'react';
import { ScrollView, StyleSheet, StatusBar, View, Pressable, Text, TextInput, Animated, Modal, FlatList } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../types/RootStackParamList';
import { COLORS, SPACING, TYPOGRAPHY, RADII } from '../../../theme/theme';
import { AttendanceFilters, DEFAULT_FILTERS, deriveAttendanceLogs, filterAttendanceLogs, formatLongDate, calculateAttendanceRate, WeekPeriodFilter, getYearOptions, getMonthOptions, AttendanceLog } from '../types/attendance';

type AttendanceScreenProps = NativeStackScreenProps<RootStackParamList, 'Attendance'>;

const PresenceStatusPill: React.FC<{ status: 'Present' }> = ({ status }) => (
      <View style={styles.pill}>
            <View style={styles.dot} />
            <Text style={styles.text}>{status}</Text>
      </View>
);

interface DateFieldProps {
      label: string;
      value: string;
      onChangeText: (text: string) => void;
}

/** Auto-inserts dashes as the user types digits, e.g. "10082026" -> "10-08-2026". */
function formatAsTyped(input: string): string {
      const digits = input.replace(/\D/g, '').slice(0, 8);
      const parts = [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4, 8)].filter(
            Boolean,
      );
      return parts.join('-');
}

const DateField: React.FC<DateFieldProps> = ({ label, value, onChangeText }) => (
      <View style={styles.container}>
            <Text style={styles.Datelabel}>{label}</Text>
            <View style={styles.field}>
                  <TextInput
                        value={value}
                        onChangeText={(text) => onChangeText(formatAsTyped(text))}
                        placeholder="dd-mm-yyyy"
                        placeholderTextColor={COLORS.textMuted}
                        keyboardType="number-pad"
                        maxLength={10}
                        style={styles.input}
                  />
                  <Icon name="calendar-outline" size={16} color={COLORS.textMuted} />
            </View>
      </View>
);
export interface SelectOption<T> {
      label: string;
      value: T;
}

interface SheetSelectProps<T> {
      label: string;
      value: T;
      options: SelectOption<T>[];
      onChange: (value: T) => void;
}

function SheetSelect<T extends string | number>({
      label,
      value,
      options,
      onChange,
}: SheetSelectProps<T>) {
      const [visible, setVisible] = useState(false);
      const slideAnim = useRef(new Animated.Value(300)).current;

      const selected = options.find((o) => o.value === value);

      const open = () => {
            setVisible(true);
            Animated.spring(slideAnim, {
                  toValue: 0,
                  useNativeDriver: true,
                  friction: 10,
                  tension: 80,
            }).start();
      };

      const close = () => {
            Animated.timing(slideAnim, {
                  toValue: 300,
                  duration: 180,
                  useNativeDriver: true,
            }).start(() => setVisible(false));
      };

      const handleSelect = (option: SelectOption<T>) => {
            onChange(option.value);
            close();
      };

      return (
            <View style={styles.sheetcontainer}>
                  <Text style={styles.sheetlabel}>{label}</Text>
                  <Pressable style={styles.sheetfield} onPress={open}>
                        <Text style={styles.fieldText} numberOfLines={1}>
                              {selected?.label ?? '—'}
                        </Text>
                        <Icon name="chevron-down" size={16} color={COLORS.textMuted} />
                  </Pressable>

                  <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
                        <Pressable style={styles.backdrop} onPress={close}>
                              <Animated.View
                                    style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
                              >
                                    <View style={styles.sheetHandle} />
                                    <Text style={styles.sheetTitle}>{label}</Text>
                                    <FlatList
                                          data={options}
                                          keyExtractor={(item) => String(item.value)}
                                          style={styles.optionList}
                                          renderItem={({ item }) => {
                                                const isSelected = item.value === value;
                                                return (
                                                      <Pressable style={styles.option} onPress={() => handleSelect(item)}>
                                                            <Text
                                                                  style={[
                                                                        styles.optionText,
                                                                        { color: isSelected ? COLORS.gold : COLORS.text },
                                                                  ]}
                                                            >
                                                                  {item.label}
                                                            </Text>
                                                            {isSelected && (
                                                                  <Icon name="checkmark" size={18} color={COLORS.gold} />
                                                            )}
                                                      </Pressable>
                                                );
                                          }}
                                    />
                              </Animated.View>
                        </Pressable>
                  </Modal>
            </View>
      );
}

interface FilterLogsCardProps {
      filters: AttendanceFilters;
      onChange: (filters: AttendanceFilters) => void;
      attendanceDates: string[];
}

const WEEK_PERIOD_OPTIONS: { label: string; value: WeekPeriodFilter }[] = [
      { label: 'All Logs', value: 'all' },
      { label: 'This Week', value: 'this_week' },
      { label: 'Last Week', value: 'last_week' },
      { label: 'Last 30 Days', value: 'last_30_days' },
];

const FilterLogsCard: React.FC<FilterLogsCardProps> = ({
      filters,
      onChange,
      attendanceDates,
}) => {
      const monthOptions = [{ label: 'All Months', value: 'all' as const }, ...getMonthOptions()];
      const yearOptions = [
            { label: 'All Years', value: 'all' as const },
            ...getYearOptions(attendanceDates),
      ];

      const update = <K extends keyof AttendanceFilters>(
            key: K,
            value: AttendanceFilters[K],
      ) => {
            onChange({ ...filters, [key]: value });
      };

      return (
            <View style={styles.filtercard}>
                  <View style={styles.filtertitleRow}>
                        <Icon name="funnel-outline" size={15} color={COLORS.primaryLight} />
                        <Text style={styles.filtertitle}>Search & Filter Logs</Text>
                  </View>
                  <View style={styles.divider} />

                  <View style={styles.filterrow}>
                        <View style={styles.rowItem}>
                              <DateField
                                    label="From Date"
                                    value={filters.fromDate}
                                    onChangeText={(v) => update('fromDate', v)}
                              />
                        </View>
                        <View style={styles.rowItem}>
                              <DateField
                                    label="To Date"
                                    value={filters.toDate}
                                    onChangeText={(v) => update('toDate', v)}
                              />
                        </View>
                  </View>

                  <SheetSelect
                        label="Month"
                        value={filters.month}
                        options={monthOptions}
                        onChange={(v) => update('month', v)}
                  />
                  <SheetSelect
                        label="Year"
                        value={filters.year}
                        options={yearOptions}
                        onChange={(v) => update('year', v)}
                  />
                  <SheetSelect
                        label="Week Period"
                        value={filters.weekPeriod}
                        options={WEEK_PERIOD_OPTIONS}
                        onChange={(v) => update('weekPeriod', v)}
                  />
            </View>
      );
};

interface StatCardProps {
      label: string;
      value: string;
      emphasize?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, emphasize }) => (
      <View style={styles.statcard}>
            <Text style={styles.label}>{label}</Text>
            <Text style={[styles.value, emphasize && styles.valueEmphasize]}>{value}</Text>
      </View>
);

interface AttendanceStatsRowProps {
      joinedDateLabel: string;
      daysPresent: number;
      attendanceRate: number;
}

const AttendanceStatsRow: React.FC<AttendanceStatsRowProps> = ({
      joinedDateLabel,
      daysPresent,
      attendanceRate,
}) => (
      <View style={styles.row}>
            <StatCard label="Joined Date" value={joinedDateLabel} />
            <StatCard label="Days Present (Filtered)" value={`${daysPresent} Days`} emphasize />
            <StatCard label="Attendance Rate" value={`${attendanceRate}%`} emphasize />
      </View>
);

interface AttendanceLogsCardProps {
      logs: AttendanceLog[];
}

const AttendanceLogsCard: React.FC<AttendanceLogsCardProps> = ({ logs }) => (
      <View style={styles.attcard}>
            <View style={styles.atttitleRow}>
                  <Icon name="calendar" size={15} color={COLORS.primaryLight} />
                  <Text style={styles.atttitle}>Present Attendance Logs ({logs.length})</Text>
            </View>
            <View style={styles.divider} />

            {logs.length > 0 ? (
                  logs.map((log, index) => (
                        <View
                              key={log.date}
                              style={[styles.row, index === logs.length - 1 && styles.rowLast]}
                        >
                              <View style={styles.rowLeft}>
                                    <Text style={styles.date}>{formatLongDate(log.date)}</Text>
                                    <Text style={styles.dayOfWeek}>{log.dayOfWeek}</Text>
                              </View>
                              <Text style={styles.timing}>{log.timing}</Text>
                              <PresenceStatusPill status={log.status} />
                        </View>
                  ))
            ) : (
                  <View style={styles.emptyState}>
                        <Icon name="file-tray-outline" size={26} color={COLORS.textMuted} />
                        <Text style={styles.emptyTitle}>No logs match these filters</Text>
                        <Text style={styles.emptyMessage}>
                              Try widening your date range or clearing a filter.
                        </Text>
                  </View>
            )}
      </View>
);

interface AttendanceHeaderProps {
      onDownloadCsv?: () => void;
}

const AttendanceHeader: React.FC<AttendanceHeaderProps> = ({ onDownloadCsv }) => (
      <View style={styles.card}>
            <View style={styles.titleRow}>
                  <View style={styles.iconCircle}>
                        <Icon name="calendar" size={17} color={COLORS.primaryLight} />
                  </View>
                  <Text style={styles.title}>Attendance History</Text>
            </View>
            <Text style={styles.subtitle}>
                  Review your training presence, track consistency, and download
                  month-wise reports.
            </Text>

            <Pressable onPress={onDownloadCsv} style={styles.downloadWrap}>
                  <LinearGradient
                        colors={[COLORS.primary, COLORS.primaryDark]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.downloadBtn}
                  >
                        <Icon name="download-outline" size={15} color={COLORS.text} />
                        <Text style={styles.downloadText}>Download CSV Report</Text>
                  </LinearGradient>
            </Pressable>
      </View>
);

// interface AttendanceScreenProps {
//       /** ISO date strings the user was marked present, e.g. UserData.attendance */
//       attendance: string[];
//       /** Typically UserData.createdAt */
//       joinedDate?: string;
// }

/** Builds a minimal CSV from the currently filtered logs. */
function buildCsv(logs: { date: string; dayOfWeek: string; timing: string; status: string }[]) {
      const header = 'Date,Day of Week,Timing Logged,Presence Status';
      const rows = logs.map(
            (log) => `${log.date},${log.dayOfWeek},${log.timing},${log.status}`,
      );
      return [header, ...rows].join('\n');
}

const AttendanceScreen = ({ navigation, route }: AttendanceScreenProps) => {
      const { attendance, joinedDate } = route.params;
      const [filters, setFilters] = useState<AttendanceFilters>(DEFAULT_FILTERS);

      const allLogs = useMemo(() => deriveAttendanceLogs(attendance), [attendance]);
      const filteredLogs = useMemo(
            () => filterAttendanceLogs(allLogs, filters),
            [allLogs, filters],
      );

      const attendanceRate = useMemo(
            () => calculateAttendanceRate(filteredLogs.length, joinedDate),
            [filteredLogs.length, joinedDate],
      );
      const onDownloadCsv = (csv: any) => { }

      const handleDownload = () => {
            onDownloadCsv?.(buildCsv(filteredLogs));
      };

      return (
            <>
                  <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
                  <ScrollView
                        style={styles.flex}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                  >
                        <AttendanceHeader onDownloadCsv={handleDownload} />

                        <AttendanceStatsRow
                              joinedDateLabel={formatLongDate(joinedDate)}
                              daysPresent={filteredLogs.length}
                              attendanceRate={attendanceRate}
                        />

                        <FilterLogsCard
                              filters={filters}
                              onChange={setFilters}
                              attendanceDates={attendance}
                        />

                        <AttendanceLogsCard logs={filteredLogs} />
                  </ScrollView>
            </>
      );
};

const styles = StyleSheet.create({
      flex: {
            flex: 1,
            backgroundColor: COLORS.background,
      },
      content: {
            paddingBottom: 24,
      },
      card: {
            backgroundColor: COLORS.surface,
            borderRadius: RADII.lg,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: SPACING.md + 2,
            marginHorizontal: SPACING.md,
            marginTop: SPACING.md,
      },
      titleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 6,
      },
      iconCircle: {
            width: 30,
            height: 30,
            borderRadius: RADII.md,
            backgroundColor: 'rgba(166, 24, 82, 0.14)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: SPACING.sm + 2,
      },
      title: {
            fontSize: 17,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
      },
      subtitle: {
            fontSize: 12.5,
            color: COLORS.textMuted,
            lineHeight: 18,
            marginBottom: SPACING.md,
      },
      downloadWrap: {
            borderRadius: RADII.full,
            overflow: 'hidden',
            alignSelf: 'flex-start',
      },
      downloadBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 11,
            paddingHorizontal: 16,
      },
      downloadText: {
            color: COLORS.text,
            fontSize: 12.5,
            fontWeight: TYPOGRAPHY.extraBold,
            marginLeft: 8,
      },
      row: {
            flexDirection: 'row',
            gap: SPACING.sm + 2,
            paddingHorizontal: SPACING.md,
            marginTop: SPACING.md,
      },
      statcard: {
            flex: 1,
            backgroundColor: COLORS.surface,
            borderRadius: RADII.lg,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingVertical: SPACING.md,
            paddingHorizontal: SPACING.sm + 2,
            alignItems: 'center',
      },
      label: {
            fontSize: 9.5,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            color: COLORS.textMuted,
            marginBottom: 8,
            textAlign: 'center',
      },
      value: {
            fontSize: 15,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
      },
      valueEmphasize: {
            fontSize: 19,
            color: COLORS.primaryLight,
      },
      filtercard: {
            backgroundColor: COLORS.surface,
            borderRadius: RADII.lg,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: SPACING.md + 2,
            marginHorizontal: SPACING.md,
            marginTop: SPACING.md,
      },
      filtertitleRow: {
            flexDirection: 'row',
            alignItems: 'center',
      },
      filtertitle: {
            fontSize: 13,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            color: COLORS.text,
            marginLeft: SPACING.sm,
      },
      divider: {
            height: 1,
            backgroundColor: COLORS.border,
            marginTop: SPACING.md,
            marginBottom: SPACING.sm + 2,
      },
      filterrow: {
            flexDirection: 'row',
            gap: SPACING.sm + 2,
      },
      rowItem: {
            flex: 1,
      },
      attcard: {
            backgroundColor: COLORS.surface,
            borderRadius: RADII.lg,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: SPACING.md + 2,
            marginHorizontal: SPACING.md,
            marginTop: SPACING.md,
            marginBottom: SPACING.xl,
      },
      atttitleRow: {
            flexDirection: 'row',
            alignItems: 'center',
      },
      atttitle: {
            fontSize: 13,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            color: COLORS.text,
            marginLeft: SPACING.sm,
      },
      // divider: {
      //       height: 1,
      //       backgroundColor: COLORS.border,
      //       marginTop: SPACING.md,
      //       marginBottom: 4,
      // },
      attrow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: SPACING.md - 2,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
      },
      rowLast: {
            borderBottomWidth: 0,
      },
      rowLeft: {
            flex: 1.1,
      },
      date: {
            fontSize: 13.5,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
            marginBottom: 2,
      },
      dayOfWeek: {
            fontSize: 11.5,
            color: COLORS.textMuted,
            fontWeight: TYPOGRAPHY.medium,
      },
      timing: {
            flex: 1,
            fontSize: 12,
            color: COLORS.textMuted,
            fontWeight: TYPOGRAPHY.medium,
      },
      emptyState: {
            alignItems: 'center',
            paddingVertical: SPACING.xl,
      },
      emptyTitle: {
            fontSize: 13.5,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
            marginTop: SPACING.sm + 2,
            marginBottom: 6,
      },
      emptyMessage: {
            fontSize: 12,
            color: COLORS.textMuted,
            textAlign: 'center',
            lineHeight: 18,
      },
      container: {
            marginBottom: 14,
      },
      Datelabel: {
            fontSize: 10.5,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: COLORS.textMuted,
            marginBottom: 8,
      },
      field: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: COLORS.surface,
            borderRadius: RADII.md + 2,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingHorizontal: 14,
            height: 48,
      },
      input: {
            flex: 1,
            color: COLORS.text,
            fontSize: 13.5,
            fontWeight: TYPOGRAPHY.bold,
            padding: 0,
      },
      sheetcontainer: {
            marginBottom: 14,
      },
      sheetlabel: {
            fontSize: 10.5,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: COLORS.textMuted,
            marginBottom: 8,
      },
      sheetfield: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: COLORS.surface,
            borderRadius: RADII.md + 2,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingHorizontal: 14,
            height: 48,
      },
      fieldText: {
            flex: 1,
            color: COLORS.text,
            fontSize: 13.5,
            fontWeight: TYPOGRAPHY.bold,
            marginRight: 8,
      },
      backdrop: {
            flex: 1,
            backgroundColor: COLORS.overlay,
            justifyContent: 'flex-end',
      },
      sheet: {
            backgroundColor: COLORS.surfaceElevated,
            borderTopLeftRadius: RADII.xl,
            borderTopRightRadius: RADII.xl,
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 32,
            borderTopWidth: 1,
            borderColor: COLORS.border,
            maxHeight: '65%',
      },
      sheetHandle: {
            alignSelf: 'center',
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: COLORS.divider,
            marginBottom: 16,
      },
      sheetTitle: {
            color: COLORS.textMuted,
            fontSize: 12,
            fontWeight: TYPOGRAPHY.bold,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
            marginBottom: 8,
      },
      optionList: {
            marginTop: 4,
      },
      option: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
      },
      optionText: {
            fontSize: 15,
            fontWeight: TYPOGRAPHY.semiBold,
      },
      pill: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            backgroundColor: 'rgba(34, 197, 94, 0.12)',
            borderRadius: RADII.full,
            paddingVertical: 5,
            paddingHorizontal: 10,
      },
      dot: {
            width: 5,
            height: 5,
            borderRadius: 2.5,
            backgroundColor: COLORS.success,
            marginRight: 5,
      },
      text: {
            fontSize: 11,
            fontWeight: TYPOGRAPHY.extraBold,
            color: '#4ADE80',
      },
});

export default AttendanceScreen;