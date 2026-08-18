import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../theme/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Types ────────────────────────────────────────────────────────────────────
export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'confirm';

export interface AlertButton {
    label: string;
    onPress: () => void;
    style?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

export interface CustomAlertProps {
    visible: boolean;
    type?: AlertType;
    title: string;
    message?: string;
    buttons?: AlertButton[];
    onDismiss?: () => void;
    dismissable?: boolean;
}

// ─── Type config ──────────────────────────────────────────────────────────────
const TYPE_CONFIG: Record<
    AlertType,
    {
        icon: string;
        iconColor: string;
        gradientColors: string[];
        ringColor: string;
    }
> = {
    success: {
        icon: 'checkmark-circle',
        iconColor: COLORS.success,
        gradientColors: [COLORS.success + '26', COLORS.success + '0D'],
        ringColor: COLORS.success + '4D',
    },
    error: {
        icon: 'close-circle',
        iconColor: COLORS.error,
        gradientColors: [COLORS.error + '26', COLORS.error + '0D'],
        ringColor: COLORS.error + '4D',
    },
    warning: {
        icon: 'warning',
        iconColor: COLORS.warning,
        gradientColors: [COLORS.warning + '26', COLORS.warning + '0D'],
        ringColor: COLORS.warning + '4D',
    },
    info: {
        icon: 'information-circle',
        iconColor: COLORS.info,
        gradientColors: [COLORS.info + '26', COLORS.info + '0D'],
        ringColor: COLORS.info + '4D',
    },
    confirm: {
        icon: 'help-circle',
        iconColor: COLORS.goldLight,
        gradientColors: [COLORS.gold + '26', COLORS.primary + '14'],
        ringColor: COLORS.gold + '4D',
    },
};

const BUTTON_STYLES: Record<
    string,
    {
        bg: string[];
        text: string;
        border: string;
    }
> = {
    primary: {
        bg: [COLORS.primaryLight, COLORS.primary],
        text: COLORS.text,
        border: 'transparent',
    },
    secondary: {
        bg: [COLORS.goldLight, COLORS.gold],
        text: COLORS.backgroundSecondary,
        border: 'transparent',
    },
    danger: {
        bg: [COLORS.error + '26', COLORS.error + '14'],
        text: COLORS.error,
        border: COLORS.error + '4D',
    },
    ghost: {
        bg: [COLORS.surfaceElevated, COLORS.surface],
        text: COLORS.textSecondary,
        border: COLORS.border,
    },
};

// ─── Floating particle component ──────────────────────────────────────────────
const FloatingParticle: React.FC<{
    delay: number;
    left: `${number}%`;
    top: `${number}%`;
    size: number;
}> = ({ delay, left, top, size }) => {
    const anim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.delay(delay),
                Animated.timing(anim, {
                    toValue: 1,
                    duration: 2500,
                    useNativeDriver: true,
                }),
                Animated.timing(anim, {
                    toValue: 0,
                    duration: 2500,
                    useNativeDriver: true,
                }),
            ]),
        ).start();
    }, []);

    const translateY = anim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -12],
    });

    const opacity = anim.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0.15, 0.4, 0.15],
    });

    return (
        <Animated.View
            style={[
                styles.particle,
                {
                    left,
                    top,
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    opacity,
                    transform: [{ translateY }],
                },
            ]}
        />
    );
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function CustomAlert({
    visible,
    type = 'info',
    title,
    message,
    buttons = [{ label: 'OK', onPress: () => { }, style: 'primary' }],
    onDismiss,
    dismissable = true,
}: CustomAlertProps) {
    const backdropOpacity = useRef(new Animated.Value(0)).current;
    const cardScale = useRef(new Animated.Value(0.85)).current;
    const cardOpacity = useRef(new Animated.Value(0)).current;
    const cardY = useRef(new Animated.Value(20)).current;
    const iconScale = useRef(new Animated.Value(0)).current;
    const ring1Scale = useRef(new Animated.Value(0.7)).current;
    const ring2Scale = useRef(new Animated.Value(0.7)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (visible) {
            // Backdrop in
            Animated.timing(backdropOpacity, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }).start();

            // Card entrance
            Animated.parallel([
                Animated.spring(cardScale, {
                    toValue: 1,
                    tension: 65,
                    friction: 8,
                    useNativeDriver: true,
                }),
                Animated.timing(cardOpacity, {
                    toValue: 1,
                    duration: 220,
                    useNativeDriver: true,
                }),
                Animated.spring(cardY, {
                    toValue: 0,
                    tension: 65,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();

            // Icon sequence: rings then icon
            Animated.sequence([
                Animated.delay(150),
                Animated.parallel([
                    Animated.spring(ring1Scale, {
                        toValue: 1,
                        tension: 70,
                        friction: 7,
                        useNativeDriver: true,
                    }),
                    Animated.spring(ring2Scale, {
                        toValue: 1,
                        tension: 80,
                        friction: 6,
                        useNativeDriver: true,
                    }),
                ]),
                Animated.spring(iconScale, {
                    toValue: 1,
                    tension: 90,
                    friction: 5,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                // Start pulse after entrance
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(pulseAnim, {
                            toValue: 1.06,
                            duration: 1400,
                            useNativeDriver: true,
                        }),
                        Animated.timing(pulseAnim, {
                            toValue: 1,
                            duration: 1400,
                            useNativeDriver: true,
                        }),
                    ]),
                ).start();
            });
        } else {
            Animated.parallel([
                Animated.timing(backdropOpacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(cardOpacity, {
                    toValue: 0,
                    duration: 180,
                    useNativeDriver: true,
                }),
                Animated.timing(cardScale, {
                    toValue: 0.9,
                    duration: 180,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                cardScale.setValue(0.85);
                cardY.setValue(20);
                iconScale.setValue(0);
                ring1Scale.setValue(0.7);
                ring2Scale.setValue(0.7);
                pulseAnim.setValue(1);
            });
        }
    }, [visible]);

    const cfg = TYPE_CONFIG[type];

    // Particles positions
    const particles: Array<{
        left: `${number}%`;
        top: `${number}%`;
        size: number;
        delay: number;
    }> = [
            { left: '8%', top: '15%', size: 4, delay: 0 },
            { left: '85%', top: '12%', size: 3, delay: 400 },
            { left: '15%', top: '75%', size: 5, delay: 800 },
            { left: '88%', top: '70%', size: 4, delay: 200 },
        ];

    return (
        <Modal transparent visible={visible} animationType="none" statusBarTranslucent>
            {/* ── Backdrop ── */}
            <Animated.View
                style={[styles.backdrop, { opacity: backdropOpacity }]}
                onTouchEnd={dismissable ? onDismiss : undefined}
            />

            {/* ── Card ── */}
            <View style={styles.centerer} pointerEvents="box-none">
                <Animated.View
                    style={[
                        styles.card,
                        {
                            opacity: cardOpacity,
                            transform: [{ scale: cardScale }, { translateY: cardY }],
                        },
                    ]}
                >
                    <LinearGradient
                        colors={[COLORS.surfaceElevated, COLORS.surface]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.cardGradient}
                    >
                        {/* Floating particles */}
                        {particles.map((p, i) => (
                            <FloatingParticle key={i} {...p} />
                        ))}

                        {/* Top gradient accent */}
                        <LinearGradient
                            colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.topAccent}
                        />

                        {/* Icon container with rings */}
                        <View style={styles.iconContainer}>
                            {/* Outer ring */}
                            <Animated.View
                                style={[
                                    styles.iconRing1,
                                    {
                                        borderColor: cfg.ringColor,
                                        transform: [{ scale: ring1Scale }],
                                    },
                                ]}
                            />

                            {/* Inner ring */}
                            <Animated.View
                                style={[
                                    styles.iconRing2,
                                    {
                                        borderColor: cfg.ringColor,
                                        transform: [{ scale: ring2Scale }],
                                    },
                                ]}
                            />

                            {/* Icon background with gradient */}
                            <Animated.View
                                style={{
                                    transform: [{ scale: iconScale }, { scale: pulseAnim }],
                                }}
                            >
                                <LinearGradient
                                    colors={cfg.gradientColors}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={styles.iconWrap}
                                >
                                    <Ionicons
                                        name={cfg.icon as any}
                                        size={38}
                                        color={cfg.iconColor}
                                    />
                                </LinearGradient>
                            </Animated.View>
                        </View>

                        {/* Text */}
                        <Text style={styles.title}>{title}</Text>
                        {message ? <Text style={styles.message}>{message}</Text> : null}

                        {/* Decorative divider */}
                        <View style={styles.dividerContainer}>
                            <View style={styles.dividerDot} />
                            <View style={styles.divider} />
                            <View style={styles.dividerDot} />
                        </View>

                        {/* Buttons */}
                        <View
                            style={[
                                styles.buttonsRow,
                                buttons.length === 1 && styles.buttonsSingle,
                            ]}
                        >
                            {buttons.map((btn, i) => {
                                const bStyle = BUTTON_STYLES[btn.style ?? 'primary'];

                                return (
                                    <TouchableOpacity
                                        key={i}
                                        style={[
                                            styles.btnContainer,
                                            buttons.length === 1 && styles.btnFull,
                                        ]}
                                        onPress={btn.onPress}
                                        activeOpacity={0.85}
                                    >
                                        <LinearGradient
                                            colors={bStyle.bg}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={[
                                                styles.btn,
                                                {
                                                    borderColor: bStyle.border,
                                                    borderWidth:
                                                        bStyle.border !== 'transparent' ? 1.5 : 0,
                                                },
                                            ]}
                                        >
                                            <Text style={[styles.btnText, { color: bStyle.text }]}>
                                                {btn.label}
                                            </Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </LinearGradient>
                </Animated.View>
            </View>
        </Modal>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    backdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: COLORS.overlay,
    },
    centerer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.lg,
    },
    card: {
        width: '100%',
        borderRadius: RADII.xl,
        overflow: 'hidden',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.5,
        shadowRadius: 35,
        elevation: 18,
    },
    cardGradient: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADII.xl,
    },
    particle: {
        position: 'absolute',
        backgroundColor: COLORS.gold,
    },
    topAccent: {
        width: '100%',
        height: 4,
        marginBottom: SPACING.xl,
    },
    iconContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md + 4,
        height: 90,
    },
    iconRing1: {
        position: 'absolute',
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 1.5,
    },
    iconRing2: {
        position: 'absolute',
        width: 76,
        height: 76,
        borderRadius: 38,
        borderWidth: 1.5,
    },
    iconWrap: {
        width: 68,
        height: 68,
        borderRadius: RADII.lg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.border,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: TYPOGRAPHY.extraBold,
        color: COLORS.text,
        textAlign: 'center',
        letterSpacing: -0.2,
        paddingHorizontal: SPACING.lg,
        marginBottom: SPACING.sm,
    },
    message: {
        fontSize: 14,
        color: COLORS.textMuted,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: SPACING.lg + 4,
        fontWeight: TYPOGRAPHY.regular,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.lg,
        marginBottom: SPACING.md + 4,
        gap: SPACING.sm,
    },
    divider: {
        width: 50,
        height: 1.5,
        backgroundColor: COLORS.divider,
    },
    dividerDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: COLORS.gold,
    },
    buttonsRow: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.md + 4,
        gap: SPACING.sm + 2,
        width: '100%',
    },
    buttonsSingle: {
        justifyContent: 'center',
    },
    btnContainer: {
        flex: 1,
    },
    btn: {
        paddingVertical: 15,
        borderRadius: RADII.md + 2,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnFull: {
        flex: 1,
    },
    btnText: {
        fontSize: 15,
        fontWeight: TYPOGRAPHY.bold,
        letterSpacing: 0.3,
        textTransform: 'uppercase',
    },
});

// ─── Usage Example ────────────────────────────────────────────────────────────
import { useState } from 'react';

export function AlertDemo() {
    const [alert, setAlert] = useState<{
        visible: boolean;
        type: AlertType;
        title: string;
        message: string;
        buttons: AlertButton[];
    }>({
        visible: false,
        type: 'info',
        title: '',
        message: '',
        buttons: [],
    });

    const show = (type: AlertType, title: string, message: string, buttons: AlertButton[]) =>
        setAlert({ visible: true, type, title, message, buttons });

    const hide = () => setAlert(prev => ({ ...prev, visible: false }));

    return (
        <View style={demoStyles.container}>
            <LinearGradient
                colors={[COLORS.gradientStart, COLORS.gradientMid, COLORS.gradientEnd]}
                start={{ x: 0.1, y: 0 }}
                end={{ x: 0.9, y: 1 }}
                style={demoStyles.header}
            >
                <Text style={demoStyles.eyebrow}>FIT INDIA UI</Text>
                <Text style={demoStyles.heading}>Alert System</Text>
                <Text style={demoStyles.subheading}>Health-grade notifications</Text>
            </LinearGradient>

            <View style={demoStyles.grid}>
                {/* Success */}
                <TouchableOpacity
                    style={demoStyles.tile}
                    onPress={() =>
                        show(
                            'success',
                            'Appointment Confirmed',
                            'Your home healthcare visit is scheduled for March 15th at 10:00 AM.',
                            [
                                { label: 'View Details', onPress: hide, style: 'secondary' },
                                { label: 'Done', onPress: hide, style: 'primary' },
                            ],
                        )
                    }
                >
                    <LinearGradient
                        colors={[COLORS.success + '26', COLORS.success + '0D']}
                        style={demoStyles.tileGradient}
                    >
                        <Ionicons name="checkmark-circle" size={32} color={COLORS.success} />
                        <Text style={[demoStyles.tileLabel, { color: COLORS.success }]}>
                            Success
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Error */}
                <TouchableOpacity
                    style={demoStyles.tile}
                    onPress={() =>
                        show(
                            'error',
                            'Booking Failed',
                            'Unable to process your request. Please check your connection and try again.',
                            [
                                { label: 'Retry', onPress: hide, style: 'primary' },
                                { label: 'Cancel', onPress: hide, style: 'ghost' },
                            ],
                        )
                    }
                >
                    <LinearGradient
                        colors={[COLORS.error + '26', COLORS.error + '0D']}
                        style={demoStyles.tileGradient}
                    >
                        <Ionicons name="close-circle" size={32} color={COLORS.error} />
                        <Text style={[demoStyles.tileLabel, { color: COLORS.error }]}>Error</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Warning */}
                <TouchableOpacity
                    style={demoStyles.tile}
                    onPress={() =>
                        show(
                            'warning',
                            'Limited Availability',
                            'Only 2 time slots remaining for consultation this week. Book soon!',
                            [
                                { label: 'Book Now', onPress: hide, style: 'primary' },
                                { label: 'Later', onPress: hide, style: 'ghost' },
                            ],
                        )
                    }
                >
                    <LinearGradient
                        colors={[COLORS.warning + '26', COLORS.warning + '0D']}
                        style={demoStyles.tileGradient}
                    >
                        <Ionicons name="warning" size={32} color={COLORS.warning} />
                        <Text style={[demoStyles.tileLabel, { color: COLORS.warning }]}>
                            Warning
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Info */}
                <TouchableOpacity
                    style={demoStyles.tile}
                    onPress={() =>
                        show(
                            'info',
                            'Service Update',
                            'Our home injection service now includes vitamin B12 and COVID-19 vaccinations.',
                            [{ label: 'Got it', onPress: hide, style: 'primary' }],
                        )
                    }
                >
                    <LinearGradient
                        colors={[COLORS.info + '26', COLORS.info + '0D']}
                        style={demoStyles.tileGradient}
                    >
                        <Ionicons name="information-circle" size={32} color={COLORS.info} />
                        <Text style={[demoStyles.tileLabel, { color: COLORS.info }]}>Info</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Confirm */}
                <TouchableOpacity
                    style={[demoStyles.tile, demoStyles.tileWide]}
                    onPress={() =>
                        show(
                            'confirm',
                            'Cancel Appointment?',
                            'Are you sure you want to cancel your scheduled home visit? This cannot be undone.',
                            [
                                { label: 'Keep', onPress: hide, style: 'secondary' },
                                { label: 'Cancel', onPress: hide, style: 'danger' },
                            ],
                        )
                    }
                >
                    <LinearGradient
                        colors={[COLORS.gold + '26', COLORS.primary + '14']}
                        style={demoStyles.tileGradient}
                    >
                        <Ionicons name="help-circle" size={32} color={COLORS.goldLight} />
                        <Text style={[demoStyles.tileLabel, { color: COLORS.goldLight }]}>
                            Confirm
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <CustomAlert
                visible={alert.visible}
                type={alert.type}
                title={alert.title}
                message={alert.message}
                buttons={alert.buttons}
                onDismiss={hide}
            />
        </View>
    );
}

const demoStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: {
        paddingTop: 60,
        paddingBottom: SPACING.xl,
        paddingHorizontal: SPACING.lg,
        borderBottomLeftRadius: RADII.xl + 4,
        borderBottomRightRadius: RADII.xl + 4,
        marginBottom: SPACING.lg,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: 10,
    },
    eyebrow: {
        fontSize: 11,
        fontWeight: TYPOGRAPHY.bold,
        color: COLORS.goldLight,
        letterSpacing: 2.5,
        marginBottom: 6,
    },
    heading: {
        fontSize: 32,
        fontWeight: '900',
        color: COLORS.text,
        letterSpacing: -0.5,
        marginBottom: 4,
    },
    subheading: {
        fontSize: 14,
        fontWeight: TYPOGRAPHY.medium,
        color: COLORS.textSecondary,
        letterSpacing: 0.3,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: SPACING.md,
        gap: SPACING.sm + 4,
    },
    tile: {
        width: (SCREEN_WIDTH - 44) / 2,
        borderRadius: RADII.lg - 2,
        overflow: 'hidden',
        backgroundColor: COLORS.surface,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 4,
    },
    tileWide: { width: '100%' },
    tileGradient: {
        paddingVertical: 28,
        alignItems: 'center',
        gap: SPACING.sm + 2,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    tileLabel: {
        fontSize: 14,
        fontWeight: TYPOGRAPHY.bold,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
});