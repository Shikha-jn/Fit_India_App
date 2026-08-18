import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, StatusBar, View, Text, Image, Pressable, Linking } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADII } from '../../theme/theme';

import { UserData } from '../types/user';
import ActivePlanCard from '../components/ActivePlansCard';
import ActivitySnapshotCard from '../components/ActivitySnapShot';
import MenuSection from '../components/MenuSection';
import { calculateBmi } from '../components/health';
import { getClientProfile, editProfile } from '../../services/client.service';

import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeBottomTabScreenProps } from '@react-navigation/bottom-tabs/unstable';
import { UserTabParamList } from '../../types/UserTabParamList';
import { CompositeScreenProps, } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/RootStackParamList';
import { useAuthStore } from '../../store/useAuthStore';
import { useAlert } from '../../context/AlertContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type UserProfileProps = CompositeScreenProps<NativeBottomTabScreenProps<UserTabParamList, 'Profile'>,
      NativeStackScreenProps<RootStackParamList>>;

const demoData: UserData = {
      _id: "demo-client-id",
      name: "User",
      email: "client@gmail.com",
      phone: "+919876543219",
      role: "client",
      profileImage: "",
      status: "active",
      age: 25,
      height: 165,
      currentWeight: 555,
      targetWeight: 50,
      medicalConditions: ["None"],
      fitnessGoal: "Weight Loss",
      assignedTrainer: {
            _id: "demo-trainer-id",
            name: "Rishi Maheshwari",
            email: "trainer@gmail.com",
            phone: "+919009594537",
            specialization: ["Yoga"],
      },
      trialsUsed: false,
      attendance: ["2026-07-18",],
      webinarsRegistered: [],
      workoutPlan: [
            {
                  _id: "demo-workout-1",
                  day: "Monday",
                  activity: "Strength Training",
                  details: "30 minutes full body workout",
            },
      ],
      dietPlan: [
            {
                  _id: "demo-diet-1",
                  mealName: "Breakfast",
                  description: "Oatmeal with fruits and nuts",
            },
      ],
      createdAt: "2026-07-16T08:08:14.147Z",
      updatedAt: "2026-07-31T12:59:25.348Z",
      __v: 0,
      activePlan: "Weight Loss",
      activePlanExpiresAt: "2026-08-16T00:00:00.000Z",

}

interface ProfileHeroProps {
      user: UserData;
      onEditPress?: () => void;
}

const AVATAR_SIZE = 92;

