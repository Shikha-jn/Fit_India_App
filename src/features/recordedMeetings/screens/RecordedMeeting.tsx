import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
      View,
      Text,
      StyleSheet,
      FlatList,
      TouchableOpacity,
      Animated,
      RefreshControl,
      ActivityIndicator,
      Linking,
      Dimensions,
      ListRenderItemInfo,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../../theme/theme';
import { RecordedMeeting, RecordedMeetingResponse } from '../types/recordedMeetings';
import { getRecordedSessions } from '../../../services/client.service';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Props ────────────────────────────────────────────────────────────────────
export interface RecordedMeetingsScreenProps {
      // fetchMeetings: () => Promise<RecordedMeetingResponse>;
      // onMeetingPress?: (meeting: RecordedMeeting) => void;
      // onBack?: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatRecordedDate = (iso: string): string => {
      try {
            const date = new Date(iso);
            return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
            });
      } catch {
            return '';
      }
};

const formatRecordedTime = (iso: string): string => {
      try {
            const date = new Date(iso);
            return date.toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit',
            });
      } catch {
            return '';
      }
};

// ─── Animated card wrapper ─────────────────────────────────────────────────────
const AnimatedCard: React.FC<{ index: number; children: React.ReactNode }> = ({
      index,
      children,
}) => {
      const opacity = useRef(new Animated.Value(0)).current;
      const translateY = useRef(new Animated.Value(18)).current;

      useEffect(() => {
            Animated.parallel([
                  Animated.timing(opacity, {
                        toValue: 1,
                        duration: 380,
                        delay: Math.min(index, 8) * 60,
                        useNativeDriver: true,
                  }),
                  Animated.spring(translateY, {
                        toValue: 0,
                        tension: 60,
                        friction: 9,
                        delay: Math.min(index, 8) * 60,
                        useNativeDriver: true,
                  }),
            ]).start();
      }, []);

      return (
            <Animated.View style={{ opacity, transform: [{ translateY }] }}>
                  {children}
            </Animated.View>
      );
};

// ─── Meeting card ───────────────────────────────────────────────────────────────
const MeetingCard: React.FC<{
      meeting: RecordedMeeting;
      onPress: (meeting: RecordedMeeting) => void;
}> = ({ meeting, onPress }) => {
      return (
            <TouchableOpacity
                  style={styles.card}
                  activeOpacity={0.85}
                  onPress={() => onPress(meeting)}
            >
                  <LinearGradient
                        colors={[COLORS.surfaceElevated, COLORS.surface]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.cardInner}
                  >
                        {/* Thumbnail */}
                        <LinearGradient
                              colors={[COLORS.primary + '33', COLORS.gradientMid, COLORS.gold + '22']}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 1 }}
                              style={styles.thumbnail}
                        >
                              <View style={styles.playBadge}>
                                    <Ionicons name="play" size={20} color={COLORS.text} />
                              </View>
                        </LinearGradient>

                        {/* Content */}
                        <View style={styles.cardContent}>
                              <Text style={styles.cardTitle} numberOfLines={1}>
                                    {meeting.title}
                              </Text>
                              {meeting.description ? (
                                    <Text style={styles.cardDescription} numberOfLines={2}>
                                          {meeting.description}
                                    </Text>
                              ) : null}

                              <View style={styles.metaRow}>
                                    <View style={styles.metaItem}>
                                          <Ionicons
                                                name="calendar-outline"
                                                size={13}
                                                color={COLORS.goldLight}
                                          />
                                          <Text style={styles.metaText}>
                                                {formatRecordedDate(meeting.recordedAt)}
                                          </Text>
                                    </View>
                                    <View style={styles.metaDot} />
                                    <View style={styles.metaItem}>
                                          <Ionicons
                                                name="time-outline"
                                                size={13}
                                                color={COLORS.goldLight}
                                          />
                                          <Text style={styles.metaText}>
                                                {formatRecordedTime(meeting.recordedAt)}
                                          </Text>
                                    </View>
                              </View>
                        </View>

                        {/* Chevron */}
                        <View style={styles.chevronWrap}>
                              <Ionicons
                                    name="chevron-forward"
                                    size={18}
                                    color={COLORS.textMuted}
                              />
                        </View>
                  </LinearGradient>
            </TouchableOpacity>
      );
};

