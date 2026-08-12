import React, { useState, useRef } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet, TextInput, Animated, Modal, TextInputProps } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../theme/theme';
import { HealthLogPayload, PeriodsCycleStatus } from '../types/healthRecord';

export function formatRecordDate(dateStr: string): string {
      const date = new Date(dateStr);
      if (Number.isNaN(date.getTime())) return dateStr;
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
}
const OPTIONS: PeriodsCycleStatus[] =
      ['None/Regular', 'Follicular Phase', 'Irregular', 'Letual Phase', 'Menstruation (Period)', 'Ovulation', 'Postmartum'];

interface CycleStatusPickerProps {
      value: PeriodsCycleStatus;
      onChange: (value: PeriodsCycleStatus) => void;
}

const CycleStatusPicker: React.FC<CycleStatusPickerProps> = ({
      value,
      onChange,
}) => {
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

      const handleSelect = (option: PeriodsCycleStatus) => {
            onChange(option);
            close();
      };

      return (
            <View style={styles.cyccontainer}>
                  <Text style={styles.cyclabel}>Menstrual Cycle Stage</Text>
                  <Pressable style={styles.field} onPress={open}>
                        <Text style={styles.fieldText}>{value}</Text>
                        <Icon name="chevron-down" size={18} color={COLORS.textMuted} />
                  </Pressable>

                  <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
                        <Pressable style={styles.backdrop} onPress={close}>
                              <Animated.View
                                    style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
                              >
                                    <View style={styles.sheetHandle} />
                                    <Text style={styles.sheetTitle}>Menstrual Cycle Stage</Text>
                                    {OPTIONS.map((option) => {
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

interface FormFieldProps extends TextInputProps {
      label: string;
      containerStyle?: object;
}

const FormField: React.FC<FormFieldProps> = ({
      label,
      containerStyle,
      style,
      multiline,
      ...rest
}) => {
      const [focused, setFocused] = useState(false);

      return (
            <View style={[styles.container, containerStyle]}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                        placeholderTextColor={COLORS.textMuted}
                        multiline={multiline}
                        style={[
                              styles.input,
                              multiline && styles.inputMultiline,
                              focused && styles.inputFocused,
                              style,
                        ]}
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
            </View>
      );
};

interface LogProgressFormProps {
      onSave?: (payload: HealthLogPayload) => Promise<void> | void;
}

const HealthRecordForm: React.FC<LogProgressFormProps> = ({ onSave }) => {
      const [waterIntake, setWaterIntake] = useState('');
      const [calorieIntake, setCalorieIntake] = useState('');
      const [calorieBurned, setCalorieBurned] = useState('');
      const [cycleStatus, setCycleStatus] = useState<PeriodsCycleStatus>('None/Regular');
      const [notes, setNotes] = useState('');
      const [saving, setSaving] = useState(false);
      const [weight, setWeight] = useState('');
      const [date, setDate] = useState('');

      const handleSave = async () => {
            const payload: HealthLogPayload = {
                  waterIntake: Number(waterIntake) || 0,
                  calorieIntake: Number(calorieIntake) || 0,
                  calorieBurned: Number(calorieBurned) || 0,
                  periodsCycleStatus: cycleStatus,
                  notes: notes.trim(),
                  weight: Number(weight) || 0,
                  date: formatRecordDate(new Date().toString())
            };

            try {
                  setSaving(true);
                  await onSave?.(payload);
                  setWaterIntake('');
                  setCalorieIntake('');
                  setCalorieBurned('');
                  setCycleStatus('None/Regular');
                  setNotes('');
            } finally {
                  setSaving(false);
            }
      };

      return (
            <View style={styles.card}>
                  <View style={styles.header}>
                        <View style={styles.plusCircle}>
                              <Icon name="add" size={16} color={COLORS.primary} />
                        </View>
                        <Text style={styles.headerText}>Log Daily Progress</Text>
                  </View>

                  <FormField
                        label="Water Intake (Liters)"
                        placeholder="e.g. 2.5"
                        value={waterIntake}
                        onChangeText={setWaterIntake}
                        keyboardType="decimal-pad"
                  />

                  <View style={styles.row}>
                        <FormField
                              label="Calories In"
                              placeholder="1500"
                              value={calorieIntake}
                              onChangeText={setCalorieIntake}
                              keyboardType="number-pad"
                              containerStyle={styles.rowItem}
                        />
                        <FormField
                              label="Calories Burned"
                              placeholder="300"
                              value={calorieBurned}
                              onChangeText={setCalorieBurned}
                              keyboardType="number-pad"
                              containerStyle={styles.rowItem}
                        />
                  </View>

                  <CycleStatusPicker value={cycleStatus} onChange={setCycleStatus} />

                  <FormField
                        label="Notes"
                        placeholder="How do you feel today?"
                        value={notes}
                        onChangeText={setNotes}
                        multiline
                  />

                  <Pressable onPress={handleSave} disabled={saving} style={styles.saveBtn}>
                        {saving ? (
                              <ActivityIndicator color={COLORS.text} />
                        ) : (
                              <Text style={styles.saveBtnText}>Save Log</Text>
                        )}
                  </Pressable>
            </View>
      );
};

const styles = StyleSheet.create({
      card: {
            backgroundColor: COLORS.surfaceElevated,
            borderRadius: 22,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 20,
            marginHorizontal: 16,
            marginTop: 16,
      },
      header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 22,
      },
      plusCircle: {
            width: 30,
            height: 30,
            borderRadius: 15,
            borderWidth: 1.5,
            borderColor: COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
      },
      headerText: {
            fontSize: 17,
            fontWeight: '800',
            color: COLORS.text,
      },
      row: {
            flexDirection: 'row',
            gap: 12,
      },
      rowItem: {
            flex: 1,
      },
      saveBtn: {
            height: 52,
            borderRadius: 14,
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 4,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 12,
            elevation: 6,
      },
      saveBtnText: {
            color: COLORS.text,
            fontSize: 14,
            fontWeight: '800',
      },
      //form field styles
      container: {
            marginBottom: 18,
      },
      label: {
            fontSize: 11,
            fontWeight: '800',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: COLORS.textMuted,
            marginBottom: 8,
      },
      input: {
            backgroundColor: COLORS.surface,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingHorizontal: 16,
            height: 50,
            color: COLORS.text,
            fontSize: 14,
            fontWeight: '600',
      },
      inputMultiline: {
            height: 90,
            paddingTop: 14,
            textAlignVertical: 'top',
      },
      inputFocused: {
            borderColor: COLORS.gold,
            shadowColor: COLORS.gold,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 4,
      },
      //cycle picker styles
      cyccontainer: {
            marginBottom: 18,
      },
      cyclabel: {
            fontSize: 11,
            fontWeight: '800',
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
            borderRadius: 14,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingHorizontal: 16,
            height: 50,
      },
      fieldText: {
            color: COLORS.text,
            fontSize: 14,
            fontWeight: '600',
      },
      backdrop: {
            flex: 1,
            backgroundColor: COLORS.overlay,
            justifyContent: 'flex-end',
      },
      sheet: {
            backgroundColor: COLORS.surfaceElevated,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 32,
            borderTopWidth: 1,
            borderColor: COLORS.border,
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
            fontWeight: '700',
            letterSpacing: 0.6,
            textTransform: 'uppercase',
            marginBottom: 8,
      },
      option: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
      },
      optionText: {
            fontSize: 15,
            fontWeight: '600',
      },
});

export default HealthRecordForm;