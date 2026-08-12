import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../theme/theme';
import { useAuthStore } from '../store/useAuthStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/RootStackParamList';

type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'Splash'>;

/** Minimum time the splash stays visible, so the animation never feels cut off. */
const MIN_DISPLAY_MS = 2200;

const SplashScreen = ({ navigation }: SplashScreenProps) => {
      const loadAuth = useAuthStore((s) => s.loadAuth);
      const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
      const loggedInRole = useAuthStore((s) => s.loggedInRole);
      const authLoaded = useAuthStore((s) => s.loadAuth);

      // Entrance animations
      const logoScale = useRef(new Animated.Value(0.6)).current;
      const logoOpacity = useRef(new Animated.Value(0)).current;
      const textOpacity = useRef(new Animated.Value(0)).current;
      const textTranslateY = useRef(new Animated.Value(12)).current;
      const taglineOpacity = useRef(new Animated.Value(0)).current;

      // Looping animations
      const ringScale1 = useRef(new Animated.Value(1)).current;
      const ringOpacity1 = useRef(new Animated.Value(0.5)).current;
      const ringScale2 = useRef(new Animated.Value(1)).current;
      const ringOpacity2 = useRef(new Animated.Value(0.35)).current;
      const breathe = useRef(new Animated.Value(1)).current;
      const dotAnims = useRef([
            new Animated.Value(0.3),
            new Animated.Value(0.3),
            new Animated.Value(0.3),
      ]).current;

      useEffect(() => {
            // Entrance sequence
            Animated.sequence([
                  Animated.parallel([
                        Animated.spring(logoScale, {
                              toValue: 1,
                              friction: 6,
                              tension: 60,
                              useNativeDriver: true,
                        }),
                        Animated.timing(logoOpacity, {
                              toValue: 1,
                              duration: 500,
                              useNativeDriver: true,
                        }),
                  ]),
                  Animated.parallel([
                        Animated.timing(textOpacity, {
                              toValue: 1,
                              duration: 450,
                              useNativeDriver: true,
                        }),
                        Animated.timing(textTranslateY, {
                              toValue: 0,
                              duration: 450,
                              easing: Easing.out(Easing.cubic),
                              useNativeDriver: true,
                        }),
                  ]),
                  Animated.timing(taglineOpacity, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                  }),
            ]).start();

            // Pulsing glow rings (staggered, looping)
            const buildRingLoop = (scaleAnim: Animated.Value, opacityAnim: Animated.Value, delay: number) =>
                  Animated.loop(
                        Animated.sequence([
                              Animated.delay(delay),
                              Animated.parallel([
                                    Animated.timing(scaleAnim, {
                                          toValue: 1.9,
                                          duration: 1800,
                                          easing: Easing.out(Easing.ease),
                                          useNativeDriver: true,
                                    }),
                                    Animated.timing(opacityAnim, {
                                          toValue: 0,
                                          duration: 1800,
                                          easing: Easing.out(Easing.ease),
                                          useNativeDriver: true,
                                    }),
                              ]),
                              Animated.timing(scaleAnim, { toValue: 1, duration: 0, useNativeDriver: true }),
                              Animated.timing(opacityAnim, { toValue: 0.5, duration: 0, useNativeDriver: true }),
                        ]),
                  );

            buildRingLoop(ringScale1, ringOpacity1, 0).start();
            buildRingLoop(ringScale2, ringOpacity2, 900).start();

            // Gentle breathing scale on the logo badge
            Animated.loop(
                  Animated.sequence([
                        Animated.timing(breathe, {
                              toValue: 1.05,
                              duration: 1400,
                              easing: Easing.inOut(Easing.ease),
                              useNativeDriver: true,
                        }),
                        Animated.timing(breathe, {
                              toValue: 1,
                              duration: 1400,
                              easing: Easing.inOut(Easing.ease),
                              useNativeDriver: true,
                        }),
                  ]),
            ).start();

            // Sequential loading dots
            const dotLoop = Animated.loop(
                  Animated.stagger(
                        180,
                        dotAnims.map((anim) =>
                              Animated.sequence([
                                    Animated.timing(anim, {
                                          toValue: 1,
                                          duration: 350,
                                          useNativeDriver: true,
                                    }),
                                    Animated.timing(anim, {
                                          toValue: 0.3,
                                          duration: 350,
                                          useNativeDriver: true,
                                    }),
                              ]),
                        ),
                  ),
            );
            dotLoop.start();

            return () => {
                  dotLoop.stop();
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      const startedAtRef = useRef(Date.now());

      // Kick off the auth check once, on mount.
      useEffect(() => {
            loadAuth();
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, []);

      // Once auth has resolved, navigate — but never before MIN_DISPLAY_MS has
      // elapsed, so the entrance animation always gets to play out.
      useEffect(() => {
            if (!authLoaded) return;

            const elapsed = Date.now() - startedAtRef.current;
            const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
            const timeout = setTimeout(navigateOnward, remaining);

            return () => clearTimeout(timeout);
            // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [authLoaded]);

      const navigateOnward = () => {
            if (!isAuthenticated) {
                  // navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
                  navigation.replace('MainTab', { screen: 'Home' });
                  return;
            }

            if (loggedInRole === 'trainer') {
                  // navigation.reset({ index: 0, routes: [{ name: 'TrainerDashboard' }] });
                  navigation.replace('TrainerTab', { screen: 'Dashboard' });
            } else {
                  // Default to the client dashboard for 'client' (and any other
                  // authenticated role that doesn't have a dedicated screen yet).
                  // navigation.reset({ index: 0, routes: [{ name: 'ClientDashboard' }] });
                  navigation.replace('UserTab', { screen: 'Dashboard' });
            }
      };

      return (
            <LinearGradient
                  colors={[COLORS.background, COLORS.backgroundSecondary, COLORS.background]}
                  style={styles.container}
            >
                  <View style={styles.center}>
                        <View style={styles.logoStage}>
                              <Animated.View
                                    style={[
                                          styles.ring,
                                          {
                                                opacity: ringOpacity1,
                                                transform: [{ scale: ringScale1 }],
                                          },
                                    ]}
                              />
                              <Animated.View
                                    style={[
                                          styles.ring,
                                          styles.ringGold,
                                          {
                                                opacity: ringOpacity2,
                                                transform: [{ scale: ringScale2 }],
                                          },
                                    ]}
                              />

                              <Animated.View
                                    style={[
                                          styles.logoBadge,
                                          {
                                                opacity: logoOpacity,
                                                transform: [
                                                      { scale: Animated.multiply(logoScale, breathe) },
                                                ],
                                          },
                                    ]}
                              >
                                    <LinearGradient
                                          colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                                          start={{ x: 0, y: 0 }}
                                          end={{ x: 1, y: 1 }}
                                          style={styles.logoBadgeFill}
                                    >
                                          <Icon name="pulse" size={38} color={COLORS.text} />
                                    </LinearGradient>
                              </Animated.View>
                        </View>

                        <Animated.Text
                              style={[
                                    styles.appName,
                                    {
                                          opacity: textOpacity,
                                          transform: [{ translateY: textTranslateY }],
                                    },
                              ]}
                        >
                              FIT INDIA WOMEN
                        </Animated.Text>

                        <Animated.Text style={[styles.tagline, { opacity: taglineOpacity }]}>
                              Healthy · Confident · Unstoppable
                        </Animated.Text>
                  </View>

                  <View style={styles.footer}>
                        <View style={styles.dotsRow}>
                              {dotAnims.map((anim, index) => (
                                    <Animated.View
                                          key={index}
                                          style={[
                                                styles.dot,
                                                {
                                                      opacity: anim,
                                                      transform: [
                                                            {
                                                                  scale: anim.interpolate({
                                                                        inputRange: [0.3, 1],
                                                                        outputRange: [0.8, 1.15],
                                                                  }),
                                                            },
                                                      ],
                                                },
                                          ]}
                                    />
                              ))}
                        </View>
                        <Text style={styles.footerText}>Preparing your wellness space</Text>
                  </View>
            </LinearGradient>
      );
};

const RING_SIZE = 128;

const styles = StyleSheet.create({
      container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
      },
      center: {
            alignItems: 'center',
      },
      logoStage: {
            width: RING_SIZE,
            height: RING_SIZE,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: SPACING.xl,
      },
      ring: {
            position: 'absolute',
            width: RING_SIZE,
            height: RING_SIZE,
            borderRadius: RING_SIZE / 2,
            borderWidth: 1.5,
            borderColor: 'rgba(198, 53, 115, 0.5)',
      },
      ringGold: {
            borderColor: 'rgba(212, 171, 58, 0.45)',
      },
      logoBadge: {
            width: 84,
            height: 84,
            borderRadius: RADII.xl,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.5,
            shadowRadius: 22,
            elevation: 14,
      },
      logoBadgeFill: {
            flex: 1,
            borderRadius: RADII.xl,
            alignItems: 'center',
            justifyContent: 'center',
      },
      appName: {
            fontSize: 20,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
            letterSpacing: 3,
            marginBottom: SPACING.sm,
      },
      tagline: {
            fontSize: 12,
            fontWeight: TYPOGRAPHY.semiBold,
            color: COLORS.gold,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
      },
      footer: {
            position: 'absolute',
            bottom: SPACING.xxl,
            alignItems: 'center',
      },
      dotsRow: {
            flexDirection: 'row',
            marginBottom: SPACING.sm + 2,
      },
      dot: {
            width: 7,
            height: 7,
            borderRadius: 3.5,
            backgroundColor: COLORS.primaryLight,
            marginHorizontal: 4,
      },
      footerText: {
            fontSize: 11,
            color: COLORS.textMuted,
            fontWeight: TYPOGRAPHY.medium,
            letterSpacing: 0.3,
      },
});

export default SplashScreen;