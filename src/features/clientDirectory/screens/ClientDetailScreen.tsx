import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, StatusBar, View, Pressable, Image, Text, Linking } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/RootStackParamList';

import { COLORS, TYPOGRAPHY, SPACING, RADII } from '../../../theme/theme';
import { Client, WorkoutPlan, DietPlan } from '../types/clientDirectory';
import { calculateBmi, getPlanExpiryInfo, formatLongDate } from '../../../profile/components/health';
import { getClientProgress } from '../../../services/trainer.service';

type ClientDetailScreenProps = NativeStackScreenProps<RootStackParamList, 'ClientDetail'>;

interface ClientHeroProps {
      client: Client;
      onBack?: () => void;
}

const AVATAR_SIZE = 88;

const ClientHero: React.FC<ClientHeroProps> = ({ client, onBack }) => {
      const isActive = client.status === 'active';

      return (
            <View style={styles.container}>
                  <LinearGradient
                        colors={[COLORS.gradientStart, COLORS.gradientMid]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.banner}
                  >
                        <View style={styles.glow} />
                        {!!onBack && (
                              <Pressable onPress={onBack} style={styles.backBtn}>
                                    <Icon name="chevron-back" size={18} color={COLORS.text} />
                              </Pressable>
                        )}
                  </LinearGradient>

                  <View style={styles.avatarWrap}>
                        {client.profileImage ? (
                              <Image source={{ uri: client.profileImage }} style={styles.avatar} />
                        ) : (
                              <View style={[styles.avatar, styles.avatarFallback]}>
                                    <Text style={styles.avatarInitial}>
                                          {client.name.charAt(0).toUpperCase()}
                                    </Text>
                              </View>
                        )}
                        <View
                              style={[
                                    styles.statusDot,
                                    { backgroundColor: isActive ? COLORS.success : COLORS.textMuted },
                              ]}
                        />
                  </View>

                  <View style={styles.infoBlock}>
                        <Text style={styles.name}>{client.name}</Text>
                        <View style={styles.statusPill}>
                              <View
                                    style={[
                                          styles.statusPillDot,
                                          { backgroundColor: isActive ? COLORS.success : COLORS.textMuted },
                                    ]}
                              />
                              <Text style={styles.statusPillText}>
                                    {isActive ? 'Active Member' : 'Inactive Member'}
                              </Text>
                        </View>

                        <View style={styles.actionsRow}>
                              <Pressable
                                    style={styles.actionBtn}
                                    onPress={() => Linking.openURL(`tel:${client.phone}`).catch(() => { })}
                              >
                                    <Icon name="call" size={15} color={COLORS.text} />
                                    <Text style={styles.actionText}>Call</Text>
                              </Pressable>
                              <Pressable
                                    style={[styles.actionBtn, styles.actionBtnSecondary]}
                                    onPress={() => Linking.openURL(`mailto:${client.email}`).catch(() => { })}
                              >
                                    <Icon name="mail-outline" size={15} color={COLORS.text} />
                                    <Text style={styles.actionText}>Email</Text>
                              </Pressable>
                              <Pressable
                                    style={[styles.actionBtn, styles.actionBtnSecondary]}
                                    onPress={() =>
                                          Linking.openURL(`https://wa.me/${client.phone.replace(/\D/g, '')}`).catch(
                                                () => { },
                                          )
                                    }
                              >
                                    <Icon name="logo-whatsapp" size={15} color={COLORS.text} />
                                    <Text style={styles.actionText}>WhatsApp</Text>
                              </Pressable>
                        </View>
                  </View>
            </View>
      );
};

export const StatCard: React.FC<{
      icon: string;
      label: string;
      value: string;
      accentColor?: string;
}> = ({ icon, label, value, accentColor = COLORS.gold }) => (
      <View style={styles.statCard}>
            <View style={[styles.statIconCircle, { backgroundColor: `${accentColor}22` }]}>
                  <Icon name={icon} size={14} color={accentColor} />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
      </View>
);

export const ConditionChip: React.FC<{ label: string }> = ({ label }) => (
      <View style={styles.chip}>
            <Text style={styles.chipText}>{label}</Text>
      </View>
);