// ─── Empty state ────────────────────────────────────────────────────────────────
const EmptyState: React.FC = () => {
      const iconScale = useRef(new Animated.Value(0.8)).current;

      useEffect(() => {
            Animated.spring(iconScale, {
                  toValue: 1,
                  tension: 60,
                  friction: 6,
                  useNativeDriver: true,
            }).start();
      }, []);

      return (
            <View style={styles.emptyWrap}>
                  <Animated.View style={{ transform: [{ scale: iconScale }] }}>
                        <LinearGradient
                              colors={[COLORS.primary + '26', COLORS.primary + '0D']}
                              style={styles.emptyIconCircle}
                        >
                              <Ionicons name="videocam-outline" size={30} color={COLORS.primaryLight} />
                        </LinearGradient>
                  </Animated.View>
                  <Text style={styles.emptyTitle}>No Recordings Available</Text>
                  <Text style={styles.emptySubtitle}>
                        There are no recorded sessions uploaded yet. Please check back later.
                  </Text>
            </View>
      );
};

// ─── Loading state ──────────────────────────────────────────────────────────────
const LoadingState: React.FC = () => (
      <View style={styles.emptyWrap}>
            <ActivityIndicator size="large" color={COLORS.gold} />
            <Text style={[styles.emptySubtitle, { marginTop: SPACING.md }]}>
                  Loading recordings…
            </Text>
      </View>
);

