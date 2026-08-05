import React, { useEffect, useRef, useState } from 'react';
import {
      View,
      Text,
      Pressable,
      StyleSheet,
      Animated,
      Platform,
      LayoutChangeEvent,
      Dimensions,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../theme/theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BAR_HORIZONTAL_MARGIN = 16;
const BAR_WIDTH = SCREEN_WIDTH - BAR_HORIZONTAL_MARGIN * 2;

// Maps route name -> Ionicons glyph name (outline for inactive, filled swapped in below)
const ICON_MAP: Record<string, string> = {
      Home: 'home-outline',
      Services: 'grid-outline',
      Webinar: 'videocam-outline',
      Profile: 'person-outline',
};

// Filled variant shown when the tab is focused, for a bit more polish
const ICON_MAP_ACTIVE: Record<string, string> = {
      Home: 'home',
      Services: 'grid',
      Webinar: 'videocam',
      Profile: 'person',
};

interface TabLayout {
      x: number;
      width: number;
}

const CustomTabBar: React.FC<BottomTabBarProps> = ({
      state,
      descriptors,
      navigation,
}) => {
      const [tabLayouts, setTabLayouts] = useState<Record<number, TabLayout>>({});

      const indicatorX = useRef(new Animated.Value(0)).current;
      const indicatorWidth = useRef(new Animated.Value(0)).current;
      const iconScales = useRef(
            state.routes.map(() => new Animated.Value(1))
      ).current;
      const glowOpacity = useRef(new Animated.Value(0)).current;

      const handleTabLayout = (index: number) => (e: LayoutChangeEvent) => {
            const { x, width } = e.nativeEvent.layout;
            setTabLayouts((prev) => ({ ...prev, [index]: { x, width } }));
      };

      useEffect(() => {
            const activeLayout = tabLayouts[state.index];
            if (!activeLayout) return;

            Animated.parallel([
                  Animated.spring(indicatorX, {
                        toValue: activeLayout.x,
                        useNativeDriver: false,
                        friction: 9,
                        tension: 90,
                  }),
                  Animated.spring(indicatorWidth, {
                        toValue: activeLayout.width,
                        useNativeDriver: false,
                        friction: 9,
                        tension: 90,
                  }),
                  Animated.sequence([
                        Animated.timing(glowOpacity, {
                              toValue: 0,
                              duration: 0,
                              useNativeDriver: true,
                        }),
                        Animated.timing(glowOpacity, {
                              toValue: 1,
                              duration: 260,
                              useNativeDriver: true,
                        }),
                  ]),
            ]).start();

            state.routes.forEach((_, i) => {
                  Animated.spring(iconScales[i], {
                        toValue: i === state.index ? 1.16 : 1,
                        useNativeDriver: true,
                        friction: 6,
                        tension: 140,
                  }).start();
            });
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [state.index, tabLayouts]);

      return (
            <View style={styles.wrapper} pointerEvents="box-none">
                  <View style={styles.barShadowContainer}>
                        <View style={styles.bar}>
                              {/* Ambient top hairline glow */}
                              <View style={styles.topHairline} />

                              {/* Sliding gold-rimmed active pill */}
                              {tabLayouts[state.index] && (
                                    <Animated.View
                                          style={[
                                                styles.indicator,
                                                {
                                                      width: indicatorWidth,
                                                      transform: [{ translateX: indicatorX }],
                                                },
                                          ]}
                                    >
                                          <Animated.View
                                                style={[styles.indicatorGlow, { opacity: glowOpacity }]}
                                          />
                                          <View style={styles.indicatorInner} />
                                          <View style={styles.indicatorRim} />
                                    </Animated.View>
                              )}

                              {state.routes.map((route, index) => {
                                    const { options } = descriptors[route.key];
                                    const isFocused = state.index === index;
                                    const iconName = isFocused
                                          ? ICON_MAP_ACTIVE[route.name] ?? 'ellipse'
                                          : ICON_MAP[route.name] ?? 'ellipse-outline';

                                    const label =
                                          (options.tabBarLabel as string) ??
                                          (options.title as string) ??
                                          route.name;

                                    const onPress = () => {
                                          const event = navigation.emit({
                                                type: 'tabPress',
                                                target: route.key,
                                                canPreventDefault: true,
                                          });

                                          if (!isFocused && !event.defaultPrevented) {
                                                navigation.navigate(route.name);
                                          }
                                    };

                                    const onLongPress = () => {
                                          navigation.emit({
                                                type: 'tabLongPress',
                                                target: route.key,
                                          });
                                    };

                                    return (
                                          <Pressable
                                                key={route.key}
                                                accessibilityRole="button"
                                                accessibilityState={isFocused ? { selected: true } : {}}
                                                onPress={onPress}
                                                onLongPress={onLongPress}
                                                onLayout={handleTabLayout(index)}
                                                style={styles.tab}
                                                hitSlop={8}
                                          >
                                                <Animated.View
                                                      style={[
                                                            styles.iconWrap,
                                                            { transform: [{ scale: iconScales[index] }] },
                                                      ]}
                                                >
                                                      {isFocused && <View style={styles.activeIconHalo} />}
                                                      <Ionicons
                                                            name={iconName}
                                                            size={22}
                                                            color={isFocused ? COLORS.text : COLORS.textMuted}
                                                            style={isFocused ? styles.iconActiveShadow : undefined}
                                                      />
                                                </Animated.View>

                                                <Text
                                                      numberOfLines={1}
                                                      style={[
                                                            styles.label,
                                                            {
                                                                  color: isFocused ? COLORS.gold : 'transparent',
                                                                  opacity: isFocused ? 1 : 0,
                                                            },
                                                      ]}
                                                >
                                                      {label}
                                                </Text>

                                                {isFocused && <View style={styles.activeDot} />}
                                          </Pressable>
                                    );
                              })}
                        </View>
                  </View>
            </View>
      );
};

const styles = StyleSheet.create({
      wrapper: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: 'center',
      },
      barShadowContainer: {
            marginBottom: Platform.select({ ios: 28, android: 18, default: 18 }),
            borderRadius: 32,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.45,
            shadowRadius: 24,
            elevation: 20,
      },
      bar: {
            width: BAR_WIDTH,
            height: 72,
            borderRadius: 32,
            backgroundColor: COLORS.surfaceElevated,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
            borderWidth: 1,
            borderColor: COLORS.border,
            overflow: 'hidden',
      },
      topHairline: {
            position: 'absolute',
            top: 0,
            left: 20,
            right: 20,
            height: 1,
            backgroundColor: 'rgba(212, 171, 58, 0.25)',
      },
      tab: {
            flex: 1,
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
      },
      iconWrap: {
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
      },
      activeIconHalo: {
            position: 'absolute',
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: 'rgba(212, 171, 58, 0.18)',
      },
      iconActiveShadow: {
            textShadowColor: COLORS.gold,
            textShadowOffset: { width: 0, height: 0 },
            textShadowRadius: 8,
      },
      label: {
            fontSize: 10,
            fontWeight: '700',
            letterSpacing: 0.4,
            marginTop: 4,
      },
      activeDot: {
            position: 'absolute',
            bottom: 6,
            width: 4,
            height: 4,
            borderRadius: 2,
            backgroundColor: COLORS.gold,
      },
      indicator: {
            position: 'absolute',
            top: 8,
            height: 56,
            borderRadius: 24,
            zIndex: 1,
            alignItems: 'center',
            justifyContent: 'center',
      },
      indicatorGlow: {
            ...StyleSheet.absoluteFill,
            borderRadius: 24,
            backgroundColor: COLORS.primary,
            shadowColor: COLORS.gold,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.9,
            shadowRadius: 16,
      },
      indicatorInner: {
            ...StyleSheet.absoluteFill,
            borderRadius: 24,
            backgroundColor: COLORS.primary,
      },
      indicatorRim: {
            ...StyleSheet.absoluteFill,
            borderRadius: 24,
            borderWidth: 1.5,
            borderColor: 'rgba(230, 201, 108, 0.55)',
      },
});

export default CustomTabBar;