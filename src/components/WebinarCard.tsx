import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../theme/theme';
import { Webinar, WebinarStatus } from '../features/webinar/types/webinar';
import { cancelWebinar } from '../services/trainer.service';
import { useAlert } from '../context/AlertContext';

import {
      formatWebinarDate,
      formatWebinarTime,
      formatCountdown,
} from '../utils/dateFormat';

interface StatusBadgeProps {
      status: WebinarStatus;
}

const CONFIG: Record<WebinarStatus, { label: string; color: string; bg: string }> = {
      scheduled: { label: 'Upcoming', color: COLORS.gold, bg: 'rgba(212, 171, 58, 0.14)' },
      ongoing: { label: 'Live Now', color: COLORS.text, bg: COLORS.error },
      completed: { label: 'Completed', color: COLORS.success, bg: 'rgba(34, 197, 94, 0.14)' },
      cancelled: { label: 'Cancelled', color: COLORS.textMuted, bg: 'rgba(161, 161, 170, 0.14)' },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
      const config = CONFIG[status];
      const pulse = useRef(new Animated.Value(1)).current;

      useEffect(() => {
            if (status !== 'ongoing') return;
            const loop = Animated.loop(
                  Animated.sequence([
                        Animated.timing(pulse, {
                              toValue: 0.35,
                              duration: 650,
                              useNativeDriver: true,
                        }),
                        Animated.timing(pulse, {
                              toValue: 1,
                              duration: 650,
                              useNativeDriver: true,
                        }),
                  ]),
            );
            loop.start();
            return () => loop.stop();
      }, [status, pulse]);

      return (
            <View style={[styles.badge, { backgroundColor: config.bg }]}>
                  {status === 'ongoing' && (
                        <Animated.View style={[styles.dot, { opacity: pulse }]} />
                  )}
                  <Text style={[styles.label, { color: config.color }]}>{config.label}</Text>
            </View>
      );
};

interface CapacityBarProps {
      filled: number;
      capacity: number;
}

const CapacityBar: React.FC<CapacityBarProps> = ({ filled, capacity }) => {
      const safeCapacity = Math.max(capacity, 1);
      const ratio = Math.min(filled / safeCapacity, 1);
      const isAlmostFull = ratio >= 0.85;

      return (
            <View style={styles.container}>
                  <View style={styles.labelRow}>
                        <View style={styles.labelLeft}>
                              <Icon name="people-outline" size={13} color={COLORS.textMuted} />
                              <Text style={styles.labelText}>
                                    {filled}/{capacity} joined
                              </Text>
                        </View>
                        {isAlmostFull && (
                              <Text style={styles.almostFullText}>Filling fast</Text>
                        )}
                  </View>
                  <View style={styles.track}>
                        <View
                              style={[
                                    styles.fill,
                                    {
                                          width: `${ratio * 100}%`,
                                          backgroundColor: isAlmostFull ? COLORS.error : COLORS.primary,
                                    },
                              ]}
                        />
                  </View>
            </View>
      );
};

interface WebinarCardProps {
      webinar: Webinar;
      onPressCta?: (webinar: Webinar) => void;
      role?: string;
}

const FALLBACK_BANNER =
      'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=800&q=80';

