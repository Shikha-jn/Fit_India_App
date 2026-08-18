import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
      Modal,
      View,
      Text,
      Pressable,
      ScrollView,
      ActivityIndicator,
      KeyboardAvoidingView,
      Platform,
      StyleSheet,
      Animated,
      TextInput,
      TextInputProps
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../../theme/theme';
import { WorkoutPlan, DAYS_OF_WEEK } from '../types/clientDirectory';

interface PlainInputProps extends TextInputProps {
      containerStyle?: object;
}

const PlainInput: React.FC<PlainInputProps> = ({ style, containerStyle, ...rest }) => {
      const [focused, setFocused] = useState(false);

      return (
            <TextInput
                  placeholderTextColor={COLORS.textMuted}
                  style={[styles.input, focused && styles.inputFocused, containerStyle, style]}
                  onFocus={(e) => {
                        setFocused(true);
                        rest.onFocus?.(e);
                  }}
                  onBlur={(e) => {
                        setFocused(false);
                        rest.onBlur?.(e);
                  }}
                  {...rest}
            />
      );
};

interface ModalHeaderProps {
      icon: string;
      title: string;
      onClose?: () => void;
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ icon, title, onClose }) => (
      <View style={styles.modalcontainer}>
            <View style={styles.titleRow}>
                  <Icon name={icon} size={18} color={COLORS.primaryLight} />
                  <Text style={styles.title}>{title}</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
                  <Icon name="close" size={20} color={COLORS.textMuted} />
            </Pressable>
      </View>
);

interface DaySelectProps {
      value: string;
      options: readonly string[];
      onChange: (value: string) => void;
}

const DaySelect: React.FC<DaySelectProps> = ({ value, options, onChange }) => {
      const [visible, setVisible] = useState(false);
      const slideAnim = useRef(new Animated.Value(300)).current;

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

      const handleSelect = (option: string) => {
            onChange(option);
            close();
      };

      return (
            <View style={styles.container}>
                  <Pressable style={styles.field} onPress={open}>
                        <Text style={styles.fieldText}>{value}</Text>
                        <Icon name="chevron-down" size={16} color={COLORS.textMuted} />
                  </Pressable>

                  <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
                        <Pressable style={styles.selectbackdrop} onPress={close}>
                              <Animated.View
                                    style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
                              >
                                    <View style={styles.sheetHandle} />
                                    <Text style={styles.sheetTitle}>Day of the Week</Text>
                                    {options.map((option) => {
                                          const isSelected = option === value;
                                          return (
                                                <Pressable
                                                      key={option}
                                                      style={styles.option}
                                                      onPress={() => handleSelect(option)}
                                                >
                                                      <Text
                                                            style={[
                                                                  styles.optionText,
                                                                  { color: isSelected ? COLORS.gold : COLORS.text },
                                                            ]}
                                                      >
                                                            {option}
                                                      </Text>
                                                      {isSelected && (
                                                            <Icon name="checkmark" size={18} color={COLORS.gold} />
                                                      )}
                                                </Pressable>
                                          );
                                    })}
                              </Animated.View>
                        </Pressable>
                  </Modal>
            </View>
      );
};

interface ExerciseRowProps {
      activity: string;
      details: string;
      onDelete?: () => void;
}

const ExerciseRow: React.FC<ExerciseRowProps> = ({ activity, details, onDelete }) => (
      <View style={styles.row}>
            <View style={styles.textBlock}>
                  <Text style={styles.activity}>{activity}</Text>
                  {!!details && <Text style={styles.details}>{details}</Text>}
            </View>
            <Pressable onPress={onDelete} hitSlop={8} style={styles.deleteBtn}>
                  <Icon name="trash-outline" size={17} color={COLORS.error} />
            </Pressable>
      </View>
);

interface EditWorkoutPlanModalProps {
      visible: boolean;
      workoutPlan: WorkoutPlan[];
      onClose: () => void;
      onSave: (plan: WorkoutPlan[]) => Promise<void> | void;
}

