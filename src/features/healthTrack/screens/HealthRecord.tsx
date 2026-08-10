import React, { useEffect, useState } from 'react';
import { ScrollView, Text, StyleSheet, StatusBar, View } from 'react-native';
import { COLORS } from '../../../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeBottomTabScreenProps } from '@react-navigation/bottom-tabs/unstable';

import { HealthRecord, HealthLogPayload, PeriodsCycleStatus } from '../types/healthRecord';
import HealthRecordForm from '../components/HealthRecordForm';
import { getHealthRecord, addHealthRecord } from '../../../services/client.service';
import { UserTabParamList } from '../../../types/UserTabParamList';
import { useAlert } from '../../../context/AlertContext';

type HealthRecordScreenProps = NativeBottomTabScreenProps<UserTabParamList, 'HealthRecord'>;

interface HistoryRowProps {
      record: HealthRecord;
}
export function formatRecordDate(dateStr: string): string {
      const date = new Date(dateStr);
      if (Number.isNaN(date.getTime())) return dateStr;
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
}
interface CycleStatusPillProps {
      status: PeriodsCycleStatus;
}

const TONES: Record<PeriodsCycleStatus, { bg: string; text: string }> = {
      'None/Regular': { bg: 'rgba(166, 24, 82, 0.1)', text: COLORS.primary },
      'Follicular Phase': { bg: 'rgba(212, 171, 58, 0.14)', text: COLORS.goldDark },
      'Letual Phase': { bg: 'rgba(34, 197, 94, 0.12)', text: '#15803D' },
      'Postmartum': { bg: 'rgba(34, 197, 94, 0.12)', text: '#15803D' },
      'Menstruation (Period)': { bg: 'rgba(34, 197, 94, 0.12)', text: '#15803D' },
      'Ovulation': { bg: 'rgba(34, 197, 94, 0.12)', text: '#15803D' },
      'Irregular': { bg: 'rgba(34, 197, 94, 0.12)', text: '#15803D' },
};

const CycleStatusPill: React.FC<CycleStatusPillProps> = ({ status }) => {
      const tone = TONES[status];
      return (
            <View style={[styles.pill, { backgroundColor: tone?.bg }]}>
                  <Text style={[styles.text, { color: tone?.text }]}>{status}</Text>
            </View>
      );
};
const HistoryRow: React.FC<HistoryRowProps> = ({ record }) => (
      <View style={styles.row}>
            <Text style={styles.date}>{formatRecordDate(record.date)}</Text>

            <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                        <Icon name="water-outline" size={13} color={COLORS.info} />
                        <Text style={styles.statText}>{record.waterIntake} L</Text>
                  </View>

                  <View style={styles.statItem}>
                        <Text style={styles.calIn}>{record.calorieIntake}</Text>
                        <Text style={styles.calSlash}>/</Text>
                        <Text style={styles.calOut}>{record.calorieBurned}</Text>
                        <Text style={styles.calUnit}>kcal</Text>
                  </View>

                  <CycleStatusPill status={record.periodsCycleStatus} />
            </View>

            {!!record.notes && <Text style={styles.notes}>{record.notes}</Text>}
      </View>
);

interface ProgressHistoryCardProps {
      records: HealthRecord[];
}

const ProgressHistoryCard: React.FC<ProgressHistoryCardProps> = ({ records }) => {
      const sorted = [...records].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );

      return (
            <View style={styles.card}>
                  <Text style={styles.title}>Progress History</Text>

                  {sorted.length > 0 ? (
                        sorted.map((record) => <HistoryRow key={record._id} record={record} />)
                  ) : (
                        <View style={styles.emptyState}>
                              <Icon name="bar-chart-outline" size={28} color={COLORS.textMuted} />
                              <Text style={styles.emptyTitle}>No progress logged yet</Text>
                              <Text style={styles.emptyMessage}>
                                    Entries you save will show up here as a running history.
                              </Text>
                        </View>
                  )}
            </View>
      );
};

const demoData: HealthRecord[] = [{
      _id: '',
      calorieBurned: 0,
      client: '',
      calorieIntake: 0,
      notes: '',
      periodsCycleStatus: 'None/Regular',
      waterIntake: 0,
      weight: 0,
      date: '',
      createdAt: '',
      updatedAt: '',
      __v: 0,
}]

const HealthRecordScreen = ({ navigation }: HealthRecordScreenProps) => {
      const alert = useAlert();
      const [records, setRecords] = useState<HealthRecord[]>(demoData);

      useEffect(() => {
            fetchHealthRecords();
      });

      const fetchHealthRecords = async () => {
            const response = await getHealthRecord();
            const healthData = response.data;
            setRecords(healthData);
      }

      const onSaveLog = async (healthrecord: any) => {
            try {
                  const response = await addHealthRecord(healthrecord);
                  if (response.data.success) {
                        alert.success('Health record added successfully');
                  }
            } finally {
                  // navigation.goBack();
                  console.log('Added');
            }
      }
      return (
            <>
                  <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
                  <ScrollView
                        style={styles.flex}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                  >
                        <Text style={styles.screenTitle}>Health Tracking</Text>
                        <HealthRecordForm onSave={onSaveLog} />
                        <ProgressHistoryCard records={records} />
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
            paddingTop: 20,
            paddingBottom: 40,
      },
      screenTitle: {
            fontSize: 22,
            fontWeight: '800',
            color: COLORS.text,
            paddingHorizontal: 20,
            marginBottom: 4,
      },
      card: {
            backgroundColor: COLORS.surfaceElevated,
            borderRadius: 22,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 20,
            marginHorizontal: 16,
            marginTop: 16,
      },
      title: {
            fontSize: 17,
            fontWeight: '800',
            color: COLORS.text,
            marginBottom: 8,
      },
      emptyState: {
            alignItems: 'center',
            paddingVertical: 32,
      },
      emptyTitle: {
            fontSize: 13.5,
            fontWeight: '800',
            color: COLORS.text,
            marginTop: 12,
            marginBottom: 6,
      },
      emptyMessage: {
            fontSize: 12,
            color: COLORS.textMuted,
            textAlign: 'center',
            lineHeight: 18,
      },
      row: {
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
      },
      date: {
            fontSize: 14,
            fontWeight: '800',
            color: COLORS.text,
            marginBottom: 10,
      },
      statsRow: {
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 14,
            marginBottom: 8,
      },
      statItem: {
            flexDirection: 'row',
            alignItems: 'center',
      },
      statText: {
            fontSize: 12.5,
            fontWeight: '700',
            color: COLORS.textSecondary,
            marginLeft: 5,
      },
      calIn: {
            fontSize: 12.5,
            fontWeight: '800',
            color: COLORS.success,
      },
      calSlash: {
            fontSize: 12.5,
            color: COLORS.textMuted,
            marginHorizontal: 2,
      },
      calOut: {
            fontSize: 12.5,
            fontWeight: '800',
            color: COLORS.error,
      },
      calUnit: {
            fontSize: 11.5,
            color: COLORS.textMuted,
            marginLeft: 4,
      },
      notes: {
            fontSize: 12.5,
            color: COLORS.textSecondary,
            fontStyle: 'italic',
            lineHeight: 18,
      },
      pill: {
            alignSelf: 'flex-start',
            borderRadius: 999,
            paddingVertical: 5,
            paddingHorizontal: 12,
      },
      text: {
            fontSize: 11,
            fontWeight: '800',
      },
});

export default HealthRecordScreen;