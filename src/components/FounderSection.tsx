import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS } from '../theme/theme';
import SectionBadge from '../components/SectionBadge';
import { SolidButton, OutlineButton } from '../components/Buttons';

const FOUNDER_IMAGE =
      'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=700&q=80';

interface FounderSectionProps {
      onReadStory?: () => void;
      onGetConsultation?: () => void;
}

const FounderSection: React.FC<FounderSectionProps> = ({
      onReadStory,
      onGetConsultation,
}) => (
      <View style={styles.container}>
            <View style={styles.imageWrap}>
                  <Image source={{ uri: FOUNDER_IMAGE }} style={styles.image} />
                  <View style={styles.experienceBadge}>
                        <Text style={styles.experienceText}>13+ Years Experience</Text>
                  </View>
            </View>

            <SectionBadge label="Meet the Founder" variant="light" />
            <Text style={styles.name}>Reena Nimoda</Text>
            <Text style={styles.role}>
                  FITNESS EXPERT · WOMEN'S HEALTH & FITNESS COACH · FOUNDER — FIT INDIA
                  WOMEN MISSION (FIWM)
            </Text>

            <Text style={styles.quote}>
                  &ldquo;Every woman has the right to live a healthy life.&rdquo;
            </Text>

            <Text style={styles.paragraph}>
                  My fitness journey is not just about exercise; it is a story of
                  transformation, dedication, and a mission to empower women.
            </Text>
            <Text style={styles.paragraph}>
                  With over <Text style={styles.bold}>13 years of experience</Text> in
                  the fitness industry, I started my own journey at{' '}
                  <Text style={styles.bold}>70 kg</Text> and transformed to{' '}
                  <Text style={styles.bold}>50 kg</Text> — 20 kg lost through discipline,
                  consistency, and a healthy lifestyle.
            </Text>

            <View style={styles.ctaRow}>
                  <SolidButton label="Read Reena's Story" style={styles.ctaFlex} onPress={onReadStory} />
                  <OutlineButton
                        label="Get Free Consultation"
                        style={styles.ctaFlex}
                        onPress={onGetConsultation}
                  />
            </View>
      </View>
);

const styles = StyleSheet.create({
      container: {
            backgroundColor: COLORS.backgroundLight,
            paddingHorizontal: 20,
            paddingVertical: 40,
      },
      imageWrap: {
            marginBottom: 20,
      },
      image: {
            width: '100%',
            height: 320,
            borderRadius: 22,
      },
      experienceBadge: {
            position: 'absolute',
            bottom: -14,
            left: 16,
            backgroundColor: '#18181B',
            borderRadius: 999,
            paddingVertical: 8,
            paddingHorizontal: 16,
      },
      experienceText: {
            color: COLORS.gold,
            fontSize: 11,
            fontWeight: '800',
      },
      name: {
            fontSize: 26,
            fontWeight: '800',
            color: '#18181B',
            marginTop: 6,
            marginBottom: 6,
      },
      role: {
            fontSize: 11,
            fontWeight: '700',
            color: '#71717A',
            letterSpacing: 0.4,
            lineHeight: 16,
            marginBottom: 16,
      },
      quote: {
            fontSize: 15,
            fontStyle: 'italic',
            color: COLORS.goldDark,
            marginBottom: 16,
      },
      paragraph: {
            fontSize: 13,
            color: '#3F3F46',
            lineHeight: 20,
            marginBottom: 12,
      },
      bold: {
            fontWeight: '800',
            color: '#18181B',
      },
      ctaRow: {
            flexDirection: 'row',
            gap: 12,
            marginTop: 12,
      },
      ctaFlex: {
            flex: 1,
      },
});

export default FounderSection;