import React from 'react';
import { View, Text, Image, Pressable, ScrollView, StyleSheet } from 'react-native';
import { COLORS } from '../theme/theme';
import SectionBadge from '../components/SectionBadge';
import IconSquare from '../components/IconsSquare';

interface Pathway {
      icon: string;
      title: string;
      description: string;
      tag: string;
      highlighted?: boolean;
}

const PATHWAYS: Pathway[] = [
      {
            icon: 'heart',
            title: 'Hormonal Wellness & Care',
            description:
                  'Scientific lifestyle correction for managing PCOS, PCOD, Thyroid, and Menopause symptoms through customized nutrition and fitness.',
            tag: '3 & 6 MONTHS',
            highlighted: true,
      },
      {
            icon: 'pulse',
            title: 'Weight Correction & Nutrition',
            description:
                  'Sustainable fat loss without crash dieting. Build healthy long-term habits to maintain your dream weight forever.',
            tag: 'MONTHLY / QUARTERLY',
      },
      {
            icon: 'shield-checkmark',
            title: 'Strength & Flexibility',
            description:
                  'Tailored online fitness classes designed to increase bone density, build core strength, and improve posture.',
            tag: 'MONTHLY PROGRAM',
      },
];

const BG_IMAGE =
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=80';

interface PathwaysSectionProps {
      onExploreAll?: () => void;
}

const PathwaysSection: React.FC<PathwaysSectionProps> = ({ onExploreAll }) => (
      <View style={styles.container}>
            <Image source={{ uri: BG_IMAGE }} style={StyleSheet.absoluteFill} />
            <View style={styles.overlay} />

            <View style={styles.headerBlock}>
                  <SectionBadge label="Our Core Programs" variant="primary" />
                  <Text style={styles.title}>Tailored Wellness Pathways</Text>
                  <Text style={styles.subtitle}>
                        Choose a scientific program curated by health expert Reena Nimoda to
                        begin your lifestyle modification journey today.
                  </Text>
            </View>

            <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.cardsRow}
            >
                  {PATHWAYS.map((item) => (
                        <View
                              key={item.title}
                              style={[styles.card, item.highlighted ? styles.cardDark : styles.cardLight]}
                        >
                              <View style={styles.cardTop}>
                                    <IconSquare icon={item.icon} tone="primary" size={40} />
                                    <View style={styles.tagPill}>
                                          <Text style={styles.tagText}>{item.tag}</Text>
                                    </View>
                              </View>
                              <Text
                                    style={[
                                          styles.cardTitle,
                                          { color: item.highlighted ? COLORS.text : '#18181B' },
                                    ]}
                              >
                                    {item.title}
                              </Text>
                              <Text
                                    style={[
                                          styles.cardDesc,
                                          { color: item.highlighted ? COLORS.textSecondary : '#52525B' },
                                    ]}
                              >
                                    {item.description}
                              </Text>
                        </View>
                  ))}
            </ScrollView>

            <Pressable onPress={onExploreAll} style={styles.exploreLink}>
                  <Text style={styles.exploreLinkText}>Explore all services & customized plans →</Text>
            </Pressable>
      </View>
);

const styles = StyleSheet.create({
      container: {
            paddingVertical: 44,
            overflow: 'hidden',
      },
      overlay: {
            ...StyleSheet.absoluteFill,
            backgroundColor: 'rgba(9,9,11,0.72)',
      },
      headerBlock: {
            alignItems: 'center',
            paddingHorizontal: 20,
            marginBottom: 24,
      },
      title: {
            fontSize: 23,
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
      cardsRow: {
            paddingHorizontal: 20,
            gap: 14,
      },
      card: {
            width: 260,
            borderRadius: 22,
            padding: 20,
      },
      cardDark: {
            backgroundColor: 'rgba(24,24,27,0.92)',
            borderWidth: 1,
            borderColor: COLORS.border,
      },
      cardLight: {
            backgroundColor: COLORS.surfaceLight,
      },
      cardTop: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 18,
      },
      tagPill: {
            backgroundColor: 'rgba(166, 24, 82, 0.14)',
            borderRadius: 999,
            paddingVertical: 5,
            paddingHorizontal: 10,
      },
      tagText: {
            color: COLORS.primaryLight,
            fontSize: 9,
            fontWeight: '800',
            letterSpacing: 0.4,
      },
      cardTitle: {
            fontSize: 17,
            fontWeight: '800',
            marginBottom: 8,
      },
      cardDesc: {
            fontSize: 12.5,
            lineHeight: 18,
      },
      exploreLink: {
            alignSelf: 'center',
            marginTop: 20,
      },
      exploreLinkText: {
            color: COLORS.primaryLight,
            fontSize: 13,
            fontWeight: '800',
      },
});

export default PathwaysSection;