export const SectionLabel: React.FC<{ label: string; icon?: string }> = ({
      label,
      icon,
}) => (
      <View style={styles.sectionLabelRow}>
            {!!icon && (
                  <Icon name={icon} size={14} color={COLORS.primaryLight} style={styles.sectionLabelIcon} />
            )}
            <Text style={styles.sectionLabelText}>{label}</Text>
      </View>
);

interface BodyStatsGridProps {
      client: Client;
}

const BodyStatsGrid: React.FC<BodyStatsGridProps> = ({ client }) => {
      const bmi = calculateBmi(client.height, client.currentWeight);

      return (
            <View style={styles.wrap}>
                  <View style={styles.row}>
                        <StatCard icon="calendar-outline" label="Age" value={`${client.age} yrs`} />
                        <StatCard icon="resize-outline" label="Height" value={`${client.height} cm`} />
                  </View>
                  <View style={styles.row}>
                        <StatCard
                              icon="scale-outline"
                              label="Weight"
                              value={`${client.currentWeight} kg`}
                              accentColor={COLORS.primary}
                        />
                        <StatCard
                              icon="trophy-outline"
                              label="Target"
                              value={`${client.targetWeight} kg`}
                              accentColor={COLORS.success}
                        />
                  </View>
                  {bmi && (
                        <View style={styles.row}>
                              <StatCard
                                    icon="pulse-outline"
                                    label={`BMI · ${bmi.status}`}
                                    value={String(bmi.value)}
                                    accentColor={bmi.color}
                              />
                        </View>
                  )}
            </View>
      );
};
interface GoalAndConditionsCardProps {
      client: Client;
}

const GoalAndConditionsCard: React.FC<GoalAndConditionsCardProps> = ({ client }) => (
      <View style={styles.card}>
            <SectionLabel label="Primary Fitness Goal" />
            <View style={styles.goalBadge}>
                  <Icon name="flag" size={13} color={COLORS.gold} style={styles.goalIcon} />
                  <Text style={styles.goalText}>{client.fitnessGoal || 'Not set'}</Text>
            </View>

            <View style={styles.divider} />

            <SectionLabel label="Medical Conditions" />
            {client.medicalConditions.length > 0 ? (
                  <View style={styles.chipWrap}>
                        {client.medicalConditions.map((condition) => (
                              <ConditionChip key={condition} label={condition} />
                        ))}
                  </View>
            ) : (
                  <Text style={styles.emptyText}>No medical conditions on file</Text>
            )}
      </View>
);
interface ActivePlanCardProps {
      client: Client;
}

const ActivePlanCard: React.FC<ActivePlanCardProps> = ({ client }) => {
      const expiry = getPlanExpiryInfo(client.activePlanExpiresAt);
      const barColor = expiry.isExpired
            ? COLORS.error
            : expiry.isExpiringSoon
                  ? COLORS.warning
                  : COLORS.gold;

      return (
            <View style={styles.actcard}>
                  <View style={styles.topRow}>
                        <View style={{ flex: 1 }}>
                              <SectionLabel label="Active Plan" />
                              <Text style={styles.planName}>{client.activePlan || 'No active plan'}</Text>
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
                                          Expires {formatLongDate(client.activePlanExpiresAt)}
                                    </Text>
                              </View>
                        </>
                  )}
            </View>
      );
};

interface EngagementSnapshotProps {
      client: Client;
}

const EngagementSnapshot: React.FC<EngagementSnapshotProps> = ({ client }) => (
      <View style={styles.engcard}>
            <SectionLabel label="Engagement Snapshot" />
            <View style={styles.engrow}>
                  <MiniStat
                        icon="checkmark-done-outline"
                        value={client.attendance.length}
                        label="Sessions"
                  />
                  <MiniStat
                        icon="videocam-outline"
                        value={client.webinarsRegistered.length}
                        label="Webinars"
                  />
                  <MiniStat
                        icon={client.trialsUsed ? 'checkmark-circle-outline' : 'gift-outline'}
                        value={client.trialsUsed ? 'Used' : 'Available'}
                        label="Free Trial"
                  />
            </View>
      </View>
);

