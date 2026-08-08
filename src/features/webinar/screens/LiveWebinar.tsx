import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
      View,
      Text,
      FlatList,
      StyleSheet,
      RefreshControl,
      ActivityIndicator,
      Linking,
      ScrollView,
      Pressable,
      Animated,
} from 'react-native';
import { COLORS } from '../../../theme/theme';
import { Webinar, WebinarFilter, WebinarStatus } from '../types/webinar';
import WebinarCard from '../../../components/WebinarCard';
import EmptyWebinarState from '../../../components/EmptyWebinarState';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeBottomTabScreenProps } from '@react-navigation/bottom-tabs/unstable';
import { MainTabParamList } from '../../../types/MainTabParamList';
import { liveWebinar } from '../../../services/webinar.service';

interface SectionBadgeProps {
      label: string;
      icon?: string;
}

const SectionBadge: React.FC<SectionBadgeProps> = ({ label, icon }) => (
      <View style={styles.badge}>
            {!!icon && <Icon name={icon} size={12} color={COLORS.gold} style={styles.icon} />}
            <Text style={styles.label}>{label}</Text>
      </View>
);

interface FilterOption {
      value: WebinarFilter;
      label: string;
}

const OPTIONS: FilterOption[] = [
      { value: 'all', label: 'All' },
      { value: 'ongoing', label: 'Live' },
      { value: 'scheduled', label: 'Upcoming' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' },
];

interface WebinarFilterTabsProps {
      value: WebinarFilter;
      onChange: (value: WebinarFilter) => void;
      counts?: Partial<Record<WebinarFilter, number>>;
}

const WebinarFilterTabs: React.FC<WebinarFilterTabsProps> = ({
      value,
      onChange,
      counts,
}) => (
      <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.row}
      >
            {OPTIONS.map((opt) => {
                  const isActive = opt.value === value;
                  const count = counts?.[opt.value];
                  return (
                        <Pressable
                              key={opt.value}
                              onPress={() => onChange(opt.value)}
                              style={[styles.pill, isActive && styles.pillActive]}
                        >
                              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                                    {opt.label}
                              </Text>
                              {typeof count === 'number' && count > 0 && (
                                    <View style={[styles.countBubble, isActive && styles.countBubbleActive]}>
                                          <Text style={[styles.countText, isActive && styles.countTextActive]}>
                                                {count}
                                          </Text>
                                    </View>
                              )}
                        </Pressable>
                  );
            })}
      </ScrollView>
);

type WebinarScreenProps = NativeBottomTabScreenProps<MainTabParamList, 'Webinar'>

