import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Linking, StyleSheet, Animated, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../../theme/theme';
import { zoomMeeting, MeetingStatus } from '../types/zoomMetting';
import {
      getMeetingStatus,
      formatCreatedAt,
      formatSessionDate,
      formatSessionTime,
      minutesUntilStart,
      JOIN_WINDOW_MINUTES,
} from '../utils/ZoomMeetingUtils';

interface MeetingStatusPillProps {
      status: MeetingStatus;
}

const CONFIG: Record<MeetingStatus, { label: string; color: string; bg: string }> = {
      scheduled: {
            label: 'Scheduled',
            color: COLORS.primaryLight,
            bg: 'rgba(198, 53, 115, 0.14)',
      },
      live: { label: 'Live Now', color: COLORS.text, bg: COLORS.error },
      completed: {
            label: 'Completed',
            color: COLORS.textMuted,
            bg: 'rgba(161, 161, 170, 0.14)',
      },
};

const MeetingStatusPill: React.FC<MeetingStatusPillProps> = ({ status }) => {
      const config = CONFIG[status];
      const pulse = useRef(new Animated.Value(1)).current;

      useEffect(() => {
            if (status !== 'live') return;
            const loop = Animated.loop(
                  Animated.sequence([
                        Animated.timing(pulse, { toValue: 0.35, duration: 650, useNativeDriver: true }),
                        Animated.timing(pulse, { toValue: 1, duration: 650, useNativeDriver: true }),
                  ]),
            );
            loop.start();
            return () => loop.stop();
      }, [status, pulse]);

      return (
            <View style={[styles.pill, { backgroundColor: config.bg }]}>
                  {status === 'live' && <Animated.View style={[styles.dot, { opacity: pulse }]} />}
                  <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
            </View>
      );
};

interface ZoomMeetingCardProps {
      meeting: zoomMeeting;
}

const ZoomMeetingCard: React.FC<ZoomMeetingCardProps> = ({ meeting }) => {
      const status = getMeetingStatus(meeting.startTime);
      const minsLeft = minutesUntilStart(meeting.startTime);
      const canJoin =
            status === 'live' || (status === 'scheduled' && minsLeft <= JOIN_WINDOW_MINUTES);

      const handleJoin = () => {
            Linking.openURL(meeting.link).catch(() => { });
      };

      const noteText =
            status === 'completed'
                  ? 'This session has ended'
                  : status === 'live'
                        ? 'Session is live now'
                        : `Join ${JOIN_WINDOW_MINUTES} mins before session starts`;

      return (
            <View style={[styles.card, status === 'live' && styles.cardLive]}>
                  <View style={styles.topRow}>
                        <View style={styles.createdRow}>
                              <Icon name="time-outline" size={13} color={COLORS.textMuted} />
                              <Text style={styles.createdText}>
                                    Created: {formatCreatedAt(meeting.createdAt)}
                              </Text>
                        </View>
                        <MeetingStatusPill status={status} />
                  </View>

                  <View style={styles.titleRow}>
                        <Icon name="videocam" size={17} color={COLORS.primaryLight} />
                        <Text style={styles.title}>Daily Workout Session</Text>
                  </View>
                  <Text style={styles.description}>
                        Join the workout class using the button below. Ensure your camera
                        is turned on for real-time coach feedback!
                  </Text>

                  <View style={styles.infoBox}>
                        <View style={styles.infoRow}>
                              <Icon name="calendar-outline" size={15} color={COLORS.primaryLight} />
                              <Text style={styles.infoText}>{formatSessionDate(meeting.startTime)}</Text>
                        </View>
                        <View style={styles.infoRow}>
                              <Icon name="time-outline" size={15} color={COLORS.primaryLight} />
                              <Text style={styles.infoText}>
                                    Session Starts: {formatSessionTime(meeting.startTime)}
                              </Text>
                        </View>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.footer}>
                        <View style={styles.noteRow}>
                              <Icon
                                    name="alert-circle-outline"
                                    size={14}
                                    color={status === 'live' ? COLORS.error : COLORS.textMuted}
                              />
                              <Text
                                    style={[
                                          styles.noteText,
                                          status === 'live' && { color: COLORS.error, fontWeight: TYPOGRAPHY.bold },
                                    ]}
                              >
                                    {noteText}
                              </Text>
                        </View>

                        {status !== 'completed' ? (
                              <Pressable
                                    onPress={handleJoin}
                                    style={[styles.joinBtn, !canJoin && styles.joinBtnDisabled]}
                              >
                                    <Text style={styles.joinBtnText}>
                                          {status === 'live' ? 'Join Now' : 'Join Zoom Meeting'}
                                    </Text>
                                    <Icon name="open-outline" size={14} color={COLORS.text} />
                              </Pressable>
                        ) : (
                              <View style={styles.endedBtn}>
                                    <Text style={styles.endedBtnText}>Session Ended</Text>
                              </View>
                        )}
                  </View>
            </View>
      );
};

