import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../theme/theme';
import SectionBadge from '../components/SectionBadge';

interface Stat {
      icon: string;
      value: string;
      label: string;
      description: string;
}

const STATS: Stat[] = [
      { icon: 'ribbon', value: '13+', label: 'Years Experience', description: "Dedicated to women's health" },
      { icon: 'people', value: '10,000+', label: 'Lives Transformed', description: 'Healthy, strong & confident women' },
      { icon: 'sparkles', value: '10k+', label: 'Happy Families', description: 'Healthy mothers build strong homes' },
      { icon: 'flame', value: '99%', label: 'Success Rate', description: 'Long-term lifestyle correction' },
];

const BG_IMAGE =
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80';

const ImpactSection: React.FC = () => (
      <View style={styles.container}>
            <Image source={{ uri: BG_IMAGE }} style={StyleSheet.absoluteFill} />
            <View style={styles.overlay} />

            <View style={styles.headerBlock}>
                  <SectionBadge label="Our Legacy of Trust" variant="primary" />
                  <Text style={styles.title}>Our Impact In Numbers</Text>
                  <Text style={styles.subtitle}>
                        Every number represents a story of dedication, health correction,
                        and newfound self-confidence.
                  </Text>
            </View>

            <View style={styles.grid}>
                  {STATS.map((stat) => (
                        <View key={stat.label} style={styles.statCard}>
                              <View style={styles.statIcon}>
                                    <Icon name={stat.icon} size={16} color={COLORS.primaryLight} />
                              </View>
                              <Text style={styles.statValue}>{stat.value}</Text>
                              <Text style={styles.statLabel}>{stat.label}</Text>
                              <Text style={styles.statDesc}>{stat.description}</Text>
                        </View>
                  ))}
            </View>
      </View>
);

const styles = StyleSheet.create({
      container: {
            paddingVertical: 44,
            paddingHorizontal: 20,
            overflow: 'hidden',
      },
      overlay: {
            ...StyleSheet.absoluteFill,
            backgroundColor: 'rgba(9,9,11,0.82)',
      },
      headerBlock: {
            alignItems: 'center',
            marginBottom: 28,
      },
      title: {
            fontSize: 24,
            fontWeight: '800',
            color: COLORS.text,
            textAlign: 'center',
            marginBottom: 10,
      },
      subtitle: {
            fontSize: 13,
            color: COLORS.textSecondary,
            textAlign: 'center',
            lineHeight: 19,
      },
      grid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
      },
      statCard: {
            width: '47%',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.1)',
            borderRadius: 18,
            padding: 16,
      },
      statIcon: {
            width: 34,
            height: 34,
            borderRadius: 10,
            backgroundColor: 'rgba(166, 24, 82, 0.18)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 12,
      },
      statValue: {
            fontSize: 26,
            fontWeight: '800',
            color: COLORS.text,
            marginBottom: 2,
      },
      statLabel: {
            fontSize: 12,
            fontWeight: '800',
            color: COLORS.primaryLight,
            marginBottom: 4,
      },
      statDesc: {
            fontSize: 10.5,
            color: COLORS.textMuted,
            lineHeight: 14,
      },
});

export default ImpactSection;