import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, StatusBar, View, Text, Image, Pressable, Linking, RefreshControl } from 'react-native';
import { COLORS } from '../../theme/theme';
import { Trainer } from '../../profile/types/trainer';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeBottomTabScreenProps } from '@react-navigation/bottom-tabs/unstable';
import { CompositeScreenProps, } from '@react-navigation/native';
import { TrainerTabParamList } from '../../types/TrainerTabParamList';
import { MainTabParamList } from '../../types/MainTabParamList';
import { trainerProfile } from '../../services/trainer.service';
import { useAlert } from '../../context/AlertContext';
import { useAuthStore } from '../../store/useAuthStore';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/RootStackParamList';

interface StatCardProps {
      icon: string;
      label: string;
      value: string;
      caption?: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, caption }) => (
      <View style={styles.card}>
            <View style={styles.iconRow}>
                  <View style={styles.iconCircle}>
                        <Icon name={icon} size={15} color={COLORS.goldDark} />
                  </View>
                  <Text style={styles.label}>{label}</Text>
            </View>
            <Text style={styles.value}>{value}</Text>
            {!!caption && <Text style={styles.caption}>{caption}</Text>}
      </View>
);

interface ChipProps {
      label: string;
      icon?: string;
      tone?: 'primary' | 'gold' | 'neutral';
}

const TONES = {
      primary: {
            bg: 'rgba(166, 24, 82, 0.12)',
            text: COLORS.primary,
      },
      gold: {
            bg: 'rgba(212, 171, 58, 0.14)',
            text: COLORS.goldDark,
      },
      neutral: {
            bg: COLORS.backgroundLight,
            text: '#3F3F46',
      },
};

const Chip: React.FC<ChipProps> = ({ label, icon, tone = 'primary' }) => {
      const t = TONES[tone];
      return (
            <View style={[styles.chip, { backgroundColor: t.bg }]}>
                  {!!icon && <Icon name={icon} size={12} color={t.text} style={styles.icon} />}
                  <Text style={[styles.chiplabel, { color: t.text }]}>{label}</Text>
            </View>
      );
};

interface BioCertificationCardProps {
      trainer: Trainer;
}

const BioCertificationCard: React.FC<BioCertificationCardProps> = ({ trainer }) => (
      <View style={styles.biocard}>
            <Text style={styles.header}>Bio & Certification</Text>

            <View style={styles.columns}>
                  <View style={styles.column}>
                        <Text style={styles.columnTitle}>Specializations</Text>
                        <View style={styles.chipWrap}>
                              {trainer?.specialization?.length > 0 ? (
                                    trainer?.specialization?.map((item) => (
                                          <Chip key={item} label={item} tone="primary" />
                                    ))
                              ) : (
                                    <Text style={styles.emptyText}>No specializations listed</Text>
                              )}
                        </View>
                  </View>

                  <View style={styles.column}>
                        <Text style={styles.columnTitle}>Certificates</Text>
                        <View style={styles.chipWrap}>
                              {trainer?.certifications?.length > 0 ? (
                                    trainer?.certifications?.map((item) => (
                                          <Chip key={item} label={item} tone="primary" />
                                    ))
                              ) : (
                                    <Text style={styles.emptyText}>No certificates listed</Text>
                              )}
                        </View>
                  </View>
            </View>
      </View>
);

interface DashboardHeaderProps {
      trainer: Trainer;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ trainer }) => (
      <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.banner}
      >
            <View style={styles.glow} />

            <View style={styles.topRow}>
                  <View style={styles.textBlock}>
                        <Text style={styles.title}>
                              Coach Workspace: <Text style={styles.name}>{trainer?.name}</Text>
                        </Text>
                        <Text style={styles.subtitle}>
                              Review assigned students, customize training journals, and
                              schedule health coaching panels.
                        </Text>
                  </View>

                  <View style={styles.avatarWrap}>
                        {trainer?.profileImage ? (
                              <Image source={{ uri: trainer.profileImage }} style={styles.avatar} />
                        ) : (
                              <View style={[styles.avatar, styles.avatarFallback]}>
                                    <Text style={styles.avatarInitial}>
                                          {trainer?.name?.charAt(0).toUpperCase()}
                                    </Text>
                              </View>
                        )}
                        {trainer?.isVerified && (
                              <View style={styles.verifiedBadge}>
                                    <Icon name="checkmark" size={11} color={COLORS.primary} />
                              </View>
                        )}
                  </View>
            </View>
      </LinearGradient>
);

interface QuickStatsRowProps {
      trainer: Trainer;
}

