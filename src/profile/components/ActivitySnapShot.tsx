import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../theme/theme';
import { UserData, Trainer } from '../types/user';

interface ActivitySnapshotCardProps {
  user: UserData;
  trainer?: Trainer;
}

const ActivitySnapshotCard: React.FC<ActivitySnapshotCardProps> = ({
  user,
  trainer,
}) => (
  <View style={styles.card}>
    <Text style={styles.sectionLabel}>Activity Snapshot</Text>

    <View style={styles.miniStatsRow}>
      <MiniStat icon="checkmark-done-outline" value={user.attendance.length} label="Sessions" />
      <MiniStat icon="videocam-outline" value={user.webinarsRegistered.length} label="Webinars" />
      <MiniStat
        icon={user.trialsUsed ? 'checkmark-circle-outline' : 'gift-outline'}
        value={user.trialsUsed ? 'Used' : 'Available'}
        label="Free Trial"
      />
    </View>

    <View style={styles.divider} />

    <Text style={styles.sectionLabel}>Assigned Coach</Text>
    {trainer ? (
      <View style={styles.trainerRow}>
        {/* {trainer.profileImage ? (
          <Image source={{ uri: trainer.profileImage }} style={styles.trainerAvatar} />
        ) : ( */}
          <View style={[styles.trainerAvatar, styles.trainerAvatarFallback]}>
            <Text style={styles.trainerInitial}>
              {trainer.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        {/* )} */}
        <Text style={styles.trainerName}>{trainer.name}</Text>
      </View>
    ) : (
      <Text style={styles.emptyText}>No coach assigned yet</Text>
    )}
  </View>
);

interface MiniStatProps {
  icon: string;
  value: string | number;
  label: string;
}

const MiniStat: React.FC<MiniStatProps> = ({ icon, value, label }) => (
  <View style={styles.miniStat}>
    <Icon name={icon} size={16} color={COLORS.primaryLight} />
    <Text style={styles.miniStatValue}>{value}</Text>
    <Text style={styles.miniStatLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
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
    marginBottom: SPACING.sm + 4,
  },
  miniStatsRow: {
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
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  trainerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trainerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: SPACING.sm + 2,
  },
  trainerAvatarFallback: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trainerInitial: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: TYPOGRAPHY.extraBold,
  },
  trainerName: {
    fontSize: 14,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.text,
  },
  emptyText: {
    fontSize: 12.5,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
});

export default ActivitySnapshotCard;