// ─── Screen ─────────────────────────────────────────────────────────────────────
export default function RecordedMeetings({ }: RecordedMeetingsScreenProps) {
      const [meetings, setMeetings] = useState<RecordedMeeting[]>([]);
      const [isLoading, setIsLoading] = useState<boolean>(true);

      const fetchMeetings = async () => {
            const response = await getRecordedSessions();
            setMeetings(response.data);
      }
      const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
      const [error, setError] = useState<string | null>(null);

      const load = useCallback(async () => {
            try {
                  setError(null);
                  await fetchMeetings();
            } catch (err) {
                  setError('Unable to load recordings. Pull down to try again.');
            } finally {
                  setIsLoading(false);
                  setIsRefreshing(false);
            }
      }, [fetchMeetings]);

      useEffect(() => {
            load();
      }, [load]);

      const handleRefresh = useCallback(() => {
            setIsRefreshing(true);
            load();
      }, [load]);

      const handlePress = (meeting: RecordedMeeting) => {
            if (meeting.link) {
                  Linking.openURL(meeting.link).catch(() => { });
            }
      };

      const renderItem = ({ item, index }: ListRenderItemInfo<RecordedMeeting>) => (
            <AnimatedCard index={index}>
                  <MeetingCard meeting={item} onPress={() => handlePress(item)} />
            </AnimatedCard>
      );

      const onBack = () => { }

      return (
            <View style={styles.screen}>
                  {/* Header */}
                  <View style={styles.header}>
                        <View style={styles.headerTopRow}>
                              {onBack ? (
                                    <TouchableOpacity
                                          style={styles.backBtn}
                                          onPress={onBack}
                                          activeOpacity={0.7}
                                    >
                                          <Ionicons name="chevron-back" size={20} color={COLORS.text} />
                                    </TouchableOpacity>
                              ) : null}
                              <View style={styles.headerTextWrap}>
                                    <Text style={styles.headerTitle}>Recorded Workout Sessions</Text>
                                    <Text style={styles.headerSubtitle}>
                                          Missed a session? Access all your daily live workout
                                          recordings here to catch up anytime.
                                    </Text>
                              </View>
                        </View>
                        <LinearGradient
                              colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={styles.headerAccent}
                        />
                  </View>

                  {/* Content */}
                  {isLoading ? (
                        <LoadingState />
                  ) : (
                        <FlatList
                              data={meetings}
                              keyExtractor={item => item._id}
                              renderItem={renderItem}
                              contentContainerStyle={
                                    meetings.length === 0 ? styles.listEmptyContainer : styles.listContainer
                              }
                              showsVerticalScrollIndicator={false}
                              refreshControl={
                                    <RefreshControl
                                          refreshing={isRefreshing}
                                          onRefresh={handleRefresh}
                                          tintColor={COLORS.gold}
                                          colors={[COLORS.gold]}
                                    />
                              }
                              ListEmptyComponent={
                                    <>
                                          {error ? (
                                                <View style={styles.emptyWrap}>
                                                      <LinearGradient
                                                            colors={[COLORS.error + '26', COLORS.error + '0D']}
                                                            style={styles.emptyIconCircle}
                                                      >
                                                            <Ionicons
                                                                  name="alert-circle-outline"
                                                                  size={30}
                                                                  color={COLORS.error}
                                                            />
                                                      </LinearGradient>
                                                      <Text style={styles.emptyTitle}>Something Went Wrong</Text>
                                                      <Text style={styles.emptySubtitle}>{error}</Text>
                                                </View>
                                          ) : (
                                                <EmptyState />
                                          )}
                                    </>
                              }
                        />
                  )}
            </View>
      );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
      screen: {
            flex: 1,
            backgroundColor: COLORS.background,
      },

      // Header
      header: {
            paddingTop: 56,
            paddingHorizontal: SPACING.lg,
            paddingBottom: SPACING.lg,
            backgroundColor: COLORS.surface,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
      },
      headerTopRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: SPACING.sm + 4,
      },
      backBtn: {
            width: 34,
            height: 34,
            borderRadius: RADII.full,
            backgroundColor: COLORS.surfaceElevated,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: COLORS.border,
            marginTop: 2,
      },
      headerTextWrap: {
            flex: 1,
      },
      headerTitle: {
            fontSize: 19,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
            letterSpacing: -0.2,
            marginBottom: 4,
      },
      headerSubtitle: {
            fontSize: 13,
            fontWeight: TYPOGRAPHY.regular,
            color: COLORS.textMuted,
            lineHeight: 18,
      },
      headerAccent: {
            height: 3,
            borderRadius: RADII.full,
            marginTop: SPACING.md,
            width: 56,
      },

      // List
      listContainer: {
            paddingHorizontal: SPACING.lg,
            paddingTop: SPACING.lg,
            paddingBottom: SPACING.xxl,
            gap: SPACING.sm + 4,
      },
      listEmptyContainer: {
            flexGrow: 1,
      },

      // Card
      card: {
            borderRadius: RADII.lg - 2,
            overflow: 'hidden',
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 14,
            elevation: 5,
      },
      cardInner: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: SPACING.sm + 4,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: RADII.lg - 2,
            gap: SPACING.sm + 4,
      },
      thumbnail: {
            width: 64,
            height: 64,
            borderRadius: RADII.md,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: COLORS.border,
      },
      playBadge: {
            width: 34,
            height: 34,
            borderRadius: RADII.full,
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center',
            paddingLeft: 2,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.5,
            shadowRadius: 6,
            elevation: 4,
      },
      cardContent: {
            flex: 1,
      },
      cardTitle: {
            fontSize: 15,
            fontWeight: TYPOGRAPHY.bold,
            color: COLORS.text,
            marginBottom: 3,
      },
      cardDescription: {
            fontSize: 12.5,
            fontWeight: TYPOGRAPHY.regular,
            color: COLORS.textMuted,
            lineHeight: 17,
            marginBottom: SPACING.xs + 2,
      },
      metaRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.xs + 2,
      },
      metaItem: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
      },
      metaText: {
            fontSize: 11.5,
            fontWeight: TYPOGRAPHY.medium,
            color: COLORS.textSecondary,
      },
      metaDot: {
            width: 3,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: COLORS.divider,
      },
      chevronWrap: {
            paddingLeft: SPACING.xs,
      },

      // Empty / loading
      emptyWrap: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: SPACING.xl,
            paddingVertical: SPACING.xxl,
      },
      emptyIconCircle: {
            width: 68,
            height: 68,
            borderRadius: RADII.full,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: SPACING.md + 2,
            borderWidth: 1,
            borderColor: COLORS.border,
      },
      emptyTitle: {
            fontSize: 16,
            fontWeight: TYPOGRAPHY.bold,
            color: COLORS.text,
            marginBottom: 6,
            textAlign: 'center',
      },
      emptySubtitle: {
            fontSize: 13,
            fontWeight: TYPOGRAPHY.regular,
            color: COLORS.textMuted,
            textAlign: 'center',
            lineHeight: 19,
            maxWidth: SCREEN_WIDTH * 0.75,
      },
});