const ProfileHero: React.FC<ProfileHeroProps> = ({ user, onEditPress }) => {
      const isActive = user.status === 'active';

      return (
            <View style={styles.container}>
                  <LinearGradient
                        colors={[COLORS.gradientStart, COLORS.gradientMid]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.banner}
                  >
                        <View style={styles.glow} />
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                              <Pressable onPress={onEditPress} style={styles.editBtn}>
                                    <Icon name="create-outline" size={16} color={COLORS.text} />
                              </Pressable>


                              <View style={styles.avatarWrap}>
                                    {user.profileImage ? (
                                          <Image source={{ uri: user.profileImage }} style={styles.avatar} />
                                    ) : (
                                          <View style={[styles.avatar, styles.avatarFallback]}>
                                                <Text style={styles.avatarInitial}>
                                                      {user.name.charAt(0).toUpperCase()}
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
                        </View>
                  </LinearGradient>

                  <View style={styles.infoBlock}>
                        <Text style={styles.name}>{user.name}</Text>

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

                        <View style={styles.contactRow}>
                              <Icon name="mail-outline" size={13} color={COLORS.textMuted} />
                              <Text style={styles.contactText} numberOfLines={1}>
                                    {user.email}
                              </Text>
                        </View>
                        <View style={styles.contactRow}>
                              <Icon name="call-outline" size={13} color={COLORS.textMuted} />
                              <Text style={styles.contactText}>{user.phone}</Text>
                        </View>
                  </View>
            </View>
      );
};

interface StatCardProps {
      icon: string;
      label: string;
      value: string;
      accentColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({
      icon,
      label,
      value,
      accentColor = COLORS.gold,
}) => (
      <View style={styles.statcard}>
            <View style={[styles.iconCircle, { backgroundColor: `${accentColor}22` }]}>
                  <Icon name={icon} size={15} color={accentColor} />
            </View>
            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>
      </View>
);

interface StatsGridProps {
      user: UserData;
}

const StatsGrid: React.FC<StatsGridProps> = ({ user }) => {
      const bmi = calculateBmi(user.height, user.currentWeight);

      return (
            <View style={styles.wrap}>
                  <View style={styles.row}>
                        <StatCard icon="calendar-outline" label="Age" value={`${user.age} yrs`} />
                        <StatCard icon="resize-outline" label="Height" value={`${user.height} cm`} />
                  </View>
                  <View style={styles.row}>
                        <StatCard
                              icon="scale-outline"
                              label="Weight"
                              value={`${user.currentWeight} kg`}
                              accentColor={COLORS.primary}
                        />
                        <StatCard
                              icon="trophy-outline"
                              label="Target"
                              value={`${user.targetWeight} kg`}
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

export const ConditionChip: React.FC<{ label: string }> = ({ label }) => (
      <View style={styles.chip}>
            <Text style={styles.chipText}>{label}</Text>
      </View>
);

export const GoalBadge: React.FC<{ label: string }> = ({ label }) => (
      <View style={styles.goalBadge}>
            <Icon name="flag" size={13} color={COLORS.gold} style={styles.goalIcon} />
            <Text style={styles.goalText}>{label}</Text>
      </View>
);

interface GoalAndConditionsCardProps {
      user: UserData;
}

const GoalAndConditionsCard: React.FC<GoalAndConditionsCardProps> = ({ user }) => (
      <View style={styles.card}>
            <Text style={styles.sectionLabel}>Primary Fitness Goal</Text>
            <GoalBadge label={user.fitnessGoal || 'Not set'} />

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>Medical Conditions</Text>
            {user.medicalConditions.length > 0 ? (
                  <View style={styles.chipWrap}>
                        {user.medicalConditions.map((condition) => (
                              <ConditionChip key={condition} label={condition} />
                        ))}
                  </View>
            ) : (
                  <Text style={styles.emptyText}>No medical conditions on file</Text>
            )}
      </View>
);

const UserProfileScreen = ({ navigation }: UserProfileProps) => {
      const rootNav = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
      const [user, setuser] = useState<UserData>(demoData);
      const authRemove = useAuthStore((s) => s.removeAuth);
      const alert = useAlert();

      useEffect(() => {
            fetchuserProfile();
      }, [])

      const fetchuserProfile = async () => {
            const response = await getClientProfile();
            const client = response.data;
            setuser(client)
      }
      const onEditProfile = (profile: any) => { rootNav.navigate('EditProfile', { profile: profile }); }
      const onViewAttendance = () => {
            navigation.navigate('Attendance', { attendance: user.attendance, joinedDate: user.createdAt });
      }
      const onChangePassword = () => {

      }
      const onSubscription = () => {
            navigation.navigate('Subscription');
      }
      const onPayment = () => {
            navigation.navigate('PaymentHistory');
      }
      const onPrivacySecurity = () => {

      }
      const onLogout = async () => {
            await authRemove();
            alert.success('You are logged out');
            rootNav.replace('MainTab', { screen: 'Home' });
            //       navigation.getParent<NativeBottomTabScreenProps<MainTabParamList>>().reset({
            //       index: 0,
            //       routes: [{ name: 'Home' }],
            //   });
      }
      const onHelpSupport = async () => {
            try {
                  const url = 'https://fit-india-sable.vercel.app/';
                  const supported = await Linking.canOpenURL(url);

                  if (supported) {
                        await Linking.openURL(url);
                  } else {
                        alert.error('Error', 'Unable to open the link.');
                  }
            } catch (error) {
                  alert.error('Error', 'Something went wrong while opening the link.');
            }
      }
      return (
            <>
                  <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
                  <ScrollView
                        style={styles.flex}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                  >
                        <ProfileHero user={user} onEditPress={() => onEditProfile(user)} />
                        <StatsGrid user={user} />
                        <GoalAndConditionsCard user={user} />
                        <ActivePlanCard user={user} />
                        <ActivitySnapshotCard user={user} trainer={user?.assignedTrainer} />
                        <MenuSection
                              onViewAttendance={onViewAttendance}
                              onChangePassword={onChangePassword}
                              onSubscription={onSubscription}
                              onHelpSupport={onHelpSupport}
                              onLogout={onLogout}
                              onPayment={onPayment}
                        // onPrivacySecurity={onPrivacySecurity}
                        />
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
            paddingBottom: 48,
      },
      container: {
            // marginBottom: AVATAR_SIZE / 2 + SPACING.sm,
      },
      banner: {
            height: 128,
            marginHorizontal: SPACING.md,
            borderRadius: RADII.xl,
            overflow: 'hidden',
      },
      glow: {
            position: 'absolute',
            top: -50,
            right: -50,
            width: 180,
            height: 180,
            borderRadius: 90,
            backgroundColor: 'rgba(212, 171, 58, 0.18)',
      },
      editBtn: {
            position: 'absolute',
            top: SPACING.md,
            right: SPACING.md,
            width: 34,
            height: 34,
            borderRadius: RADII.md,
            backgroundColor: 'rgba(255,255,255,0.16)',
            alignItems: 'center',
            justifyContent: 'center',
      },
      avatarWrap: {
            position: 'absolute',
            top: 70 - AVATAR_SIZE / 2,
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
            fontSize: 32,
            fontWeight: TYPOGRAPHY.extraBold,
      },
      statusDot: {
            position: 'absolute',
            bottom: 4,
            right: 4,
            width: 18,
            height: 18,
            borderRadius: 9,
            borderWidth: 3,
            borderColor: COLORS.background,
      },
      infoBlock: {
            marginTop: SPACING.sm,
            paddingHorizontal: SPACING.lg,
      },
      name: {
            fontSize: 22,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
            marginBottom: SPACING.xs + 2,
      },
      statusPill: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            backgroundColor: COLORS.surfaceElevated,
            borderRadius: RADII.full,
            paddingVertical: 5,
            paddingHorizontal: SPACING.sm + 2,
            marginBottom: SPACING.sm + 2,
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
      contactRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
      },
      contactText: {
            fontSize: 12.5,
            color: COLORS.textMuted,
            fontWeight: TYPOGRAPHY.medium,
            marginLeft: 6,
      },
      wrap: {
            paddingHorizontal: SPACING.md,
            marginTop: SPACING.sm,
      },
      row: {
            flexDirection: 'row',
            gap: SPACING.sm + 2,
            marginBottom: SPACING.sm + 2,
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
      sectionLabel: {
            fontSize: 10.5,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: COLORS.textMuted,
            marginBottom: SPACING.sm + 2,
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
            fontStyle: 'italic',
      },
      statcard: {
            flex: 1,
            backgroundColor: COLORS.surface,
            borderRadius: RADII.lg,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: SPACING.md,
      },
      iconCircle: {
            width: 30,
            height: 30,
            borderRadius: RADII.md,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: SPACING.sm,
      },
      value: {
            fontSize: 18,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
            marginBottom: 2,
      },
      label: {
            fontSize: 10.5,
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
});

export default UserProfileScreen;