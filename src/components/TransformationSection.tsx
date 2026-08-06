import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS } from '../theme/theme';
import SectionBadge from '../components/SectionBadge';

const TRANSFORMATION_IMAGE =
  'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=700&q=80';

const TransformationSection: React.FC = () => (
  <View style={styles.container}>
    <View style={styles.headerBlock}>
      <SectionBadge label="Real Transformations" variant="primary" />
      <Text style={styles.title}>Inspiring Before & After Stories</Text>
      <Text style={styles.subtitle}>
        Scroll to see the real physical and hormonal transformations of
        women who followed Reena Nimoda's sustainable, habit-first pathways.
      </Text>
    </View>

    <View style={styles.card}>
      <Image source={{ uri: TRANSFORMATION_IMAGE }} style={styles.image} />

      <View style={styles.body}>
        <View style={styles.personRow}>
          <View style={styles.avatar} />
          <View>
            <Text style={styles.personName}>Reena Nimoda (Founder)</Text>
            <Text style={styles.personTag}>Founder's Transformation Pathway</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statBox, styles.statBoxBefore]}>
            <Text style={styles.statLabelBefore}>BEFORE</Text>
            <Text style={styles.statLine}>
              Weight: <Text style={styles.statValue}>70 kg</Text>
            </Text>
            <Text style={styles.statLine}>
              Cycle: <Text style={styles.statValue}>Thyroid & PCOS</Text>
            </Text>
            <Text style={styles.statLine}>
              Energy: <Text style={styles.statValue}>Chronic Fatigue</Text>
            </Text>
          </View>
          <View style={[styles.statBox, styles.statBoxAfter]}>
            <Text style={styles.statLabelAfter}>↗ AFTER</Text>
            <Text style={styles.statLine}>
              Weight: <Text style={styles.statValueAfter}>50 kg</Text>
            </Text>
            <Text style={styles.statLine}>
              Cycle: <Text style={styles.statValueAfter}>Perfect Balance</Text>
            </Text>
            <Text style={styles.statLine}>
              Energy: <Text style={styles.statValueAfter}>Supercharged & Active</Text>
            </Text>
          </View>
        </View>

        <Text style={styles.testimonial}>
          "My own transformation: a twenty kg weight loss journey achieved
          through consistency, not crash diets."
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#18181B',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 13,
    color: '#52525B',
    textAlign: 'center',
    lineHeight: 19,
  },
  card: {
    backgroundColor: COLORS.surfaceLight,
    borderRadius: 22,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 220,
  },
  body: {
    padding: 18,
  },
  personRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E7',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    marginRight: 10,
  },
  personName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#18181B',
  },
  personTag: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
  },
  statBoxBefore: {
    backgroundColor: 'rgba(239, 68, 68, 0.08)',
  },
  statBoxAfter: {
    backgroundColor: 'rgba(34, 197, 94, 0.08)',
  },
  statLabelBefore: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.error,
    marginBottom: 8,
    letterSpacing: 0.4,
  },
  statLabelAfter: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.success,
    marginBottom: 8,
    letterSpacing: 0.4,
  },
  statLine: {
    fontSize: 11,
    color: '#52525B',
    marginBottom: 4,
  },
  statValue: {
    fontWeight: '800',
    color: '#18181B',
  },
  statValueAfter: {
    fontWeight: '800',
    color: '#15803D',
  },
  testimonial: {
    fontSize: 12.5,
    fontStyle: 'italic',
    color: '#71717A',
    lineHeight: 19,
  },
});

export default TransformationSection;