const WebinarCard: React.FC<WebinarCardProps> = ({ webinar, onPressCta, role }) => {
      const {
            title,
            description,
            trainer,
            scheduleTime,
            status,
            participants,
            capacity,
            bannerImage,
            discountedPrice,
            originalPrice
      } = webinar;

      const isOngoing = status === 'ongoing';
      const alert = useAlert();

      const onCancel = async () => {
            const response = await cancelWebinar(webinar);
            if (response.success) {
                  alert.success('Webinar canclled');
            }
      }

      return (
            <View style={[styles.card, isOngoing && styles.cardOngoing]}>
                  <View style={styles.bannerWrap}>
                        <Image
                              source={{ uri: bannerImage || FALLBACK_BANNER }}
                              style={styles.banner}
                        />
                        <View style={styles.bannerOverlay} />
                        <View style={styles.bannerBadge}>
                              <StatusBadge status={status} />
                        </View>
                        {status === 'scheduled' && (
                              <View style={styles.countdownPill}>
                                    <Icon name="time-outline" size={11} color={COLORS.text} />
                                    <Text style={styles.countdownText}>{formatCountdown(scheduleTime)}</Text>
                              </View>
                        )}
                  </View>

                  <View style={styles.body}>
                        <Text style={styles.title} numberOfLines={2}>
                              {title}
                        </Text>
                        <Text style={styles.description} numberOfLines={2}>
                              {description}
                        </Text>

                        <View style={styles.metaRow}>
                              <View style={styles.metaItem}>
                                    <Icon name="person-circle-outline" size={15} color={COLORS.gold} />
                                    <Text style={styles.metaText}>{trainer.name}</Text>
                              </View>
                              <View style={styles.metaItem}>
                                    <Icon name="calendar-outline" size={14} color={COLORS.textMuted} />
                                    <Text style={styles.metaText}>{formatWebinarDate(scheduleTime)}</Text>
                              </View>
                              <View style={styles.metaItem}>
                                    <Icon name="time-outline" size={14} color={COLORS.textMuted} />
                                    <Text style={styles.metaText}>{formatWebinarTime(scheduleTime)}</Text>
                              </View>
                        </View>
                        <View style={styles.metaRow}>
                              <Text style={styles.metaText} numberOfLines={2}>
                                    {discountedPrice}
                              </Text>
                              <Text style={styles.metaText} numberOfLines={2}>
                                    {originalPrice}
                              </Text>
                        </View>

                        {status !== 'cancelled' && (
                              <CapacityBar filled={participants.length} capacity={capacity} />
                        )}
                        <View style={{
                              flexDirection: 'row', justifyContent: 'space-between', gap: 10,
                              width: "100%", alignItems: 'center'
                        }}>
                              <CardCta webinar={webinar} onPress={() => onPressCta?.(webinar)} role={role} />
                              {role === "trainer" && (
                                    <Pressable onPress={onCancel} style={styles.cancelButton}>
                                          <Text style={styles.cancelText}>Cancel</Text>
                                    </Pressable>
                              )}
                        </View>
                  </View>
            </View>
      );
};

const CardCta: React.FC<{ webinar: Webinar; onPress: () => void; role?: string }> = ({
      webinar,
      onPress,
      role
}) => {
      const { status, meetingLink } = webinar;

      if (status === 'cancelled') {
            return (
                  <View style={styles.cancelledNote}>
                        <Icon name="close-circle-outline" size={14} color={COLORS.textMuted} />
                        <Text style={styles.cancelledText}>This session was cancelled</Text>
                  </View>
            );
      }

      if (status === 'completed') {
            if (!meetingLink) {
                  return (
                        <View style={styles.unavailableNote}>
                              <Text style={styles.unavailableText}>Recording unavailable</Text>
                        </View>
                  );
            }
            return (
                  <Pressable onPress={onPress} style={styles.outlineBtn}>
                        <Icon name="play-circle-outline" size={16} color={COLORS.text} />
                        <Text style={styles.outlineBtnText}>Watch Recording</Text>
                  </Pressable>
            );
      }

      if (status === 'ongoing') {
            return (
                  <Pressable onPress={onPress} style={styles.liveBtnWrap}>
                        <View style={styles.liveBtn}>
                              <Icon name="videocam" size={17} color={COLORS.text} />
                              <Text style={styles.liveBtnText}>Join Live Now</Text>
                        </View>
                  </Pressable>
            );
      }

      // scheduled
      return (
            <Pressable onPress={onPress} style={styles.gradientBtnWrap}>
                  <LinearGradient
                        colors={[COLORS.goldLight, COLORS.primaryLight]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientBtn}
                  >
                        <Icon name="bookmark-outline" size={16} color={COLORS.text} />
                        {role === 'trainer' ?
                              (
                                    <Text style={styles.gradientBtnText}>Join</Text>
                              ) :
                              (
                                    <Text style={styles.gradientBtnText}>Pay & Register</Text>
                              )}
                  </LinearGradient>
            </Pressable>
      );
};