const styles = StyleSheet.create({
      card: {
            backgroundColor: COLORS.surface,
            borderRadius: RADII.xl,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: SPACING.lg - 4,
            marginHorizontal: SPACING.md,
            marginBottom: SPACING.md,
      },
      cardLive: {
            borderColor: COLORS.error,
            shadowColor: COLORS.error,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.35,
            shadowRadius: 16,
            elevation: 8,
      },
      topRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: SPACING.md,
      },
      createdRow: {
            flexDirection: 'row',
            alignItems: 'center',
      },
      createdText: {
            fontSize: 11.5,
            color: COLORS.textMuted,
            fontWeight: TYPOGRAPHY.medium,
            marginLeft: 5,
      },
      titleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: SPACING.sm,
      },
      title: {
            fontSize: 17,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
            marginLeft: SPACING.sm,
      },
      description: {
            fontSize: 12.5,
            color: COLORS.textSecondary,
            lineHeight: 19,
            marginBottom: SPACING.md,
      },
      infoBox: {
            backgroundColor: COLORS.surfaceElevated,
            borderRadius: RADII.md + 2,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: SPACING.md,
      },
      infoRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: SPACING.sm,
      },
      infoText: {
            fontSize: 13,
            fontWeight: TYPOGRAPHY.bold,
            color: COLORS.text,
            marginLeft: SPACING.sm,
      },
      divider: {
            height: 1,
            backgroundColor: COLORS.border,
            marginVertical: SPACING.md,
      },
      footer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: SPACING.sm,
      },
      noteRow: {
            flexDirection: 'row',
            alignItems: 'center',
            flexShrink: 1,
      },
      noteText: {
            fontSize: 11.5,
            color: COLORS.textMuted,
            fontWeight: TYPOGRAPHY.medium,
            marginLeft: 5,
            flexShrink: 1,
      },
      joinBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.primary,
            borderRadius: RADII.md + 2,
            paddingVertical: 12,
            paddingHorizontal: 18,
      },
      joinBtnDisabled: {
            opacity: 0.55,
      },
      joinBtnText: {
            color: COLORS.text,
            fontSize: 13,
            fontWeight: TYPOGRAPHY.extraBold,
            marginRight: 6,
      },
      endedBtn: {
            backgroundColor: COLORS.surfaceElevated,
            borderRadius: RADII.md + 2,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingVertical: 12,
            paddingHorizontal: 18,
      },
      endedBtnText: {
            color: COLORS.textMuted,
            fontSize: 13,
            fontWeight: TYPOGRAPHY.bold,
      },
      pill: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            borderRadius: RADII.full,
            paddingVertical: 5,
            paddingHorizontal: 12,
      },
      dot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: COLORS.text,
            marginRight: 6,
      },
      label: {
            fontSize: 10.5,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
      },
});

export default ZoomMeetingCard;