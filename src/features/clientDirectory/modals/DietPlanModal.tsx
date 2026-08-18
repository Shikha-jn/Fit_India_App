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
import { DietPlan, MEAL_TYPES } from '../types/clientDirectory';

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

interface OptionSheetSelectProps {
      value: string;
      options: readonly string[];
      onChange: (value: string) => void;
      sheetTitle: string;
}

const OptionSheetSelect: React.FC<OptionSheetSelectProps> = ({
      value,
      options,
      onChange,
      sheetTitle,
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
                        <Pressable style={styles.sheetbackdrop} onPress={close}>
                              <Animated.View
                                    style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
                              >
                                    <View style={styles.sheetHandle} />
                                    <Text style={styles.sheetTitle}>{sheetTitle}</Text>
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

interface FoodRowProps {
      description: string;
      onDelete?: () => void;
}

const FoodRow: React.FC<FoodRowProps> = ({ description, onDelete }) => (
      <View style={styles.row}>
            <Text style={styles.description} numberOfLines={2}>
                  {description}
            </Text>
            <Pressable onPress={onDelete} hitSlop={8} style={styles.deleteBtn}>
                  <Icon name="trash-outline" size={17} color={COLORS.error} />
            </Pressable>
      </View>
);

interface EditDietPlanModalProps {
      visible: boolean;
      dietPlan: DietPlan[];
      onClose: () => void;
      onSave: (plan: DietPlan[]) => Promise<void> | void;
}

const makeTempId = () => `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const EditDietPlanModal: React.FC<EditDietPlanModalProps> = ({
      visible,
      dietPlan,
      onClose,
      onSave,
}) => {
      const [entries, setEntries] = useState<DietPlan[]>(dietPlan);
      const [newMeal, setNewMeal] = useState<string>(MEAL_TYPES[0]);
      const [newDescription, setNewDescription] = useState('');
      const [saving, setSaving] = useState(false);

      useEffect(() => {
            if (visible) setEntries(dietPlan);
      }, [visible, dietPlan]);

      const entriesByMeal = useMemo(() => {
            const map = new Map<string, DietPlan[]>();
            MEAL_TYPES.forEach((meal) => map.set(meal, []));
            entries.forEach((entry) => {
                  const list = map.get(entry.mealName) ?? [];
                  list.push(entry);
                  map.set(entry.mealName, list);
            });
            return map;
      }, [entries]);

      const handleAddRow = () => {
            if (!newDescription.trim()) return;
            setEntries((prev) => [
                  ...prev,
                  {
                        _id: makeTempId(),
                        mealName: newMeal,
                        description: newDescription.trim(),
                  },
            ]);
            setNewDescription('');
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
                                          icon="cafe-outline"
                                          title="Edit Diet & Nutrition Plan"
                                          onClose={onClose}
                                    />

                                    <ScrollView
                                          style={styles.scroll}
                                          contentContainerStyle={styles.scrollContent}
                                          showsVerticalScrollIndicator={false}
                                    >
                                          {MEAL_TYPES.map((meal) => {
                                                const mealEntries = entriesByMeal.get(meal) ?? [];
                                                return (
                                                      <View key={meal} style={styles.mealGroup}>
                                                            <Text style={styles.mealLabel}>{meal.toUpperCase()}</Text>
                                                            {mealEntries.length > 0 ? (
                                                                  mealEntries.map((entry) => (
                                                                        <FoodRow
                                                                              key={entry._id}
                                                                              description={entry.description}
                                                                              onDelete={() => handleDelete(entry._id)}
                                                                        />
                                                                  ))
                                                            ) : (
                                                                  <Text style={styles.noFood}>No food logged</Text>
                                                            )}
                                                      </View>
                                                );
                                          })}

                                          <View style={styles.addSection}>
                                                <Text style={styles.addLabel}>Add Food Row</Text>

                                                <View style={styles.addRow}>
                                                      <OptionSheetSelect
                                                            value={newMeal}
                                                            options={MEAL_TYPES}
                                                            onChange={setNewMeal}
                                                            sheetTitle="Meal Type"
                                                      />
                                                      <PlainInput
                                                            placeholder="e.g. Oatmeal with chia seeds and almonds"
                                                            value={newDescription}
                                                            onChangeText={setNewDescription}
                                                            containerStyle={styles.addRowInputRight}
                                                      />
                                                </View>

                                                <Pressable onPress={handleAddRow} style={styles.addRowBtn}>
                                                      <Text style={styles.addRowBtnText}>Add Row</Text>
                                                </Pressable>
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
                                                      <Text style={styles.saveBtnText}>Save Diet Plan</Text>
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
      mealGroup: {
            backgroundColor: COLORS.surface,
            borderRadius: RADII.lg,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: SPACING.md,
            marginBottom: SPACING.md,
      },
      mealLabel: {
            fontSize: 11.5,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.6,
            color: COLORS.primaryLight,
            marginBottom: SPACING.xs,
      },
      noFood: {
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
            flex: 1.6,
      },
      addRowBtn: {
            height: 48,
            borderRadius: RADII.full,
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center',
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
      description: {
            flex: 1,
            fontSize: 14,
            fontWeight: TYPOGRAPHY.semiBold,
            color: COLORS.text,
            marginRight: SPACING.sm,
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
      sheetbackdrop: {
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
});

export default EditDietPlanModal;