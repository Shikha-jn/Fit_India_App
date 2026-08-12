import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, View, StyleSheet, StatusBar, Text, Pressable, Image } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeBottomTabScreenProps } from '@react-navigation/bottom-tabs/unstable';
import { UserTabParamList } from '../../types/UserTabParamList';

import { COLORS } from '../../theme/theme';
import { UserData } from '../../profile/types/user';
import AssignedCoachCard from '../dashboard/components/AssignedCoachCard';
import { getClientProfile, markAttendance } from '../../services/client.service';
import { useAlert } from '../../context/AlertContext';
import { formatShortDate, calculateBmi } from './components/bmi';
import SectionHeader from './components/SectionHeader';
import StatRow from './components/StatsRow';
import WorkoutsPreviewCard from './components/WorkoutsPreviewCard';
import NutritionPreviewCard from './components/NutrionPreviewCard';

type UserDashboardProps = NativeBottomTabScreenProps<UserTabParamList, 'Dashboard'>;

interface DashboardHeaderProps {
      user: UserData;
      attendanceMarkedToday?: boolean;
      onMarkAttendance?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
      user,
      attendanceMarkedToday,
      onMarkAttendance,
}) => (
      <LinearGradient
            colors={[COLORS.gradientStart, COLORS.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
      >
            <View style={styles.glow} />

            <View style={styles.topRow}>
                  <View style={styles.textBlock}>
                        <Text style={styles.greeting}>Hello, {user.name}!</Text>
                        <Text style={styles.subtitle}>
                              Keep pushing your goals. Your plan is geared for{' '}
                              <Text style={styles.goalHighlight}>{user.fitnessGoal}</Text>.
                        </Text>

                        <View style={styles.planPill}>
                              <Icon name="ribbon-outline" size={13} color={COLORS.text} />
                              <Text style={styles.planText}>
                                    Plan: {user.activePlan || 'None'} (Expires:{' '}
                                    {formatShortDate(user.activePlanExpiresAt)})
                              </Text>
                        </View>
                  </View>

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
                  </View>
            </View>

            <Pressable
                  onPress={onMarkAttendance}
                  disabled={attendanceMarkedToday}
                  style={[styles.attendanceBtn, attendanceMarkedToday && styles.attendanceBtnDone]}
            >
                  {attendanceMarkedToday ? (
                        <Icon name="checkmark-circle" size={16} color={COLORS.success} />
                  ) : (
                        <Icon name="calendar-outline" size={16} color={COLORS.primary} />
                  )}
                  <Text
                        style={[
                              styles.attendanceText,
                              attendanceMarkedToday && styles.attendanceTextDone,
                        ]}
                  >
                        {attendanceMarkedToday ? "Today's Attendance Marked" : 'Mark Daily Attendance'}
                  </Text>
            </Pressable>
      </LinearGradient>
);

interface BodyStatsCardProps {
      user: UserData;
}

const BodyStatsCard: React.FC<BodyStatsCardProps> = ({ user }) => {
      const bmi = calculateBmi(user.height, user.currentWeight);

      return (
            <View style={styles.card}>
                  <SectionHeader label="Body Stats" />

                  <StatRow label="Height" value={`${user.height} cm`} />
                  <StatRow label="Weight" value={`${user.currentWeight} kg`} />
                  <StatRow label="Target Weight" value={`${user.targetWeight} kg`} />
                  <StatRow label="Age" value={`${user.age} yrs`} />

                  {bmi && (
                        <>
                              <View style={styles.divider} />
                              <StatRow
                                    label="BMI Status"
                                    value={`${bmi.status} (${bmi.value})`}
                                    emphasize
                              />
                        </>
                  )}
            </View>
      );
};

interface ConditionChipProps {
      label: string;
}

const ConditionChip: React.FC<ConditionChipProps> = ({ label }) => (
      <View style={styles.chip}>
            <Text style={styles.chiplabel}>{label}</Text>
      </View>
);

interface MedicalProfilesCardProps {
      user: UserData;
}

const MedicalProfilesCard: React.FC<MedicalProfilesCardProps> = ({ user }) => (
      <View style={styles.medcard}>
            <SectionHeader label="Medical Profiles" />

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

// interface UserDashboardScreenProps {
//       user: UserData;
//       coach?: AssignedCoachSummary;
//       onMarkAttendance?: () => void;
//       onViewFullWorkoutPlan?: () => void;
//       onViewFullDietPlan?: () => void;
// }

function isSameDay(a: Date, b: Date): boolean {
      return (
            a.getFullYear() === b.getFullYear() &&
            a.getMonth() === b.getMonth() &&
            a.getDate() === b.getDate()
      );
}
export const defaultUser: UserData = {
      _id: "",
      name: "Loading...",
      email: "",
      phone: "",
      role: "client",
      profileImage: "",
      status: "active",
      age: 0,
      height: 0,
      currentWeight: 0,
      targetWeight: 0,
      medicalConditions: [],
      fitnessGoal: "",
      assignedTrainer: { _id: '', name: '', email: '', phone: '', specialization: [] },
      trialsUsed: false,
      attendance: [],
      webinarsRegistered: [],
      workoutPlan: [],
      dietPlan: [],
      createdAt: "",
      updatedAt: "",
      __v: 0,
      activePlan: "",
      activePlanExpiresAt: "",
}

const UserDashboard: React.FC<UserDashboardProps> = ({

}) => {
      const [user, setUser] = useState<UserData>(defaultUser);
      const alert = useAlert();
      useEffect(() => {
            fetchUserProfile();
      }, []);
      const fetchUserProfile = async () => {
            const response = await getClientProfile();
            const userData = response.data;
            console.log('User profile data:', userData);
            setUser(userData);
      }

      const onMarkAttendance = async () => {
            try {
                  const response = await markAttendance();
                  const attendance = response.data;
                  if (attendance.success === 'true') {
                        alert.confirm('Today attendance marked successfully');
                  } else {
                        alert.confirm(attendance.message);
                  }
            } catch (error) {
                  console.log('Error');
            }
      }

      const attendanceMarkedToday = useMemo(() => {
            const today = new Date();
            return user?.attendance.some((iso) => isSameDay(new Date(iso), today));
      }, [user?.attendance]) ?? '';

      return (
            <>
                  <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
                  <ScrollView
                        style={styles.flex}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                  >
                        <DashboardHeader
                              user={user}
                              attendanceMarkedToday={attendanceMarkedToday}
                              onMarkAttendance={onMarkAttendance}
                        />

                        <View style={styles.rowThree}>
                              <BodyStatsCard user={user} />
                        </View>
                        <View style={styles.rowTwo}>
                              <MedicalProfilesCard user={user} />
                              <AssignedCoachCard coach={user.assignedTrainer} />
                        </View>

                        <View style={styles.rowTwo}>
                              <WorkoutsPreviewCard
                                    workoutPlan={user.workoutPlan}
                              // onViewAll={onViewFullWorkoutPlan}
                              />

                        </View>
                        <View style={styles.rowTwo}>
                        <NutritionPreviewCard
                              dietPlan={user.dietPlan}
                        // onViewAll={onViewFullDietPlan}
                        />
                        </View>
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
            paddingBottom: 40,
      },
      rowThree: {
            paddingHorizontal: 16,
            marginTop: 16,
      },
      rowTwo: {
            flexDirection: 'row',
            gap: 12,
            paddingHorizontal: 16,
            marginTop: 12,
      },
      //Header styles
      banner: {
            borderRadius: 24,
            marginHorizontal: 16,
            marginTop: 16,
            padding: 22,
            overflow: 'hidden',
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.35,
            shadowRadius: 20,
            elevation: 10,
      },
      glow: {
            position: 'absolute',
            top: -50,
            right: -50,
            width: 180,
            height: 180,
            borderRadius: 90,
            backgroundColor: 'rgba(255,255,255,0.08)',
      },
      topRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 18,
      },
      textBlock: {
            flex: 1,
            paddingRight: 14,
      },
      greeting: {
            fontSize: 22,
            fontWeight: '800',
            color: COLORS.text,
            marginBottom: 8,
      },
      subtitle: {
            fontSize: 12.5,
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 18,
            marginBottom: 14,
      },
      goalHighlight: {
            fontWeight: '800',
            textDecorationLine: 'underline',
            color: COLORS.text,
      },
      planPill: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            backgroundColor: 'rgba(255,255,255,0.14)',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.2)',
            paddingVertical: 8,
            paddingHorizontal: 12,
      },
      planText: {
            color: COLORS.text,
            fontSize: 11.5,
            fontWeight: '700',
            marginLeft: 6,
      },
      avatarWrap: {
            width: 60,
            height: 60,
      },
      avatar: {
            width: 60,
            height: 60,
            borderRadius: 30,
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.6)',
      },
      avatarFallback: {
            backgroundColor: 'rgba(255,255,255,0.18)',
            alignItems: 'center',
            justifyContent: 'center',
      },
      avatarInitial: {
            color: COLORS.text,
            fontSize: 22,
            fontWeight: '800',
      },
      attendanceBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'flex-start',
            backgroundColor: COLORS.text,
            borderRadius: 999,
            paddingVertical: 12,
            paddingHorizontal: 20,
      },
      attendanceBtnDone: {
            backgroundColor: 'rgba(255,255,255,0.16)',
      },
      attendanceText: {
            color: COLORS.primary,
            fontSize: 13,
            fontWeight: '800',
            marginLeft: 8,
      },
      attendanceTextDone: {
            color: COLORS.text,
      },
      //Stats styles
      card: {
            flex: 1,
            backgroundColor: COLORS.surfaceElevated,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 18,
      },
      divider: {
            height: 1,
            backgroundColor: COLORS.border,
            marginTop: 4,
            marginBottom: 2,
      },
      //Medical card styles
      medcard: {
            flex: 1,
            backgroundColor: COLORS.surfaceElevated,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 18,
      },
      chipWrap: {
            flexDirection: 'row',
            flexWrap: 'wrap',
      },
      emptyText: {
            fontSize: 12.5,
            color: '#A1A1AA',
            fontStyle: 'italic',
      },
      //Condition chip styles
      chip: {
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: 8,
            paddingVertical: 5,
            paddingHorizontal: 10,
            marginRight: 8,
            marginBottom: 6,
      },
      chiplabel: {
            fontSize: 10.5,
            fontWeight: '800',
            color: '#DC2626',
            letterSpacing: 0.3,
      },
});

export default UserDashboard;