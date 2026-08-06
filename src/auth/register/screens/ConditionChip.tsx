import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../theme/theme';

interface ConditionChipProps {
      label: string;
      selected: boolean;
      onPress: () => void;
}

const ConditionChip: React.FC<ConditionChipProps> = ({ label, selected, onPress }) => {
      return (
            <Pressable
                  onPress={onPress}
                  style={[
                        styles.chip,
                        selected ? styles.chipSelected : styles.chipUnselected,
                  ]}
            >
                  {selected && (
                        <Icon
                              name="checkmark-circle"
                              size={14}
                              color={COLORS.gold}
                              style={styles.checkIcon}
                        />
                  )}
                  <Text style={[styles.label, { color: selected ? COLORS.text : COLORS.textSecondary }]}>
                        {label}
                  </Text>
            </Pressable>
      );
};

const styles = StyleSheet.create({
      chip: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 14,
            borderWidth: 1,
            minWidth: '31%',
      },
      chipUnselected: {
            backgroundColor: COLORS.surface,
            borderColor: COLORS.border,
      },
      chipSelected: {
            backgroundColor: COLORS.primaryDark,
            borderColor: COLORS.gold,
            shadowColor: COLORS.gold,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.35,
            shadowRadius: 6,
            elevation: 3,
      },
      checkIcon: {
            marginRight: 4,
      },
      label: {
            fontSize: 12,
            fontWeight: '600',
      },
});

export default ConditionChip;