const MiniStat: React.FC<{ icon: string; value: string | number; label: string }> = ({
      icon,
      value,
      label,
}) => (
      <View style={styles.miniStat}>
            <Icon name={icon} size={16} color={COLORS.primaryLight} />
            <Text style={styles.miniStatValue}>{value}</Text>
            <Text style={styles.miniStatLabel}>{label}</Text>
      </View>
);
interface WorkoutPlanCardProps {
      workoutPlan: WorkoutPlan[];
      onManage?: () => void;
}

const WorkoutPlanCard: React.FC<WorkoutPlanCardProps> = ({ workoutPlan, onManage }) => (
      <View style={styles.workcard}>
            <View style={styles.headerRow}>
                  <SectionLabel label="Weekly Workout Plan" icon="barbell-outline" />
                  <Pressable onPress={onManage} hitSlop={8}>
                        <Icon name="create-outline" size={16} color={COLORS.gold} />
                  </Pressable>
            </View>

            {workoutPlan.length > 0 ? (
                  workoutPlan.map((item, index) => (
                        <View
                              key={item._id}
                              style={[styles.workrow, index === workoutPlan.length - 1 && styles.rowLast]}
                        >
                              <View style={styles.dayBadge}>
                                    <Text style={styles.dayBadgeText}>{item.day.slice(0, 3).toUpperCase()}</Text>
                              </View>
                              <View style={styles.rowText}>
                                    <Text style={styles.activity}>{item.activity}</Text>
                                    {!!item.details && (
                                          <Text style={styles.details} numberOfLines={2}>
                                                {item.details}
                                          </Text>
                                    )}
                              </View>
                        </View>
                  ))
            ) : (
                  <Text style={styles.emptyText}>No workout plan assigned yet</Text>
            )}
      </View>
);

interface DietPlanCardProps {
      dietPlan: DietPlan[];
      onManage?: () => void;
}

const DietPlanCard: React.FC<DietPlanCardProps> = ({ dietPlan, onManage }) => (
      <View style={styles.dietcard}>
            <View style={styles.dietheaderRow}>
                  <SectionLabel label="Nutrition Plan" icon="nutrition-outline" />
                  <Pressable onPress={onManage} hitSlop={8}>
                        <Icon name="create-outline" size={16} color={COLORS.gold} />
                  </Pressable>
            </View>

            {dietPlan.length > 0 ? (
                  dietPlan.map((item, index) => (
                        <View
                              key={item._id}
                              style={[styles.dietrow, index === dietPlan.length - 1 && styles.rowLast]}
                        >
                              <View style={styles.mealDot} />
                              <View style={styles.dietrowText}>
                                    <Text style={styles.mealName}>{item.mealName}</Text>
                                    {!!item.description && (
                                          <Text style={styles.description} numberOfLines={2}>
                                                {item.description}
                                          </Text>
                                    )}
                              </View>
                        </View>
                  ))
            ) : (
                  <Text style={styles.dietemptyText}>No nutrition plan assigned yet</Text>
            )}
      </View>
);


const ClientDetailScreen = ({ navigation, route }: ClientDetailScreenProps) => {
      const { client } = route.params;
      useEffect(() => {

      }, [])
      const fetchClientProgress = async () => {
            const response = await getClientProgress(client._id);
      }
      const onBack = () => {
            navigation.goBack();
      }
      const onManageWorkoutPlan = () => { }
      const onManageDietPlan = () => { }
      return (
            <>
                  <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
                  <ScrollView
                        style={styles.flex}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                  >
                        <ClientHero client={client} onBack={onBack} />
                        <BodyStatsGrid client={client} />
                        <GoalAndConditionsCard client={client} />
                        <ActivePlanCard client={client} />
                        <EngagementSnapshot client={client} />
                        <WorkoutPlanCard
                              workoutPlan={client.workoutPlan}
                              onManage={onManageWorkoutPlan}
                        />
                        <DietPlanCard dietPlan={client.dietPlan} onManage={onManageDietPlan} />
                  </ScrollView>
            </>
      );
};

