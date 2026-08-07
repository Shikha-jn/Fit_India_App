import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/theme';
import { SectionBadge } from '../components/Badges';
import Icon from 'react-native-vector-icons/Ionicons';

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

const HERO_IMAGE =
      'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=900&q=80';

const HIGHLIGHTS = [
      'Hormonal Wellness',
      'Weight Correction',
      'Strength & Posture',
      'Post-Pregnancy Recovery',
];

const ProgramsHeroSection: React.FC = () => (
      <View style={styles.container}>
            <Image source={{ uri: HERO_IMAGE }} style={StyleSheet.absoluteFill} />
            <View style={styles.overlay} />

            <View style={styles.content}>
                  <SectionBadge label="Science-Backed Support" tone="light" />
                  <Text style={styles.title}>Our Health & Wellness Programs</Text>
                  <Text style={styles.subtitle}>
                        Every program is designed from scratch to accommodate modern
                        routines, hormonal profiles, and daily home-cooked foods.
                  </Text>

                  <View style={styles.grid}>
                        {HIGHLIGHTS.map((label) => (
                              <View key={label} style={styles.gridItem}>
                                    <CheckPill label={label} />
                              </View>
                        ))}
                  </View>
            </View>
      </View>
);

const styles = StyleSheet.create({
      container: {
            minHeight: 460,
            paddingHorizontal: 20,
            paddingTop: 48,
            paddingBottom: 32,
            overflow: 'hidden',
            justifyContent: 'flex-end',
      },
      overlay: {
            ...StyleSheet.absoluteFill,
            backgroundColor: 'rgba(9,9,11,0.6)',
      },
      content: {},
      title: {
            fontSize: 30,
            fontWeight: '800',
            color: COLORS.text,
            lineHeight: 37,
            marginBottom: 12,
      },
      subtitle: {
            fontSize: 13,
            color: COLORS.textSecondary,
            lineHeight: 20,
            marginBottom: 24,
      },
      grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginHorizontal: -5,
      },
      gridItem: {
            width: '50%',
            paddingHorizontal: 5,
            marginBottom: 10,
      },
      // CheckPill styles
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

export default ProgramsHeroSection;