const QuickStatsRow: React.FC<QuickStatsRowProps> = ({ trainer }) => (
      <View style={styles.row}>
            <StatCard
                  icon="people-outline"
                  label="Total Capacity"
                  value={String(trainer?.clients?.length)}
                  caption="Active assigned students"
            />
            <StatCard
                  icon="ribbon-outline"
                  label="Experience"
                  value={`${trainer?.experience}`}
                  caption={trainer?.experience === 1 ? 'Year coaching' : 'Years coaching'}
            />
      </View>
);

interface AvailabilityCardProps {
      trainer: Trainer;
}

const AvailabilityCard: React.FC<AvailabilityCardProps> = ({ trainer }) => (
      <View style={styles.avacard}>
            <View style={styles.headerRow}>
                  <Icon name="calendar-outline" size={16} color={COLORS.gold} />
                  <Text style={styles.avaheader}>Weekly Availability</Text>
            </View>

            <View style={styles.avachipWrap}>
                  {trainer?.availability?.length > 0 ? (
                        trainer?.availability?.map((slot) => (
                              <Chip key={slot} label={slot} icon="time-outline" tone="gold" />
                        ))
                  ) : (
                        <Text style={styles.avaemptyText}>No availability set yet</Text>
                  )}
            </View>
      </View>
);

interface ContactCardProps {
      trainer: Trainer;
}

const ContactCard: React.FC<ContactCardProps> = ({ trainer }) => (
      <View style={styles.contactcard}>
            <Text style={styles.conheader}>Contact</Text>

            <Pressable
                  style={styles.conrow}
                  onPress={() => Linking.openURL(`mailto:${trainer?.email}`).catch(() => { })}
            >
                  <View style={styles.coniconCircle}>
                        <Icon name="mail-outline" size={15} color={COLORS.goldDark} />
                  </View>
                  <Text style={styles.rowText} numberOfLines={1}>
                        {trainer?.email}
                  </Text>
                  <Icon name="chevron-forward" size={16} color={COLORS.textMuted} />
            </Pressable>

            <View style={styles.divider} />

            <Pressable
                  style={styles.conrow}
                  onPress={() => Linking.openURL(`tel:${trainer?.phone}`).catch(() => { })}
            >
                  <View style={styles.coniconCircle}>
                        <Icon name="call-outline" size={15} color={COLORS.goldDark} />
                  </View>
                  <Text style={styles.rowText}>{trainer?.phone}</Text>
                  <Icon name="chevron-forward" size={16} color={COLORS.textMuted} />
            </Pressable>
      </View>
);


type TrainerDashboardProps = NativeBottomTabScreenProps<TrainerTabParamList, 'Dashboard'>;

export const TrainerDashboard = ({ navigation }: TrainerDashboardProps) => {
      const rootNav = navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
      const alert = useAlert();
      const [refreshing, setrefreshing] = useState(false);
      const authRemove = useAuthStore((s) => s.removeAuth);
      const [trainer, setTrainer] = useState<Trainer>(null as unknown as Trainer); // Replace with actual trainer data fetching logic

      useEffect(() => {
            fetchTrainerProfile();
      }, []);
      const fetchTrainerProfile = async () => {
            const response = await trainerProfile();
            const profileData = response.data;
            setTrainer(profileData);
      }
      const onRefresh = () => {
            try {
                  setrefreshing(true);
                  fetchTrainerProfile();
            } finally {
                  setrefreshing(false);
            }
      }
      const onLogout = async () => {
            await authRemove();
            alert.success('You are logged out');
            rootNav.replace('MainTab', { screen: 'Home' })
      }
      return (
            <>
                  <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
                  <ScrollView
                        style={styles.flex}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                              <RefreshControl
                                    refreshing={refreshing}
                                    onRefresh={onRefresh}
                                    tintColor={COLORS.gold}
                                    colors={[COLORS.primary]}
                              />
                        }
                  >
                        <View style={{
                              marginHorizontal: 16,
                              marginTop: 16,
                              flexDirection: 'row',
                              justifyContent: 'space-between'
                        }}>
                              <Pressable onPress={onLogout}>
                                    <Icon name='log-out-outline' size={25} color={COLORS.goldDark} />
                              </Pressable>
                              <Icon name='notifications-outline' size={25} color={COLORS.goldDark} />
                        </View>
                        <DashboardHeader trainer={trainer} />
                        <QuickStatsRow trainer={trainer} />
                        <BioCertificationCard trainer={trainer} />
                        <AvailabilityCard trainer={trainer} />
                        {/* <StudentsSection trainer={trainer} students={students} /> */}
                        <ContactCard trainer={trainer} />
                  </ScrollView>
            </>
      );
}

