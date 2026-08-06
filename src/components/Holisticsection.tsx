import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS } from '../theme/theme';
import SectionBadge from '../components/SectionBadge';
import IconSquare from '../components/IconsSquare';

interface Feature {
      icon: string;
      title: string;
      description: string;
      tone: 'gold' | 'primary';
}

const FEATURES: Feature[] = [
      {
            icon: 'nutrition-outline',
            title: 'Personalized Diet Plans',
            description:
                  'Custom hormone-balancing nutrition charts based on simple, daily Indian kitchen ingredients.',
            tone: 'gold',
      },
      {
            icon: 'pulse-outline',
            title: 'Dedicated Health Metrics',
            description:
                  'Weekly reviews tracking sleep, energy levels, cycle wellness, and body compositions.',
            tone: 'primary',
      },
      {
            icon: 'calendar-outline',
            title: 'Structured Timetable',
            description: 'A clear, sustainable weekly routine built around your real life, not against it.',
            tone: 'gold',
      },
      {
            icon: 'ribbon-outline',
            title: 'Certified Coaching Expert',
            description:
                  'One-on-one evaluations and consultation directly with wellness counselor Reena Nimoda.',
            tone: 'gold',
      },
      {
            icon: 'sparkles-outline',
            title: 'Hormonal Correction Tracks',
            description:
                  'Lifestyle changes targeted directly at PCOS, PCOD, thyroid, menopause, and postpartum recovery.',
            tone: 'primary',
      },
      {
            icon: 'people-outline',
            title: 'Empowerment Community',
            description: 'A supportive circle of women on the same journey, cheering each other on.',
            tone: 'gold',
      },
];

const CENTER_IMAGE =
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=700&q=80';

const HolisticSection: React.FC = () => (
      <View style={styles.container}>
            <View style={styles.headerBlock}>
                  <SectionBadge label="Holistic Living" variant="light" />
                  <Text style={styles.title}>Fit India is Not Just an Average Workout</Text>
                  <Text style={styles.subtitle}>
                        It is a scientific, habit-based lifestyle correction system designed
                        to balance your hormones, improve your strength, and restore your
                        inner vitality. With expert guidance and tailored nutrition, you can
                        rebuild your health with no extreme routines and no crash diets at
                        all!
                  </Text>
            </View>

            <Image source={{ uri: CENTER_IMAGE }} style={styles.centerImage} />

            <View style={styles.featureList}>
                  {FEATURES.map((feature) => (
                        <View key={feature.title} style={styles.featureRow}>
                              <IconSquare icon={feature.icon} tone={feature.tone} />
                              <View style={styles.featureText}>
                                    <Text style={styles.featureTitle}>{feature.title}</Text>
                                    <Text style={styles.featureDesc}>{feature.description}</Text>
                              </View>
                        </View>
                  ))}
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
            fontSize: 24,
            fontWeight: '800',
            color: '#18181B',
            textAlign: 'center',
            lineHeight: 30,
            marginBottom: 12,
      },
      subtitle: {
            fontSize: 13,
            color: '#52525B',
            textAlign: 'center',
            lineHeight: 20,
      },
      centerImage: {
            width: '100%',
            height: 220,
            borderRadius: 20,
            marginBottom: 28,
      },
      featureList: {
            gap: 20,
      },
      featureRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
      },
      featureText: {
            flex: 1,
            marginLeft: 14,
      },
      featureTitle: {
            fontSize: 15,
            fontWeight: '800',
            color: '#18181B',
            marginBottom: 4,
      },
      featureDesc: {
            fontSize: 12.5,
            color: '#71717A',
            lineHeight: 18,
      },
});

export default HolisticSection;