import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../theme/theme';
import { UserData } from '../types/user';
import { getPlanExpiryInfo, formatLongDate } from '../components/health';

interface ActivePlanCardProps {
      user: UserData;
}

const ActivePlanCard: React.FC<ActivePlanCardProps> = ({ user }) => {
      const expiry = getPlanExpiryInfo(user.activePlanExpiresAt);

      const barColor = expiry.isExpired
            ? COLORS.error
            : expiry.isExpiringSoon
                  ? COLORS.warning
                  : COLORS.gold;

      return (
            <View style={styles.card}>
                  <View style={styles.topRow}>
                        <View>
                              <Text style={styles.sectionLabel}>Active Plan</Text>
                              <Text style={styles.planName}>{user.activePlan || 'No active plan'}</Text>
                        </View>
                        <View style={styles.iconCircle}>
                              <Icon name="ribbon" size={18} color={COLORS.gold} />
                        </View>
                  </View>

                  {expiry.hasExpiry && (
                        <>
                              <View style={styles.track}>
                                    <View
                                          style={[
                                                styles.fill,
                                                { width: `${expiry.progressRatio * 100}%`, backgroundColor: barColor },
                                          ]}
                                    />
                              </View>

                              <View style={styles.expiryRow}>
                                    <Text style={[styles.expiryText, { color: barColor }]}>
                                          {expiry.isExpired
                                                ? 'Plan expired'
                                                : `${expiry.daysLeft} day${expiry.daysLeft === 1 ? '' : 's'} remaining`}
                                    </Text>
                                    <Text style={styles.expiryDate}>
                                          Expires {formatLongDate(user.activePlanExpiresAt)}
                                    </Text>
                              </View>
                        </>
                  )}
            </View>
      );
};

const styles = StyleSheet.create({
      card: {
            backgroundColor: COLORS.surfaceElevated,
            borderRadius: RADII.lg,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: SPACING.md + 2,
            marginHorizontal: SPACING.md,
            marginTop: SPACING.sm + 4,
      },
      topRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: SPACING.md,
      },
      sectionLabel: {
            fontSize: 10.5,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: COLORS.textMuted,
            marginBottom: 6,
      },
      planName: {
            fontSize: 17,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
      },
      iconCircle: {
            width: 40,
            height: 40,
            borderRadius: RADII.md,
            backgroundColor: 'rgba(212, 171, 58, 0.12)',
            alignItems: 'center',
            justifyContent: 'center',
      },
      track: {
            height: 8,
            borderRadius: 4,
            backgroundColor: COLORS.surface,
            overflow: 'hidden',
            marginBottom: SPACING.sm,
      },
      fill: {
            height: '100%',
            borderRadius: 4,
      },
      expiryRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
      },
      expiryText: {
            fontSize: 12,
            fontWeight: TYPOGRAPHY.bold,
      },
      expiryDate: {
            fontSize: 11.5,
            color: COLORS.textMuted,
            fontWeight: TYPOGRAPHY.medium,
      },
});

export default ActivePlanCard;