const styles = StyleSheet.create({
      flex: {
            flex: 1,
            backgroundColor: COLORS.background,
      },
      content: {
            paddingBottom: 40,
      },
      banner: {
            borderRadius: 24,
            marginHorizontal: 16,
            marginTop: 16,
            padding: 24,
            overflow: 'hidden',
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.35,
            shadowRadius: 20,
            elevation: 10,
      },
      glow: {
            position: 'absolute',
            top: -40,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: 80,
            backgroundColor: 'rgba(255,255,255,0.08)',
      },
      topRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
      },
      textBlock: {
            flex: 1,
            paddingRight: 16,
      },
      title: {
            fontSize: 21,
            fontWeight: '800',
            color: COLORS.text,
            lineHeight: 27,
            marginBottom: 8,
      },
      name: {
            color: COLORS.goldLight,
      },
      subtitle: {
            fontSize: 12.5,
            color: 'rgba(255,255,255,0.85)',
            lineHeight: 18,
      },
      avatarWrap: {
            width: 56,
            height: 56,
      },
      avatar: {
            width: 56,
            height: 56,
            borderRadius: 28,
            borderWidth: 2,
            borderColor: 'rgba(255,255,255,0.5)',
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
      verifiedBadge: {
            position: 'absolute',
            bottom: -2,
            right: -2,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: COLORS.goldLight,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: COLORS.primaryDark,
      },
      row: {
            flexDirection: 'row',
            gap: 12,
            paddingHorizontal: 16,
            marginTop: 16,
      },
      card: {
            flex: 1,
            backgroundColor: COLORS.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 18,
      },
      iconRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 14,
      },
      iconCircle: {
            width: 28,
            height: 28,
            borderRadius: 9,
            // backgroundColor: 'rgba(166, 24, 82, 0.1)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 8,
      },
      label: {
            fontSize: 10.5,
            fontWeight: '800',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: '#71717A',
            flexShrink: 1,
      },
      value: {
            fontSize: 30,
            fontWeight: '800',
            color: COLORS.primary,
            marginBottom: 4,
      },
      caption: {
            fontSize: 11.5,
            color: COLORS.text,
            fontWeight: '600',
      },
      biocard: {
            backgroundColor: COLORS.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 20,
            marginHorizontal: 16,
            marginTop: 16,
      },
      header: {
            fontSize: 10.5,
            fontWeight: '800',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: '#71717A',
            marginBottom: 18,
      },
      columns: {
            flexDirection: 'row',
            gap: 20,
      },
      column: {
            flex: 1,
      },
      columnTitle: {
            fontSize: 14,
            fontWeight: '800',
            color: COLORS.textSecondary,
            marginBottom: 10,
      },
      chipWrap: {
            flexDirection: 'row',
            flexWrap: 'wrap',
      },
      emptyText: {
            fontSize: 12,
            color: '#A1A1AA',
            fontStyle: 'italic',
      },
      chip: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 999,
            paddingVertical: 7,
            paddingHorizontal: 14,
            marginRight: 8,
            marginBottom: 8,
      },
      icon: {
            marginRight: 5,
      },
      chiplabel: {
            fontSize: 12.5,
            fontWeight: '800',
      },
      avacard: {
            backgroundColor: COLORS.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 20,
            marginHorizontal: 16,
            marginTop: 16,
      },
      headerRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
      },
      avaheader: {
            fontSize: 15,
            fontWeight: '800',
            color: COLORS.text,
            marginLeft: 8,
      },
      avachipWrap: {
            flexDirection: 'row',
            flexWrap: 'wrap',
      },
      avaemptyText: {
            fontSize: 12,
            color: COLORS.textMuted,
            fontStyle: 'normal',
      },
      contactcard: {
            backgroundColor: COLORS.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 20,
            marginHorizontal: 16,
            marginTop: 16,
            marginBottom: 45,
      },
      conheader: {
            fontSize: 10.5,
            fontWeight: '800',
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: '#71717A',
            marginBottom: 14,
      },
      conrow: {
            flexDirection: 'row',
            alignItems: 'center',
            // paddingVertical: 4,
      },
      coniconCircle: {
            width: 32,
            height: 32,
            borderRadius: 10,
            // backgroundColor: 'rgba(166, 24, 82, 0.1)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
      },
      rowText: {
            flex: 1,
            fontSize: 13.5,
            fontWeight: '700',
            color: COLORS.text,
      },
      divider: {
            height: 1,
            backgroundColor: COLORS.border,
            marginVertical: 12,
      },
});
