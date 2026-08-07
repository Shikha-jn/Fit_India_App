import React, { useRef, useState } from 'react';
import {
      View,
      Text,
      ScrollView,
      Pressable,
      StyleSheet,
      KeyboardAvoidingView,
      Platform,
      Animated,
      ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { COLORS } from '../../../theme/theme';
import LabeledInput from '../../../components/LabeledInput';
import SegmentedToggle, { SegmentOption } from '../screens/SegementedToggle';
import { LoginFormState, LoginPayload, LoginRoleGroup } from '../../register/types/register';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from '../../../types/RootStackParamList';
import { useNavigation } from '@react-navigation/native';
import { useAlert } from '../../../context/AlertContext';
import { useAuthStore } from '../../../store/useAuthStore';

const ROLE_OPTIONS: SegmentOption<LoginRoleGroup>[] = [
      { value: 'client', label: 'Member / Client', icon: 'person-outline' },
      { value: 'trainer', label: 'Coach / Trainer', icon: 'briefcase-outline' },
];

const INITIAL_STATE: LoginFormState = {
      roleGroup: 'client',
      email: '',
      password: '',
};

type FormErrors = Partial<Record<keyof LoginFormState, string>>;

type LoginScreenProps = NativeStackNavigationProp<RootStackParamList, 'Login'>

const LoginScreen: React.FC<LoginScreenProps> = ({

}) => {
      const navigation = useNavigation<LoginScreenProps>();
      const alert = useAlert();
      const { setAuth } = useAuthStore();
      const [form, setForm] = useState<LoginFormState>(INITIAL_STATE);
      const [errors, setErrors] = useState<FormErrors>({});
      const [showPassword, setShowPassword] = useState(false);
      const [submitting, setSubmitting] = useState(false);
      const [formError, setFormError] = useState<string | null>(null);

      const buttonScale = useRef(new Animated.Value(1)).current;

      const update = <K extends keyof LoginFormState>(
            key: K,
            value: LoginFormState[K],
      ) => {
            setForm((prev) => ({ ...prev, [key]: value }));
            if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
            if (formError) setFormError(null);
      };

      const validate = (): boolean => {
            const next: FormErrors = {};
            if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
                  next.email = 'Enter a valid email address';
            }
            if (!form.password) {
                  next.password = 'Password is required';
            }
            setErrors(next);
            return Object.keys(next).length === 0;
      };

      const animatePressIn = () => {
            Animated.spring(buttonScale, {
                  toValue: 0.97,
                  useNativeDriver: true,
                  friction: 6,
            }).start();
      };

      const animatePressOut = () => {
            Animated.spring(buttonScale, {
                  toValue: 1,
                  useNativeDriver: true,
                  friction: 6,
            }).start();
      };

      const onLogin = (payload: any) => {
            console.log('Login function called');
      }

      const onForgotPassword = () => {
            console.log('Forgot password function called');
      }
      const onNavigateToRegister = () => {
            console.log('Navigate to register function called');
            navigation.navigate('Register');
      }

      const handleSubmit = async () => {
            if (!validate()) return;

            const payload: LoginPayload = {
                  roleGroup: form.roleGroup,
                  email: form.email.trim().toLowerCase(),
                  password: form.password,
            };

            try {
                  setSubmitting(true);
                  setFormError(null);
                  const response =
                        form.roleGroup === 'client'
                              ? await userApi.login({ email: payload.email, password: payload.password })
                              : await trainerAPI.loginTrainer({ email: payload.email, password: payload.password });

                  if (response.data?.success) {
                        console.log('Login response : ', response.data);

                        alert.success('Login Successful', 'Welcome back!');

                        setAuth(form.roleGroup === 'trainer' ? response.data : response.data, response.data.role, response.data.token);

                        if (form.roleGroup === 'trainer') {
                              navigation.replace('TrainerTab', { screen: 'Dashboard' });
                        } else {
                              navigation.replace('UserTab', { screen: 'Dashboard' });
                        }
                  } else {
                        alert.error('Login Failed', 'Invalid email or password. Please try again.');
                  }
            } catch (err) {
                  setFormError(
                        err instanceof Error ? err.message : 'Unable to sign in. Please try again.',
                  );
            } finally {
                  setSubmitting(false);
            }
      };

      return (
            <KeyboardAvoidingView
                  style={styles.flex}
                  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                  <ScrollView
                        style={styles.flex}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                  >
                        {/* Header */}
                        <View style={styles.header}>
                              <View style={styles.glowOuter} />
                              <View style={styles.glowInner} />
                              <View style={styles.badge}>
                                    <Icon name="pulse" size={30} color={COLORS.text} />
                              </View>
                              <View style={styles.titleRow}>
                                    <Text style={styles.title}>Welcome Back</Text>
                                    <Icon name="heart" size={20} color={COLORS.primary} style={styles.titleHeart} />
                              </View>
                              <Text style={styles.subtitle}>
                                    Log in to manage your workouts, diets, webinars, and coaching.
                              </Text>
                        </View>

                        {/* Role toggle */}
                        <SegmentedToggle
                              value={form.roleGroup}
                              options={ROLE_OPTIONS}
                              onChange={(v) => update('roleGroup', v)}
                        />

                        {/* Email */}
                        <View style={styles.spacerTop}>
                              <LabeledInput
                                    label="Email Address"
                                    placeholder="name@domain.com"
                                    value={form.email}
                                    onChangeText={(t) => update('email', t)}
                                    error={errors.email}
                                    // leftIcon="mail-outline"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    keyboardType="email-address"
                              />
                        </View>

                        {/* Password */}
                        <LabeledInput
                              label="Password"
                              placeholder="Enter your password"
                              value={form.password}
                              onChangeText={(t) => update('password', t)}
                              error={errors.password}
                              // leftIcon="lock-closed-outline"
                              secureTextEntry={!showPassword}
                              rightElement={
                                    <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                                          <Icon
                                                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                                size={18}
                                                color={COLORS.textMuted}
                                          />
                                    </Pressable>
                              }
                        />

                        {onForgotPassword && (
                              <Pressable onPress={onForgotPassword} style={styles.forgotWrap}>
                                    <Text style={styles.forgotText}>Forgot password?</Text>
                              </Pressable>
                        )}

                        {!!formError && (
                              <View style={styles.errorBanner}>
                                    <Icon name="alert-circle-outline" size={16} color={COLORS.error} />
                                    <Text style={styles.errorBannerText}>{formError}</Text>
                              </View>
                        )}

                        {/* Submit */}
                        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                              <Pressable
                                    onPress={handleSubmit}
                                    onPressIn={animatePressIn}
                                    onPressOut={animatePressOut}
                                    disabled={submitting}
                                    style={styles.submitBtn}
                              >
                                    {submitting ? (
                                          <ActivityIndicator color={COLORS.text} />
                                    ) : (
                                          <>
                                                <Text style={styles.submitText}>Sign In</Text>
                                                <Icon name="arrow-forward" size={18} color={COLORS.text} />
                                          </>
                                    )}
                              </Pressable>
                        </Animated.View>

                        {/* Footer */}
                        <View style={styles.footer}>
                              <View style={styles.divider} />
                              <Pressable onPress={onNavigateToRegister} style={styles.footerRow}>
                                    <Text style={styles.footerText}>New to Fit India? </Text>
                                    <Text style={styles.footerLink}>Create Account</Text>
                              </Pressable>
                        </View>
                  </ScrollView>
            </KeyboardAvoidingView>
      );
};