const WebinarScreen: React.FC<WebinarScreenProps> = ({

}) => {
      const [filter, setFilter] = useState<WebinarFilter>('all');
      const [webinars, setWebinar] = useState<Webinar[]>([]);
      const [loading, setLoading] = useState(false);
      const [refreshing, setrefreshing] = useState(false);

      const counts = useMemo(() => {
            return webinars.reduce<Partial<Record<WebinarFilter, number>>>((acc, w) => {
                  acc[w.status] = (acc[w.status] ?? 0) + 1;
                  return acc;
            }, {});
      }, [webinars]);

      useEffect(() => {
            fetchlivewebinar();
      }, []);

      const fetchlivewebinar = async () => {
            try {
                  const response = await liveWebinar();
                  const webinarData = response.data ? response.data : [];
                  console.log('Live webinar data:', webinarData);
                  setWebinar(webinarData);
            } catch (error) {
                  console.log('Error in getting webinar data', error);
                  // throw error;
            }
      }

      const onPressWebinar = (webinar: Webinar) => {
            // Handle webinar press action here
      }

      const onRefresh = () => {
            setrefreshing(true);
      }

      const filtered = useMemo(() => {
            const list = filter === 'all' ? webinars : webinars.filter((w) => w.status === filter);
            // Ongoing first, then scheduled soonest-first, then the rest.
            return [...list].sort((a, b) => {
                  const rank = (s: Webinar['status']) =>
                        s === 'ongoing' ? 0 : s === 'scheduled' ? 1 : s === 'completed' ? 2 : 3;
                  const rankDiff = rank(a.status) - rank(b.status);
                  if (rankDiff !== 0) return rankDiff;
                  return new Date(a.scheduleTime).getTime() - new Date(b.scheduleTime).getTime();
            });
      }, [webinars, filter]);

      const handleCta = (webinar: Webinar) => {
            if (onPressWebinar) {
                  onPressWebinar(webinar);
                  return;
            }
            if (webinar.meetingLink) {
                  Linking.openURL(webinar.meetingLink).catch(() => { });
            }
      };

      return (
            <View style={styles.flex}>
                  <FlatList
                        data={filtered}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                              onRefresh ? (
                                    <RefreshControl
                                          refreshing={!!refreshing}
                                          onRefresh={onRefresh}
                                          tintColor={COLORS.gold}
                                          colors={[COLORS.primary]}
                                    />
                              ) : undefined
                        }
                        ListHeaderComponent={
                              <>
                                    <View style={styles.header}>
                                          <SectionBadge label="Live Interactive Sessions" icon="radio-outline" />
                                          <Text style={styles.title}>Fit India Expert Webinars</Text>
                                          <Text style={styles.subtitle}>
                                                Join our certified nutritionists, doctors, and health experts
                                                in live, interactive panel discussions on weight management,
                                                PCOS recovery, mental fitness, and balanced diets.
                                          </Text>
                                    </View>

                                    <WebinarFilterTabs value={filter} onChange={setFilter} counts={counts} />

                                    {loading && (
                                          <View style={styles.loadingRow}>
                                                <ActivityIndicator color={COLORS.gold} />
                                                <Text style={styles.loadingText}>Loading webinars…</Text>
                                          </View>
                                    )}
                              </>
                        }
                        renderItem={({ item }) => (
                              <View style={styles.cardWrap}>
                                    <WebinarCard webinar={item} onPressCta={handleCta} />
                              </View>
                        )}
                        ListEmptyComponent={
                              !loading ? (
                                    <EmptyWebinarState
                                          title={
                                                filter === 'all'
                                                      ? 'No scheduled webinars'
                                                      : `No ${filter} webinars`
                                          }
                                    />
                              ) : null
                        }
                  />
            </View>
      );
};

const styles = StyleSheet.create({
      flex: {
            flex: 1,
            backgroundColor: COLORS.background,
      },
      listContent: {
            paddingBottom: 40,
      },
      header: {
            paddingHorizontal: 20,
            paddingTop: 28,
            paddingBottom: 20,
            alignItems: 'center',
      },
      title: {
            fontSize: 26,
            fontWeight: '800',
            color: COLORS.text,
            textAlign: 'center',
            marginBottom: 10,
      },
      subtitle: {
            fontSize: 13,
            color: COLORS.textSecondary,
            textAlign: 'center',
            lineHeight: 20,
      },
      loadingRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 20,
      },
      loadingText: {
            color: COLORS.textMuted,
            fontSize: 12,
            fontWeight: '600',
            marginLeft: 8,
      },
      cardWrap: {
            paddingHorizontal: 20,
      },

      //webinar filter tabs
      row: {
            paddingHorizontal: 20,
            gap: 8,
      },
      pill: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 9,
            paddingHorizontal: 16,
            borderRadius: 999,
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.border,
      },
      pillActive: {
            backgroundColor: COLORS.primary,
            borderColor: COLORS.primary,
      },
      pillText: {
            fontSize: 12.5,
            fontWeight: '700',
            color: COLORS.textMuted,
      },
      pillTextActive: {
            color: COLORS.text,
      },
      countBubble: {
            marginLeft: 6,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: COLORS.surfaceElevated,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 4,
      },
      countBubbleActive: {
            backgroundColor: 'rgba(255,255,255,0.25)',
      },
      countText: {
            fontSize: 10,
            fontWeight: '800',
            color: COLORS.textMuted,
      },
      countTextActive: {
            color: COLORS.text,
      },

      //Section Badge styles
      badge: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            borderRadius: 999,
            borderWidth: 1,
            borderColor: 'rgba(212, 171, 58, 0.4)',
            backgroundColor: 'rgba(212, 171, 58, 0.12)',
            paddingVertical: 6,
            paddingHorizontal: 14,
            marginBottom: 14,
      },
      icon: {
            marginRight: 6,
      },
      label: {
            fontSize: 11,
            fontWeight: '800',
            letterSpacing: 0.6,
            textTransform: 'uppercase',
            color: COLORS.gold,
      },
});

export default WebinarScreen;