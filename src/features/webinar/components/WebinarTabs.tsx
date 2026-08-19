import React, { useEffect, useRef, useState } from 'react';
import {
      View,
      Text,
      Pressable,
      Animated,
      LayoutChangeEvent,
      StyleSheet,
} from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../../theme/theme';

export type WebinarTabKey = 'live' | 'zoom' | 'recorded';

export interface WebinarTabOption {
      key: WebinarTabKey;
      label: string;
      icon: string;
}

const TABS: WebinarTabOption[] = [
      { key: 'live', label: 'Live Webinars', icon: 'radio-outline' },
      { key: 'zoom', label: 'Zoom Meetings', icon: 'videocam-outline' },
      { key: 'recorded', label: 'Recorded Meetings', icon: 'play-circle-outline' },
];

interface WebinarTabsProps {
      value: WebinarTabKey;
      onChange: (tab: WebinarTabKey) => void;
}

interface TabLayout {
      x: number;
      width: number;
}

const WebinarTabs: React.FC<WebinarTabsProps> = ({ value, onChange }) => {
      const [layouts, setLayouts] = useState<Record<WebinarTabKey, TabLayout>>({} as any);
      const indicatorX = useRef(new Animated.Value(0)).current;
      const indicatorWidth = useRef(new Animated.Value(0)).current;
      const pulse = useRef(new Animated.Value(1)).current;

      const handleLayout = (key: WebinarTabKey) => (e: LayoutChangeEvent) => {
            const { x, width } = e.nativeEvent.layout;
            setLayouts((prev) => ({ ...prev, [key]: { x, width } }));
      };

      useEffect(() => {
            const target = layouts[value];
            if (!target) return;
            Animated.parallel([
                  Animated.spring(indicatorX, {
                        toValue: target.x,
                        useNativeDriver: false,
                        friction: 9,
                        tension: 90,
                  }),
                  Animated.spring(indicatorWidth, {
                        toValue: target.width,
                        useNativeDriver: false,
                        friction: 9,
                        tension: 90,
                  }),
            ]).start();
      }, [value, layouts, indicatorX, indicatorWidth]);

      // Pulsing live dot, only relevant while the Live tab exists in the bar.
      useEffect(() => {
            const loop = Animated.loop(
                  Animated.sequence([
                        Animated.timing(pulse, { toValue: 0.35, duration: 650, useNativeDriver: true }),
                        Animated.timing(pulse, { toValue: 1, duration: 650, useNativeDriver: true }),
                  ]),
            );
            loop.start();
            return () => loop.stop();
      }, [pulse]);

      return (
            <View style={styles.wrap}>
                  <View style={styles.track}>
                        {layouts[value] && (
                              <Animated.View
                                    style={[
                                          styles.indicator,
                                          {
                                                width: indicatorWidth,
                                                transform: [{ translateX: indicatorX }],
                                          },
                                    ]}
                              >
                                    <LinearGradient
                                          colors={[COLORS.gradientStart, COLORS.primaryDark]}
                                          start={{ x: 0, y: 0 }}
                                          end={{ x: 1, y: 0 }}
                                          style={styles.indicatorFill}
                                    />
                              </Animated.View>
                        )}

                        {TABS.map((tab) => {
                              const isActive = tab.key === value;
                              return (
                                    <Pressable
                                          key={tab.key}
                                          onLayout={handleLayout(tab.key)}
                                          onPress={() => onChange(tab.key)}
                                          style={styles.tab}
                                    >
                                          {tab.key === 'live' && isActive && (
                                                <Animated.View style={[styles.liveDot, { opacity: pulse }]} />
                                          )}
                                          <Icon
                                                name={tab.icon}
                                                size={15}
                                                color={isActive ? COLORS.text : COLORS.textMuted}
                                                style={styles.tabIcon}
                                          />
                                          <Text
                                                style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                                                numberOfLines={1}
                                          >
                                                {tab.label}
                                          </Text>
                                    </Pressable>
                              );
                        })}
                  </View>
            </View>
      );
};

const styles = StyleSheet.create({
      wrap: {
            paddingHorizontal: SPACING.md,
            paddingTop: SPACING.md,
            paddingBottom: SPACING.sm + 2,
            backgroundColor: COLORS.background,
      },
      track: {
            flexDirection: 'row',
            backgroundColor: COLORS.surface,
            borderRadius: RADII.full,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 4,
            height: 52,
      },
      indicator: {
            position: 'absolute',
            top: 4,
            bottom: 4,
            borderRadius: RADII.full,
            overflow: 'hidden',
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 6,
      },
      indicatorFill: {
            flex: 1,
      },
      tab: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
      },
      liveDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: COLORS.error,
            marginRight: 5,
      },
      tabIcon: {
            marginRight: 5,
      },
      tabLabel: {
            fontSize: 11.5,
            fontWeight: TYPOGRAPHY.bold,
            color: COLORS.textMuted,
      },
      tabLabelActive: {
            color: COLORS.text,
            fontWeight: TYPOGRAPHY.extraBold,
      },
});

export default WebinarTabs;