const makeTempId = () => `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const EditWorkoutPlanModal: React.FC<EditWorkoutPlanModalProps> = ({
      visible,
      workoutPlan,
      onClose,
      onSave,
}) => {
      const [entries, setEntries] = useState<WorkoutPlan[]>(workoutPlan);
      const [newDay, setNewDay] = useState<string>(DAYS_OF_WEEK[0]);
      const [newActivity, setNewActivity] = useState('');
      const [newDetails, setNewDetails] = useState('');
      const [saving, setSaving] = useState(false);

      // Reset local state each time the modal is (re)opened with fresh data.
      useEffect(() => {
            if (visible) setEntries(workoutPlan);
      }, [visible, workoutPlan]);

      const entriesByDay = useMemo(() => {
            const map = new Map<string, WorkoutPlan[]>();
            DAYS_OF_WEEK.forEach((day) => map.set(day, []));
            entries.forEach((entry) => {
                  const list = map.get(entry.day) ?? [];
                  list.push(entry);
                  map.set(entry.day, list);
            });
            return map;
      }, [entries]);

      const handleAddRow = () => {
            if (!newActivity.trim()) return;
            setEntries((prev) => [
                  ...prev,
                  {
                        _id: makeTempId(),
                        day: newDay,
                        activity: newActivity.trim(),
                        details: newDetails.trim(),
                  },
            ]);
            setNewActivity('');
            setNewDetails('');
      };

      const handleDelete = (id: string) => {
            setEntries((prev) => prev.filter((entry) => entry._id !== id));
      };

      const handleSave = async () => {
            try {
                  setSaving(true);
                  await onSave(entries);
                  onClose();
            } finally {
                  setSaving(false);
            }
      };

      return (
            <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
                  <View style={styles.backdrop}>
                        <KeyboardAvoidingView
                              behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                              style={styles.cardWrap}
                        >
                              <View style={styles.card}>
                                    <ModalHeader
                                          icon="ribbon-outline"
                                          title="Edit Weekly Workout Plan"
                                          onClose={onClose}
                                    />

                                    <ScrollView
                                          style={styles.scroll}
                                          contentContainerStyle={styles.scrollContent}
                                          showsVerticalScrollIndicator={false}
                                    >
                                          {DAYS_OF_WEEK.map((day) => {
                                                const dayEntries = entriesByDay.get(day) ?? [];
                                                return (
                                                      <View key={day} style={styles.dayGroup}>
                                                            <Text style={styles.dayLabel}>{day.toUpperCase()}</Text>
                                                            {dayEntries.length > 0 ? (
                                                                  dayEntries.map((entry) => (
                                                                        <ExerciseRow
                                                                              key={entry._id}
                                                                              activity={entry.activity}
                                                                              details={entry.details}
                                                                              onDelete={() => handleDelete(entry._id)}
                                                                        />
                                                                  ))
                                                            ) : (
                                                                  <Text style={styles.restDay}>Rest Day</Text>
                                                            )}
                                                      </View>
                                                );
                                          })}

                                          <View style={styles.addSection}>
                                                <Text style={styles.addLabel}>Add Exercise Row</Text>

                                                <View style={styles.addRow}>
                                                      <DaySelect
                                                            value={newDay}
                                                            options={DAYS_OF_WEEK}
                                                            onChange={setNewDay}
                                                      />
                                                      <PlainInput
                                                            placeholder="Cardio / PCOS Yoga"
                                                            value={newActivity}
                                                            onChangeText={setNewActivity}
                                                            containerStyle={styles.addRowInputRight}
                                                      />
                                                </View>

                                                <View style={styles.addRow}>
                                                      <PlainInput
                                                            placeholder="Duration / details (e.g. 45 mins, 3 sets)"
                                                            value={newDetails}
                                                            onChangeText={setNewDetails}
                                                            containerStyle={styles.detailsInput}
                                                      />
                                                      <Pressable onPress={handleAddRow} style={styles.addRowBtn}>
                                                            <Text style={styles.addRowBtnText}>Add Row</Text>
                                                      </Pressable>
                                                </View>
                                          </View>
                                    </ScrollView>

                                    <View style={styles.footer}>
                                          <Pressable onPress={onClose} style={styles.cancelBtn}>
                                                <Text style={styles.cancelBtnText}>Cancel</Text>
                                          </Pressable>
                                          <Pressable
                                                onPress={handleSave}
                                                disabled={saving}
                                                style={styles.saveBtn}
                                          >
                                                {saving ? (
                                                      <ActivityIndicator color={COLORS.text} />
                                                ) : (
                                                      <Text style={styles.saveBtnText}>Save Workout Plan</Text>
                                                )}
                                          </Pressable>
                                    </View>
                              </View>
                        </KeyboardAvoidingView>
                  </View>
            </Modal>
      );
};

const styles = StyleSheet.create({
      backdrop: {
            flex: 1,
            backgroundColor: COLORS.overlay,
            alignItems: 'center',
            justifyContent: 'center',
            padding: SPACING.md,
      },
      cardWrap: {
            width: '100%',
            maxHeight: '88%',
      },
      card: {
            backgroundColor: COLORS.surfaceElevated,
            borderRadius: RADII.xl,
            borderWidth: 1,
            borderColor: COLORS.border,
            overflow: 'hidden',
      },
      scroll: {
            maxHeight: 480,
      },
      scrollContent: {
            padding: SPACING.lg - 4,
      },
      dayGroup: {
            backgroundColor: COLORS.surface,
            borderRadius: RADII.lg,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: SPACING.md,
            marginBottom: SPACING.md,
      },
      dayLabel: {
            fontSize: 11.5,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.6,
            color: COLORS.primaryLight,
            marginBottom: SPACING.xs,
      },
      restDay: {
            fontSize: 12.5,
            fontStyle: 'italic',
            color: COLORS.textMuted,
            marginTop: SPACING.xs + 2,
      },
      addSection: {
            marginTop: SPACING.sm,
      },
      addLabel: {
            fontSize: 12,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            color: COLORS.text,
            marginBottom: SPACING.sm + 4,
      },
      addRow: {
            flexDirection: 'row',
            gap: SPACING.sm + 2,
            marginBottom: SPACING.sm + 2,
      },
      addRowInputRight: {
            flex: 1.4,
      },
      detailsInput: {
            flex: 1,
      },
      addRowBtn: {
            height: 48,
            borderRadius: RADII.full,
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: SPACING.lg - 4,
      },
      addRowBtnText: {
            color: COLORS.text,
            fontSize: 13,
            fontWeight: TYPOGRAPHY.extraBold,
      },
      footer: {
            flexDirection: 'row',
            gap: SPACING.sm + 2,
            padding: SPACING.md,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
      },
      cancelBtn: {
            flex: 0.7,
            height: 52,
            borderRadius: RADII.md + 4,
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.border,
            alignItems: 'center',
            justifyContent: 'center',
      },
      cancelBtnText: {
            color: COLORS.text,
            fontSize: 14,
            fontWeight: TYPOGRAPHY.bold,
      },
      saveBtn: {
            flex: 1.6,
            height: 52,
            borderRadius: RADII.md + 4,
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center',
      },
      saveBtnText: {
            color: COLORS.text,
            fontSize: 14,
            fontWeight: TYPOGRAPHY.extraBold,
      },
      row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: COLORS.surface,
            borderRadius: RADII.md + 2,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingVertical: SPACING.sm + 4,
            paddingHorizontal: SPACING.md,
            marginTop: SPACING.sm + 2,
      },
      textBlock: {
            flex: 1,
            marginRight: SPACING.sm,
      },
      activity: {
            fontSize: 14,
            fontWeight: TYPOGRAPHY.bold,
            color: COLORS.text,
            marginBottom: 2,
      },
      details: {
            fontSize: 12,
            color: COLORS.textMuted,
            fontWeight: TYPOGRAPHY.medium,
      },
      deleteBtn: {
            width: 30,
            height: 30,
            alignItems: 'center',
            justifyContent: 'center',
      },
      container: {
            flex: 1,
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
      fieldText: {
            color: COLORS.text,
            fontSize: 13.5,
            fontWeight: TYPOGRAPHY.bold,
      },
      selectbackdrop: {
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
      modalcontainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: SPACING.lg - 4,
            paddingTop: SPACING.lg - 4,
            paddingBottom: SPACING.md,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
      },
      titleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            flexShrink: 1,
      },
      title: {
            fontSize: 15,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            color: COLORS.text,
            marginLeft: SPACING.sm + 2,
            flexShrink: 1,
      },
      closeBtn: {
            width: 30,
            height: 30,
            borderRadius: 15,
            alignItems: 'center',
            justifyContent: 'center',
      },
      input: {
            flex: 1,
            backgroundColor: COLORS.surface,
            borderRadius: RADII.md + 2,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingHorizontal: 14,
            height: 48,
            color: COLORS.text,
            fontSize: 13.5,
            fontWeight: TYPOGRAPHY.medium,
      },
      inputFocused: {
            borderColor: COLORS.gold,
            shadowColor: COLORS.gold,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 4,
      },
});

export default EditWorkoutPlanModal;