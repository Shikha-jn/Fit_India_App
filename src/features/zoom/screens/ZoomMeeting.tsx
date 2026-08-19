import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, View, StyleSheet, StatusBar, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { COLORS, SPACING, TYPOGRAPHY, RADII } from '../../../theme/theme';
import { zoomMeeting } from '../types/zoomMetting';
import { getMeetingStatus } from '../utils/ZoomMeetingUtils';
import ZoomMeetingCard from '../components/ZoomCard';
import { liveZoomLinks } from '../../../services/webinar.service';

const EmptyMeetingsState: React.FC = () => (
      <View style={styles.container}>
            <View style={styles.iconCircle}>
                  <Icon name="videocam-outline" size={30} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptitle}>No sessions scheduled</Text>
            <Text style={styles.message}>
                  Your daily Zoom training links will appear here once scheduled.
            </Text>
      </View>
);

const ZoomSessionsHeader: React.FC = () => (
      <View style={styles.card}>
            <Text style={styles.title}>Daily Live Zoom Sessions</Text>
            <Text style={styles.subtitle}>
                  Access your daily training links here. Join the class at the
                  scheduled session start time.
            </Text>
      </View>
);

interface ZoomMeetingScreenProps {
      // meetings: zoomMeeting[];
}

const ZoomMeetingScreen: React.FC<ZoomMeetingScreenProps> = ({ }) => {
      const [meetings, setmeetings] = useState<zoomMeeting[]>([]);

      useEffect(() => {
            fetchZoomMeetings();
      }, []);
      const fetchZoomMeetings = async () => {
            const response = await liveZoomLinks();
            setmeetings(response.data);
      }
      const sorted = useMemo(() => {
            const rank = (m: zoomMeeting) => {
                  const status = getMeetingStatus(m.startTime);
                  return status === 'live' ? 0 : status === 'scheduled' ? 1 : 2;
            };
            return [...meetings].sort((a, b) => {
                  const rankDiff = rank(a) - rank(b);
                  if (rankDiff !== 0) return rankDiff;
                  return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
            });
      }, [meetings]);

      return (
            <View style={styles.flex}>
                  <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
                  <FlatList
                        data={sorted}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={<ZoomSessionsHeader />}
                        renderItem={({ item }) => <ZoomMeetingCard meeting={item} />}
                        ListEmptyComponent={<EmptyMeetingsState />}
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
      card: {
            backgroundColor: COLORS.surface,
            borderRadius: RADII.xl,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: SPACING.lg - 4,
            marginHorizontal: SPACING.md,
            marginTop: SPACING.md,
            marginBottom: SPACING.md,
      },
      title: {
            fontSize: 20,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
            marginBottom: SPACING.sm,
      },
      subtitle: {
            fontSize: 13,
            color: COLORS.textMuted,
            lineHeight: 19,
      },
      container: {
            marginHorizontal: SPACING.md,
            borderRadius: RADII.xl,
            borderWidth: 1.5,
            borderStyle: 'dashed',
            borderColor: COLORS.border,
            paddingVertical: SPACING.xxl - SPACING.xs,
            paddingHorizontal: SPACING.lg,
            alignItems: 'center',
      },
      iconCircle: {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: COLORS.surfaceElevated,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: SPACING.md,
      },
      emptitle: {
            fontSize: 15,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
            marginBottom: SPACING.sm,
      },
      message: {
            fontSize: 12.5,
            color: COLORS.textMuted,
            textAlign: 'center',
            lineHeight: 19,
      },
});

export default ZoomMeetingScreen;