import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../theme/theme';

interface SectionBadgeProps {
      label: string;
      icon?: string;
      variant?: 'dark' | 'light' | 'primary';
}

const SectionBadge: React.FC<SectionBadgeProps> = ({
      label,
      icon,
      variant = 'dark',
}) => {
      const variantStyle = VARIANTS[variant];
      return (
            <View style={[styles.badge, variantStyle.container]}>
                  {!!icon && (
                        <Icon name={icon} size={12} color={variantStyle.textColor} style={styles.icon} />
                  )}
                  <Text style={[styles.label, { color: variantStyle.textColor }]}>{label}</Text>
            </View>
      );
};

const VARIANTS = {
      dark: {
            container: {
                  backgroundColor: 'rgba(212, 171, 58, 0.12)',
                  borderColor: 'rgba(212, 171, 58, 0.4)',
            },
            textColor: COLORS.gold,
      },
      light: {
            container: {
                  backgroundColor: COLORS.goldLight + '22',
                  borderColor: COLORS.gold,
            },
            textColor: COLORS.goldDark,
      },
      primary: {
            container: {
                  backgroundColor: 'rgba(166, 24, 82, 0.12)',
                  borderColor: 'rgba(166, 24, 82, 0.4)',
            },
            textColor: COLORS.primaryLight,
      },
};

const styles = StyleSheet.create({
      badge: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            borderRadius: 999,
            borderWidth: 1,
            paddingVertical: 6,
            paddingHorizontal: 14,
            marginBottom: 12,
      },
      icon: {
            marginRight: 6,
      },
      label: {
            fontSize: 11,
            fontWeight: '800',
            letterSpacing: 0.6,
            textTransform: 'uppercase',
      },
});

export default SectionBadge;