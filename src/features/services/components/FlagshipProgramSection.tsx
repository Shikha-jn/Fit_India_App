import React from 'react';
import { View, Text, Pressable, Linking, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../theme/theme';
import { SectionBadge, TagPill } from '../components/Badges';
import { ChecklistRow, HeartTag } from '../components/ListRows';

const WHATSAPP_NUMBER = '+91 92014 56784';
const WHATSAPP_DIGITS = '919201456784';

const WHAT_YOU_GET = [
      '100% Women-Only Community (exclusive supportive groups)',
      "13+ Years Experienced Founder's guidance",
      'Certified Coaches & Nutritionists from Delhi',
      'Healthy & Sustainable Weight Loss (No pills, products, or supplements)',
      'Diet: Only healthy, home-cooked food (ghar ka khana)',
      'Monday to Saturday Live Classes with flexible timings',
      'Recorded Videos available if you miss a live session',
      'Free Customized Diet Plans & health consultations',
      '1-Day Free Trial session available',
];

const EVERYDAY_WORKOUTS = [
      'Strength Training & Core Workouts',
      'Zumba & Aerobics Sessions',
      'Cardio & Circuit Exercises',
      'HIIT & Tabata Workouts',
      'Yoga & Power Yoga',
      'Pilates & Functional Training',
      'Beginners Training (gradual progression)',
      'Daily Face Yoga (for natural glow & tightening)',
      'Full Body Stretching & Joint Mobility',
];

const HEALTH_ISSUES = [
      'PCOS / PCOD',
      'Back & Knee Pain',
      'Thyroid',
      'Low Stamina',
      'Belly Fat',
      'Slow Metabolism',
      'Low Energy',
      'Blood Pressure',
      'Weakness',
      'Diabetes',
      'Irregular Periods',
      'Stress Mgmt',
      'Hormonal Imbalance',
      'Weight Gain',
      'Perimenopause',
      'Weight Loss',
      'Post-Pregnancy Recovery',
      'Stubborn Fat',
];

interface FlagshipProgramSectionProps {
      onBookFreeTrial?: () => void;
}

const FlagshipProgramSection: React.FC<FlagshipProgramSectionProps> = ({
      onBookFreeTrial,
}) => {
      const openWhatsApp = () => {
            Linking.openURL(`https://wa.me/${WHATSAPP_DIGITS}`).catch(() => { });
      };

      return (
            <View style={styles.container}>
                  <View style={styles.badgeRow}>
                        <SectionBadge label="Flagship Program" tone="gold" />
                        <View style={{ width: 8 }} />
                        <SectionBadge label="🔥 Fees 50% Off" tone="primary" />
                  </View>

                  <Text style={styles.title}>Online Women's Fitness Classes</Text>
                  <Text style={styles.subtitle}>
                        Exclusive online fitness classes designed specifically for women
                        aged 20 to 50+ to lose weight, build strength, and address active
                        health issues.
                  </Text>

                  <View style={styles.infoRow}>
                        <View style={styles.infoItem}>
                              <Icon name="globe-outline" size={14} color={COLORS.info} />
                              <Text style={styles.infoText}>Session Language: Hindi</Text>
                        </View>
                        <View style={styles.infoItem}>
                              <Icon name="chatbubble-outline" size={14} color={COLORS.textMuted} />
                              <Text style={styles.infoText}>WhatsApp support: {WHATSAPP_NUMBER}</Text>
                        </View>
                  </View>

                  <View style={styles.quoteBlock}>
                        <Text style={styles.quoteText}>
                              "We don't just focus on weight loss; we elevate your strength,
                              energy, and overall health to a whole new level! 💪"
                        </Text>
                  </View>

                  {/* What You'll Get */}
                  <View style={styles.card}>
                        <View style={styles.cardHeader}>
                              <Icon name="checkmark-circle-outline" size={16} color={COLORS.gold} />
                              <Text style={styles.cardHeaderText}>What You'll Get</Text>
                        </View>
                        {WHAT_YOU_GET.map((item) => (
                              <ChecklistRow key={item} text={item} tone="gold" />
                        ))}
                  </View>

                  {/* Everyday Workouts */}
                  <View style={styles.card}>
                        <View style={styles.cardHeader}>
                              <Icon name="pulse-outline" size={16} color={COLORS.gold} />
                              <Text style={styles.cardHeaderText}>Everyday Workouts</Text>
                        </View>
                        {EVERYDAY_WORKOUTS.map((item) => (
                              <ChecklistRow key={item} text={item} tone="gold" />
                        ))}
                  </View>

                  {/* Health Issues Addressed */}
                  <View style={styles.card}>
                        <View style={styles.cardHeader}>
                              <Icon name="heart-outline" size={16} color={COLORS.primaryLight} />
                              <Text style={styles.cardHeaderText}>Health Issues Addressed</Text>
                        </View>
                        <View style={styles.heartGrid}>
                              {HEALTH_ISSUES.map((item) => (
                                    <HeartTag key={item} label={item} />
                              ))}
                        </View>
                  </View>

                  <Text style={styles.closingQuote}>
                        "India is not our only home — women from all around the globe have
                        joined the FIWM family, successfully losing weight and reversing
                        chronic health issues. Don't wait, take charge of your wellness
                        journey today!"
                  </Text>

                  <View style={styles.ctaRow}>
                        <Pressable onPress={openWhatsApp} style={styles.whatsappBtn}>
                              <Icon name="logo-whatsapp" size={18} color={COLORS.text} />
                              <Text style={styles.whatsappText}>Chat on WhatsApp</Text>
                        </Pressable>
                        <Pressable onPress={onBookFreeTrial} style={styles.trialBtn}>
                              <Text style={styles.trialText}>Book Free Trial Session</Text>
                        </Pressable>
                  </View>
            </View>
      );
};

const styles = StyleSheet.create({
      container: {
            backgroundColor: COLORS.surface,
            borderRadius: 28,
            marginHorizontal: 16,
            marginTop: -28,
            paddingHorizontal: 20,
            paddingVertical: 32,
            borderWidth: 1,
            borderColor: COLORS.border,
      },
      badgeRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 18,
      },
      title: {
            fontSize: 26,
            fontWeight: '800',
            color: COLORS.text,
            textAlign: 'center',
            marginBottom: 12,
      },
      subtitle: {
            fontSize: 13,
            color: COLORS.textSecondary,
            textAlign: 'center',
            lineHeight: 20,
            marginBottom: 20,
      },
      infoRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 16,
            marginBottom: 20,
      },
      infoItem: {
            flexDirection: 'row',
            alignItems: 'center',
      },
      infoText: {
            fontSize: 12,
            fontWeight: '700',
            color: COLORS.textSecondary,
            marginLeft: 6,
      },
      quoteBlock: {
            backgroundColor: 'rgba(212, 171, 58, 0.1)',
            borderWidth: 1,
            borderColor: 'rgba(212, 171, 58, 0.3)',
            borderRadius: 16,
            padding: 16,
            marginBottom: 28,
      },
      quoteText: {
            color: COLORS.gold,
            fontSize: 13,
            fontStyle: 'italic',
            fontWeight: '700',
            textAlign: 'center',
            lineHeight: 20,
      },
      card: {
            backgroundColor: COLORS.surfaceElevated,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 18,
            marginBottom: 16,
      },
      cardHeader: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
      },
      cardHeaderText: {
            fontSize: 15,
            fontWeight: '800',
            color: COLORS.text,
            marginLeft: 8,
      },
      heartGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
      },
      closingQuote: {
            fontSize: 12.5,
            fontStyle: 'italic',
            color: COLORS.textMuted,
            textAlign: 'center',
            lineHeight: 20,
            marginBottom: 22,
      },
      ctaRow: {
            gap: 12,
      },
      whatsappBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 52,
            borderRadius: 14,
            backgroundColor: '#25D366',
            shadowColor: '#25D366',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.35,
            shadowRadius: 12,
            elevation: 6,
      },
      whatsappText: {
            color: COLORS.text,
            fontSize: 14,
            fontWeight: '800',
            marginLeft: 8,
      },
      trialBtn: {
            height: 52,
            borderRadius: 14,
            backgroundColor: COLORS.text,
            alignItems: 'center',
            justifyContent: 'center',
      },
      trialText: {
            color: COLORS.goldDark,
            fontSize: 14,
            fontWeight: '800',
      },
});

export default FlagshipProgramSection;