const styles = StyleSheet.create({
      flex: { flex: 1, backgroundColor: COLORS.background },
      scrollContent: {
            paddingHorizontal: 20,
            paddingTop: 40,
            paddingBottom: 48,
            flexGrow: 1,
            justifyContent: 'center',
      },
      header: {
            alignItems: 'center',
            marginBottom: 28,
      },
      glowOuter: {
            position: 'absolute',
            top: -20,
            width: 160,
            height: 160,
            borderRadius: 80,
            backgroundColor: 'rgba(166, 24, 82, 0.16)',
      },
      glowInner: {
            position: 'absolute',
            top: 4,
            width: 96,
            height: 96,
            borderRadius: 48,
            backgroundColor: 'rgba(212, 171, 58, 0.14)',
      },
      badge: {
            width: 64,
            height: 64,
            borderRadius: 20,
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.5,
            shadowRadius: 14,
            elevation: 8,
      },
      titleRow: {
            flexDirection: 'row',
            alignItems: 'center',
      },
      title: {
            fontSize: 26,
            fontWeight: '800',
            color: COLORS.text,
            letterSpacing: 0.3,
      },
      titleHeart: {
            marginLeft: 8,
      },
      subtitle: {
            marginTop: 8,
            fontSize: 13,
            color: COLORS.textSecondary,
            textAlign: 'center',
            paddingHorizontal: 24,
            lineHeight: 19,
      },
      spacerTop: {
            marginTop: 24,
      },
      forgotWrap: {
            alignSelf: 'flex-end',
            marginTop: -6,
            marginBottom: 8,
      },
      forgotText: {
            color: COLORS.primaryLight,
            fontSize: 12,
            fontWeight: '600',
      },
      errorBanner: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            borderRadius: 12,
            borderWidth: 1,
            borderColor: 'rgba(239, 68, 68, 0.35)',
            paddingVertical: 10,
            paddingHorizontal: 12,
            marginBottom: 16,
      },
      errorBannerText: {
            color: COLORS.error,
            fontSize: 12,
            fontWeight: '600',
            marginLeft: 8,
            flex: 1,
      },
      submitBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.primary,
            borderRadius: 18,
            height: 56,
            marginTop: 8,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.5,
            shadowRadius: 16,
            elevation: 10,
            borderTopColor: COLORS.goldDark,
            borderTopWidth: 1.5,
            borderStartColor: COLORS.goldDark,
            borderStartWidth: 1.5,
            borderEndColor: COLORS.goldDark,
            borderEndWidth: 1.5,
      },
      submitText: {
            color: COLORS.text,
            fontSize: 15,
            fontWeight: '800',
            marginRight: 8,
            letterSpacing: 0.3,
      },
      footer: {
            alignItems: 'center',
            marginTop: 28,
      },
      divider: {
            width: '100%',
            height: 1,
            backgroundColor: COLORS.divider,
            marginBottom: 20,
      },
      footerRow: {
            flexDirection: 'row',
      },
      footerText: {
            color: COLORS.textMuted,
            fontSize: 13,
      },
      footerLink: {
            color: COLORS.primaryLight,
            fontSize: 13,
            fontWeight: '700',
      },
});

export default LoginScreen;