const styles = StyleSheet.create({
      flex: {
            flex: 1,
            backgroundColor: COLORS.background,
      },
      content: {
            paddingTop: 12,
            paddingBottom: 24,
      },
      container: {
            marginBottom: AVATAR_SIZE / 2 + SPACING.sm,
      },
      banner: {
            height: 116,
            marginHorizontal: SPACING.md,
            borderRadius: RADII.xl,
            overflow: 'hidden',
      },
      glow: {
            position: 'absolute',
            top: -50,
            right: -50,
            width: 170,
            height: 170,
            borderRadius: 85,
            backgroundColor: 'rgba(212, 171, 58, 0.18)',
      },
      backBtn: {
            position: 'absolute',
            top: SPACING.md,
            left: SPACING.md,
            width: 32,
            height: 32,
            borderRadius: RADII.md,
            backgroundColor: 'rgba(255,255,255,0.16)',
            alignItems: 'center',
            justifyContent: 'center',
      },
      avatarWrap: {
            position: 'absolute',
            top: 116 - AVATAR_SIZE / 2,
            left: SPACING.lg,
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
      },
      avatar: {
            width: AVATAR_SIZE,
            height: AVATAR_SIZE,
            borderRadius: AVATAR_SIZE / 2,
            borderWidth: 4,
            borderColor: COLORS.background,
      },
      avatarFallback: {
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center',
      },
      avatarInitial: {
            color: COLORS.text,
            fontSize: 30,
            fontWeight: TYPOGRAPHY.extraBold,
      },
      statusDot: {
            position: 'absolute',
            bottom: 4,
            right: 4,
            width: 17,
            height: 17,
            borderRadius: 8.5,
            borderWidth: 3,
            borderColor: COLORS.background,
      },
      infoBlock: {
            marginTop: SPACING.sm,
            paddingHorizontal: SPACING.lg,
      },
      name: {
            fontSize: 21,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
            marginBottom: SPACING.sm,
      },
      statusPill: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            backgroundColor: COLORS.surfaceElevated,
            borderRadius: RADII.full,
            paddingVertical: 5,
            paddingHorizontal: SPACING.sm + 2,
            marginBottom: SPACING.md,
      },
      statusPillDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            marginRight: 6,
      },
      statusPillText: {
            fontSize: 11,
            fontWeight: TYPOGRAPHY.bold,
            color: COLORS.textSecondary,
      },
      actionsRow: {
            flexDirection: 'row',
            gap: SPACING.sm,
      },
      actionBtn: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 42,
            borderRadius: RADII.md + 2,
            backgroundColor: COLORS.primary,
      },
      actionBtnSecondary: {
            backgroundColor: COLORS.surfaceElevated,
            borderWidth: 1,
            borderColor: COLORS.border,
      },
      actionText: {
            color: COLORS.text,
            fontSize: 11.5,
            fontWeight: TYPOGRAPHY.bold,
            marginLeft: 6,
      },
      wrap: {
            paddingHorizontal: SPACING.md,
      },
      row: {
            flexDirection: 'row',
            gap: SPACING.sm + 2,
            marginBottom: SPACING.sm + 2,
      },
      statCard: {
            flex: 1,
            backgroundColor: COLORS.surface,
            borderRadius: RADII.lg,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: SPACING.md,
      },
      statIconCircle: {
            width: 28,
            height: 28,
            borderRadius: RADII.md,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: SPACING.sm,
      },
      statValue: {
            fontSize: 17,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
            marginBottom: 2,
      },
      statLabel: {
            fontSize: 10,
            fontWeight: TYPOGRAPHY.bold,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            color: COLORS.textMuted,
      },
      chip: {
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: RADII.sm + 2,
            paddingVertical: SPACING.xs + 2,
            paddingHorizontal: SPACING.sm + 2,
            marginRight: SPACING.sm,
            marginBottom: SPACING.sm,
      },
      chipText: {
            fontSize: 11.5,
            fontWeight: TYPOGRAPHY.extraBold,
            color: '#F87171',
            letterSpacing: 0.3,
      },
      sectionLabelRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: SPACING.sm + 4,
      },
      sectionLabelIcon: {
            marginRight: SPACING.sm - 2,
      },
      sectionLabelText: {
            fontSize: 10.5,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: COLORS.textMuted,
      },
      card: {
            backgroundColor: COLORS.surface,
            borderRadius: RADII.lg,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: SPACING.md + 2,
            marginHorizontal: SPACING.md,
            marginTop: SPACING.sm + 4,
      },
      goalBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            backgroundColor: 'rgba(212, 171, 58, 0.12)',
            borderWidth: 1,
            borderColor: 'rgba(212, 171, 58, 0.35)',
            borderRadius: RADII.full,
            paddingVertical: SPACING.xs + 2,
            paddingHorizontal: SPACING.md,
      },
      goalIcon: {
            marginRight: SPACING.xs,
      },
      goalText: {
            fontSize: 12.5,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.gold,
      },
      divider: {
            height: 1,
            backgroundColor: COLORS.border,
            marginVertical: SPACING.md,
      },
      chipWrap: {
            flexDirection: 'row',
            flexWrap: 'wrap',
      },
      emptyText: {
            fontSize: 12.5,
            color: COLORS.textMuted,
            fontStyle: 'normal',
      },
      actcard: {
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
      engcard: {
            backgroundColor: COLORS.surface,
            borderRadius: RADII.lg,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: SPACING.md + 2,
            marginHorizontal: SPACING.md,
            marginTop: SPACING.sm + 4,
      },
      engrow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
      },
      miniStat: {
            alignItems: 'center',
            flex: 1,
      },
      miniStatValue: {
            fontSize: 15,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
            marginTop: 6,
            marginBottom: 2,
      },
      miniStatLabel: {
            fontSize: 10,
            fontWeight: TYPOGRAPHY.semiBold,
            color: COLORS.textMuted,
      },
      workcard: {
            backgroundColor: COLORS.surface,
            borderRadius: RADII.lg,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: SPACING.md + 2,
            marginHorizontal: SPACING.md,
            marginTop: SPACING.sm + 4,
      },
      headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
      },
      workrow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingVertical: SPACING.sm + 2,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
      },
      rowLast: {
            borderBottomWidth: 0,
            paddingBottom: 0,
      },
      dayBadge: {
            width: 40,
            height: 26,
            borderRadius: RADII.sm + 2,
            backgroundColor: 'rgba(198, 53, 115, 0.12)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: SPACING.sm + 2,
      },
      dayBadgeText: {
            fontSize: 10,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.primaryLight,
            letterSpacing: 0.4,
      },
      rowText: {
            flex: 1,
      },
      activity: {
            fontSize: 13.5,
            fontWeight: TYPOGRAPHY.bold,
            color: COLORS.text,
            marginBottom: 2,
      },
      details: {
            fontSize: 11.5,
            color: COLORS.textMuted,
            lineHeight: 17,
      },
      // emptyText: {
      //       fontSize: 12.5,
      //       color: COLORS.textMuted,
      //       fontStyle: 'italic',
      //       marginTop: SPACING.sm,
      // },
      dietcard: {
            backgroundColor: COLORS.surface,
            borderRadius: RADII.lg,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: SPACING.md + 2,
            marginHorizontal: SPACING.md,
            marginTop: SPACING.sm + 4,
            marginBottom: SPACING.xl,
      },
      dietheaderRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
      },
      dietrow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            paddingVertical: SPACING.sm + 2,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
      },
      dietrowLast: {
            borderBottomWidth: 0,
            paddingBottom: 0,
      },
      mealDot: {
            width: 7,
            height: 7,
            borderRadius: 3.5,
            backgroundColor: COLORS.gold,
            marginTop: 5,
            marginRight: SPACING.sm + 2,
      },
      dietrowText: {
            flex: 1,
      },
      mealName: {
            fontSize: 13.5,
            fontWeight: TYPOGRAPHY.bold,
            color: COLORS.text,
            marginBottom: 2,
      },
      description: {
            fontSize: 11.5,
            color: COLORS.textMuted,
            lineHeight: 17,
      },
      dietemptyText: {
            fontSize: 12.5,
            color: COLORS.textMuted,
            fontStyle: 'italic',
            marginTop: SPACING.sm,
      },
});

export default ClientDetailScreen;