import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../theme/theme';
import SectionBadge from '../components/SectionBadge';

interface GoalCard {
      label: string;
      image: string;
      accent: string;
}

const GOAL_CARDS: GoalCard[] = [
      {
            label: 'Vitality & Hormonal Health',
            image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80',
            accent: COLORS.primaryLight,
      },
      {
            label: 'To Build a Consistent Routine',
            image: '',
            accent: COLORS.gold,
      },
      {
            label: 'Self-Love & Personal Confidence',
            image: '',
            accent: COLORS.primaryLight,
      },
      {
            label: 'Lead a Healthier Life',
            image: '',
            accent: COLORS.success,
      },
];

const CARD_WIDTH = Math.min(160, Dimensions.get('window').width * 0.4);

const GoalsSection: React.FC = () => (
      <View style={styles.container}>
            <View style={styles.headerBlock}>
                  <SectionBadge label="FIWM Women's Wellness Program" variant="light" />
                  <Text style={styles.title}>Fitness for Every Woman</Text>
                  <Text style={styles.years}>20 to 50+ Years</Text>
                  <Text style={styles.quote}>
                        &ldquo;For women who want to lose weight, become stronger and feel
                        confident — without leaving their home.&rdquo;
                  </Text>
            </View>

            <Text style={styles.sectionLabel}>Your Goals & Dreams</Text>

            <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.carousel}
            >
                  {GOAL_CARDS.map((card) => (
                        <View key={card.label} style={[styles.card, { width: CARD_WIDTH }]}>
                              {card.image ? (
                                    <Image source={{ uri: card.image }} style={styles.cardImage} />
                              ) : (
                                    <View style={[styles.cardImage, styles.cardImageFallback]} />
                              )}
                              <View style={[styles.cardAccent, { backgroundColor: card.accent }]} />
                              <View style={styles.cardOverlay} />
                              <Text style={styles.cardLabel}>{card.label}</Text>
                        </View>
                  ))}
            </ScrollView>
      </View>
);

const styles = StyleSheet.create({
      container: {
            backgroundColor: COLORS.surfaceLight,
            paddingVertical: 40,
      },
      headerBlock: {
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 28,
      },
      title: {
            fontSize: 24,
            fontWeight: '800',
            color: '#18181B',
            textAlign: 'center',
      },
      years: {
            fontSize: 20,
            fontWeight: '800',
            color: COLORS.gold,
            marginTop: 4,
            marginBottom: 14,
      },
      quote: {
            fontSize: 13,
            fontStyle: 'italic',
            color: '#52525B',
            textAlign: 'center',
            lineHeight: 20,
      },
      sectionLabel: {
            fontSize: 17,
            fontWeight: '800',
            color: '#18181B',
            paddingHorizontal: 20,
            marginBottom: 14,
      },
      carousel: {
            paddingHorizontal: 20,
            gap: 12,
      },
      card: {
            height: 220,
            borderRadius: 18,
            overflow: 'hidden',
            backgroundColor: COLORS.background,
      },
      cardImage: {
            ...StyleSheet.absoluteFill,
      },
      cardImageFallback: {
            backgroundColor: COLORS.surfaceElevated,
      },
      cardOverlay: {
            ...StyleSheet.absoluteFill,
            backgroundColor: 'rgba(9,9,11,0.45)',
      },
      cardAccent: {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
      },
      cardLabel: {
            position: 'absolute',
            bottom: 14,
            left: 14,
            right: 10,
            color: COLORS.text,
            fontSize: 12,
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: 0.4,
      },
});

export default GoalsSection;