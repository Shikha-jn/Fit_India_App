import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS } from '../theme/theme';
import SectionBadge from '../components/SectionBadge';
import { GradientButton, OutlineButton } from '../components/Buttons';

interface HeroSectionProps {
  onExplorePrograms?: () => void;
  onBookConsultation?: () => void;
}

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80';

const HeroSection: React.FC<HeroSectionProps> = ({
  onExplorePrograms,
  onBookConsultation,
}) => (
  <View style={styles.container}>
    <View style={styles.glow} />

    <SectionBadge label="Empowering 10,000+ Women Across India" icon="sparkles" />

    <Text style={styles.headline}>
      Every Woman Deserves to Be{' '}
      <Text style={styles.headlineGold}>Healthy</Text>
      {' & '}
      <Text style={styles.headlinePink}>Confident</Text>
    </Text>

    <Text style={styles.subtext}>
      We do not believe in starvation diets or extreme routines. We build
      sustainable, scientific, and traditional wellness habits tailored for
      the modern woman.
    </Text>

    <View style={styles.ctaRow}>
      <GradientButton
        label="Explore Programs"
        icon="arrow-forward"
        onPress={onExplorePrograms}
        style={styles.ctaFlex}
      />
      <OutlineButton
        label="Book Consultation"
        onPress={onBookConsultation}
        style={styles.ctaFlex}
      />
    </View>

    <View style={styles.imageCard}>
      <Image source={{ uri: HERO_IMAGE }} style={styles.image} />
      <View style={styles.imageOverlay} />
      <View style={styles.imageTag}>
        <Text style={styles.imageTagText}>YOGA & NUTRITION</Text>
      </View>
      <View style={styles.imageTextBlock}>
        <Text style={styles.imageTitle}>Hormonal & PCOS Care</Text>
        <Text style={styles.imageDesc}>
          Scientific habits to balance hormones and restore energy.
        </Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 40,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -60,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(166, 24, 82, 0.14)',
  },
  headline: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    lineHeight: 40,
    marginBottom: 14,
  },
  headlineGold: {
    color: COLORS.gold,
  },
  headlinePink: {
    color: COLORS.primaryLight,
  },
  subtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 21,
    marginBottom: 24,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  ctaFlex: {
    flex: 1,
  },
  imageCard: {
    borderRadius: 24,
    overflow: 'hidden',
    height: 280,
    backgroundColor: COLORS.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(9,9,11,0.35)',
  },
  imageTag: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(166, 24, 82, 0.85)',
    borderRadius: 999,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  imageTagText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  imageTextBlock: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
  },
  imageTitle: {
    color: COLORS.text,
    fontSize: 19,
    fontWeight: '800',
    marginBottom: 4,
  },
  imageDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
});

export default HeroSection;