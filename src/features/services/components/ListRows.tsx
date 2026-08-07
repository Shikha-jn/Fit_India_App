import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../theme/theme';

interface ChecklistRowProps {
      text: string;
      boldPrefix?: string;
      tone?: 'gold' | 'primary';
      dense?: boolean;
}

/**
 * A single checklist line. If `boldPrefix` is supplied and found at the
 * start of `text`, that portion renders bold (matches reference where e.g.
 * "100% Women-Only Community" is bold and the rest isn't).
 */
export const ChecklistRow: React.FC<ChecklistRowProps> = ({
      text,
      tone = 'gold',
      dense,
}) => {
      const color = tone === 'gold' ? COLORS.gold : COLORS.primaryLight;
      return (
            <View style={[styles.row, dense && styles.rowDense]}>
                  <Icon name="checkmark" size={14} color={color} style={styles.icon} />
                  <Text style={styles.text}>{text}</Text>
            </View>
      );
};

interface HeartTagProps {
      label: string;
}

export const HeartTag: React.FC<HeartTagProps> = ({ label }) => (
      <View style={styles.heartRow}>
            <Icon name="heart-outline" size={13} color={COLORS.primaryLight} style={styles.icon} />
            <Text style={styles.heartText}>{label}</Text>
      </View>
);

const styles = StyleSheet.create({
      row: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 14,
      },
      rowDense: {
            marginBottom: 10,
      },
      icon: {
            marginRight: 8,
            marginTop: 2,
      },
      text: {
            flex: 1,
            color: COLORS.textSecondary,
            fontSize: 13,
            lineHeight: 19,
            fontWeight: '600',
      },
      heartRow: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '48%',
            marginBottom: 12,
      },
      heartText: {
            color: COLORS.textSecondary,
            fontSize: 12.5,
            fontWeight: '600',
      },
});