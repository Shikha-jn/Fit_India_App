import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../theme/theme';
import { WorkoutPlan } from '../../../profile/types/user';
import SectionHeader from '../components/SectionHeader';

interface PreviewRowProps {
      tag: string;
      title: string;
      subtitle?: string;
}

const PreviewRow: React.FC<PreviewRowProps> = ({ tag, title, subtitle }) => (
      <View style={styles.row}>
            <View style={styles.titleRow}>
                  <Text style={styles.tag}>{tag}</Text>
                  <Text style={styles.title} numberOfLines={1}>
                        {title}
                  </Text>
            </View>
            {!!subtitle && (
                  <Text style={styles.subtitle} numberOfLines={2}>
                        {subtitle}
                  </Text>
            )}
      </View>
);

interface WorkoutsPreviewCardProps {
      workoutPlan: WorkoutPlan[];
      onViewAll?: () => void;
      maxVisible?: number;
}

const WorkoutsPreviewCard: React.FC<WorkoutsPreviewCardProps> = ({
      workoutPlan,
      onViewAll,
      maxVisible = 3,
}) => {
      const visible = workoutPlan.slice(0, maxVisible);

      return (
            <View style={styles.card}>
                  <SectionHeader label="Weekly Workouts Preview" />

                  {visible.length > 0 ? (
                        visible.map((item) => (
                              <PreviewRow
                                    key={item._id}
                                    tag={item.day}
                                    title={item.activity}
                                    subtitle={item.details}
                              />
                        ))
                  ) : (
                        <Text style={styles.emptyText}>No workout plan assigned yet</Text>
                  )}

                  {workoutPlan.length > maxVisible && (
                        <Pressable onPress={onViewAll} style={styles.viewAllBtn}>
                              <Text style={styles.viewAllText}>
                                    View full plan ({workoutPlan.length})
                              </Text>
                              <Icon name="chevron-forward" size={14} color={COLORS.primary} />
                        </Pressable>
                  )}
            </View>
      );
};

const styles = StyleSheet.create({
      card: {
            flex: 1,
            backgroundColor: COLORS.surfaceElevated,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 18,
      },
      emptyText: {
            fontSize: 12.5,
            color: '#A1A1AA',
            fontStyle: 'italic',
      },
      viewAllBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 4,
      },
      viewAllText: {
            fontSize: 12,
            fontWeight: '800',
            color: COLORS.primary,
            marginRight: 4,
      },
      row: {
            backgroundColor: COLORS.backgroundSecondary,
            borderRadius: 14,
            paddingVertical: 12,
            paddingHorizontal: 14,
            marginBottom: 10,
      },
      titleRow: {
            flexDirection: 'row',
            alignItems: 'baseline',
      },
      tag: {
            fontSize: 13,
            fontWeight: '800',
            color: COLORS.primary,
            marginRight: 8,
      },
      title: {
            fontSize: 13.5,
            fontWeight: '700',
            color: COLORS.text,
            flexShrink: 1,
      },
      subtitle: {
            fontSize: 11.5,
            color: COLORS.textMuted,
            marginTop: 2,
      },
});

export default WorkoutsPreviewCard;