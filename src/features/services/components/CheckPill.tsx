import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../theme/theme';

interface CheckPillProps {
      label: string;
}

const CheckPill: React.FC<CheckPillProps> = ({ label }) => (
      <View style={styles.pill}>
            <View style={styles.checkCircle}>
                  <Icon name="checkmark" size={12} color={COLORS.background} />
            </View>
            <Text style={styles.label} numberOfLines={1}>
                  {label}
            </Text>
      </View>
);

const styles = StyleSheet.create({
      pill: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(9,9,11,0.55)',
            borderRadius: 14,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.14)',
            paddingVertical: 10,
            paddingHorizontal: 12,
      },
      checkCircle: {
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: COLORS.gold,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
      },
      label: {
            color: COLORS.text,
            fontSize: 12.5,
            fontWeight: '800',
            flexShrink: 1,
      },
});

export default CheckPill;