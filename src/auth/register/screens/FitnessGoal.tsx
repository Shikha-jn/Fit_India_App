import React, { useState } from 'react';
import {
      View,
      Text,
      Pressable,
      Modal,
      FlatList,
      StyleSheet,
      Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../theme/theme';

interface FitnessGoalSelectProps {
      value: string;
      options: string[];
      onChange: (value: string) => void;
}

const FitnessGoalSelect: React.FC<FitnessGoalSelectProps> = ({
      value,
      options,
      onChange,
}) => {
      const [visible, setVisible] = useState(false);
      const slideAnim = React.useRef(new Animated.Value(300)).current;

      const openModal = () => {
            setVisible(true);
            Animated.spring(slideAnim, {
                  toValue: 0,
                  useNativeDriver: true,
                  friction: 10,
                  tension: 80,
            }).start();
      };

      const closeModal = () => {
            Animated.timing(slideAnim, {
                  toValue: 300,
                  duration: 180,
                  useNativeDriver: true,
            }).start(() => setVisible(false));
      };

      const handleSelect = (item: string) => {
            onChange(item);
            closeModal();
      };

      return (
            <>
                  <Pressable style={styles.field} onPress={openModal}>
                        <Text style={styles.fieldText}>{value}</Text>
                        <Icon name="chevron-down" size={18} color={COLORS.textMuted} />
                  </Pressable>

                  <Modal
                        visible={visible}
                        transparent
                        animationType="fade"
                        onRequestClose={closeModal}
                  >
                        <Pressable style={styles.backdrop} onPress={closeModal}>
                              <Animated.View
                                    style={[
                                          styles.sheet,
                                          { transform: [{ translateY: slideAnim }] },
                                    ]}
                              >
                                    <View style={styles.sheetHandle} />
                                    <Text style={styles.sheetTitle}>Primary Fitness Goal</Text>
                                    <FlatList
                                          data={options}
                                          keyExtractor={(item) => item}
                                          renderItem={({ item }) => {
                                                const isSelected = item === value;
                                                return (
                                                      <Pressable
                                                            style={styles.option}
                                                            onPress={() => handleSelect(item)}
                                                      >
                                                            <Text
                                                                  style={[
                                                                        styles.optionText,
                                                                        { color: isSelected ? COLORS.gold : COLORS.text },
                                                                  ]}
                                                            >
                                                                  {item}
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
            </>
      );
};

const styles = StyleSheet.create({
      field: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: COLORS.surface,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingHorizontal: 16,
            height: 52,
      },
      fieldText: {
            color: COLORS.text,
            fontSize: 14,
            fontWeight: '500',
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
            maxHeight: '60%',
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

export default FitnessGoalSelect;