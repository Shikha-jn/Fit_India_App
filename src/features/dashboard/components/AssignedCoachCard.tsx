import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS } from '../../../theme/theme';
import SectionHeader from '../components/SectionHeader';

interface AssignedCoachCardProps {
      coach?: any;
}

const AssignedCoachCard: React.FC<AssignedCoachCardProps> = ({ coach }) => (
      <View style={styles.card}>
            <SectionHeader label="Assigned Coach" />

            {coach ? (
                  <>
                        <View style={styles.coachRow}>
                              {coach.profileImage ? (
                                    <Image source={{ uri: coach.profileImage }} style={styles.avatar} />
                              ) : (
                                    <View style={[styles.avatar, styles.avatarFallback]}>
                                          <Text style={styles.avatarInitial}>
                                                {coach.name.charAt(0).toUpperCase()}
                                          </Text>
                                    </View>
                              )}
                              <View>
                                    <Text style={styles.coachName}>{coach.name}</Text>
                                    <Text style={styles.coachSpecialization}>
                                          {coach.specialization.join(', ') || 'General Fitness'}
                                    </Text>
                              </View>
                        </View>

                        <View style={styles.contactRow}>
                              <Text style={styles.contactText}>Contact: {coach.phone}</Text>
                        </View>
                  </>
            ) : (
                  <Text style={styles.emptyText}>No coach assigned yet</Text>
            )}
      </View>
);

const styles = StyleSheet.create({
      card: {
            flex: 1,
            backgroundColor: COLORS.surface,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 18,
            justifyContent: 'space-between',
      },
      coachRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24,
      },
      avatar: {
            width: 44,
            height: 44,
            borderRadius: 22,
            marginRight: 12,
      },
      avatarFallback: {
            backgroundColor: 'rgba(166, 24, 82, 0.12)',
            alignItems: 'center',
            justifyContent: 'center',
      },
      avatarInitial: {
            color: COLORS.primary,
            fontSize: 17,
            fontWeight: '800',
      },
      coachName: {
            fontSize: 14.5,
            fontWeight: '800',
            color: COLORS.text,
            marginBottom: 2,
      },
      coachSpecialization: {
            fontSize: 12,
            color: COLORS.textMuted,
            fontWeight: '600',
      },
      contactRow: {
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: COLORS.divider,
      },
      contactText: {
            fontSize: 12,
            color: COLORS.textSecondary,
            fontWeight: '600',
      },
      emptyText: {
            fontSize: 12.5,
            color: '#A1A1AA',
            fontStyle: 'italic',
      },
});

export default AssignedCoachCard;