const styles = StyleSheet.create({
      card: {
            backgroundColor: COLORS.surface,
            borderRadius: 22,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: COLORS.border,
            marginBottom: 18,
      },
      cardOngoing: {
            borderColor: COLORS.error,
            shadowColor: COLORS.error,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.35,
            shadowRadius: 14,
            elevation: 6,
      },
      bannerWrap: {
            height: 200,
      },
      banner: {
            width: '100%',
            height: '100%',
      },
      bannerOverlay: {
            ...StyleSheet.absoluteFill,
            backgroundColor: 'rgba(9,9,11,0.28)',
      },
      bannerBadge: {
            position: 'absolute',
            top: 12,
            left: 12,
      },
      countdownPill: {
            position: 'absolute',
            top: 12,
            right: 12,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(9,9,11,0.65)',
            borderRadius: 999,
            paddingVertical: 5,
            paddingHorizontal: 10,
      },
      countdownText: {
            color: COLORS.text,
            fontSize: 10,
            fontWeight: '700',
            marginLeft: 4,
      },
      body: {
            padding: 16,
      },
      title: {
            fontSize: 16,
            fontWeight: '800',
            color: COLORS.text,
            marginBottom: 6,
      },
      description: {
            fontSize: 12.5,
            color: COLORS.textSecondary,
            lineHeight: 18,
            marginBottom: 12,
      },
      metaRow: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 12,
      },
      metaItem: {
            flexDirection: 'row',
            alignItems: 'center',
      },
      metaText: {
            fontSize: 11.5,
            color: COLORS.textMuted,
            fontWeight: '600',
            marginLeft: 4,
      },
      cancelledNote: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 12,
      },
      cancelledText: {
            color: COLORS.textMuted,
            fontSize: 12,
            fontWeight: '600',
            marginLeft: 6,
      },
      unavailableNote: {
            marginTop: 14,
      },
      unavailableText: {
            color: COLORS.textMuted,
            fontSize: 12,
            fontWeight: '600',
      },
      outlineBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 14,
            height: 46,
            borderRadius: 13,
            borderWidth: 1,
            borderColor: COLORS.border,
            backgroundColor: COLORS.surfaceElevated,
      },
      outlineBtnText: {
            color: COLORS.text,
            fontSize: 13,
            fontWeight: '800',
            marginLeft: 8,
      },
      liveBtnWrap: {
            marginTop: 14,
            borderRadius: 13,
            overflow: 'hidden',
      },
      liveBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 46,
            backgroundColor: COLORS.error,
      },
      liveBtnText: {
            color: COLORS.text,
            fontSize: 13,
            fontWeight: '800',
            marginLeft: 8,
      },
      gradientBtnWrap: {
            flex: 1,
            marginTop: 14,
            borderRadius: 13,
            overflow: 'hidden',
      },
      gradientBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 46,
      },
      gradientBtnText: {
            color: COLORS.text,
            fontSize: 13,
            fontWeight: '800',
            marginLeft: 8,
      },
      // StatusBadge styles
      badge: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            borderRadius: 999,
            paddingVertical: 5,
            paddingHorizontal: 10,
      },
      dot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: COLORS.text,
            marginRight: 6,
      },
      label: {
            fontSize: 10,
            fontWeight: '800',
            letterSpacing: 0.4,
            textTransform: 'uppercase',
      },

      // CapacityBar styles
      container: {
            marginTop: 4,
      },
      labelRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 6,
      },
      labelLeft: {
            flexDirection: 'row',
            alignItems: 'center',
      },
      labelText: {
            fontSize: 11,
            color: COLORS.textMuted,
            fontWeight: '600',
            marginLeft: 5,
      },
      almostFullText: {
            fontSize: 10,
            color: COLORS.error,
            fontWeight: '800',
            textTransform: 'uppercase',
      },
      track: {
            height: 6,
            borderRadius: 3,
            backgroundColor: COLORS.surfaceElevated,
            overflow: 'hidden',
      },
      fill: {
            height: '100%',
            borderRadius: 3,
      },
      cancelButton: {
            flex: 1,
            height: 48,
            borderWidth: 1,
            borderColor: COLORS.goldDark,
            borderRadius: 12,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 14,
      },

      cancelText: {
            color: COLORS.goldDark,
            fontSize: 14,
            fontWeight: "600",
      },
});

export default WebinarCard;