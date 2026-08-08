import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/theme';

interface StatRowProps {
      label: string;
      value: string;
      emphasize?: boolean;
}

const StatRow: React.FC<StatRowProps> = ({ label, value, emphasize }) => (
      <View style={styles.row}>
            <Text style={[styles.label, emphasize && styles.labelEmphasize]}>{label}</Text>
            <Text style={[styles.value, emphasize && styles.valueEmphasize]}>{value}</Text>
      </View>
);

const styles = StyleSheet.create({
      row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 10,
      },
      label: {
            fontSize: 13.5,
            fontWeight: '600',
            color: '#3F3F46',
      },
      labelEmphasize: {
            fontWeight: '800',
            color: COLORS.primary,
      },
      value: {
            fontSize: 14,
            fontWeight: '800',
            color: '#18181B',
      },
      valueEmphasize: {
            color: COLORS.primary,
      },
});

export default StatRow;