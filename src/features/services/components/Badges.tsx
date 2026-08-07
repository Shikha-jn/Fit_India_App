import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../theme/theme';

interface SectionBadgeProps {
      label: string;
      icon?: string;
      tone?: 'gold' | 'primary' | 'light';
}

const TONES = {
      gold: {
            bg: 'rgba(212, 171, 58, 0.14)',
            border: 'rgba(212, 171, 58, 0.4)',
            text: COLORS.gold,
      },
      primary: {
            bg: 'rgba(166, 24, 82, 0.16)',
            border: 'rgba(166, 24, 82, 0.4)',
            text: COLORS.primaryLight,
      },
      light: {
            bg: COLORS.goldLight + '22',
            border: COLORS.gold,
            text: COLORS.goldDark,
      },
};

export const SectionBadge: React.FC<SectionBadgeProps> = ({
      label,
      icon,
      tone = 'gold',
}) => {
      const t = TONES[tone];
      return (
            <View style={[styles.badge, { backgroundColor: t.bg, borderColor: t.border }]}>
                  {!!icon && <Icon name={icon} size={12} color={t.text} style={styles.icon} />}
                  <Text style={[styles.label, { color: t.text }]}>{label}</Text>
            </View>
      );
};

interface TagPillProps {
      label: string;
      dark?: boolean;
}

export const TagPill: React.FC<TagPillProps> = ({ label, dark }) => (
      <View
            style={[
                  styles.tagPill,
                  { backgroundColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(166, 24, 82, 0.12)' },
            ]}
      >
            <Text
                  style={[
                        styles.tagLabel,
                        { color: dark ? COLORS.textSecondary : COLORS.primaryLight },
                  ]}
            >
                  {label}
            </Text>
      </View>
);

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
      tagPill: {
            borderRadius: 999,
            paddingVertical: 6,
            paddingHorizontal: 12,
      },
      tagLabel: {
            fontSize: 9.5,
            fontWeight: '800',
            letterSpacing: 0.4,
            textTransform: 'uppercase',
      },
});