import React, { useState, useRef } from 'react';
import {
      View,
      Text,
      ScrollView,
      Pressable,
      Image,
      StyleSheet,
      KeyboardAvoidingView,
      Platform,
      Animated,
      ActivityIndicator,
      Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';

import { COLORS } from '../../theme/theme';
import LabeledInput from '../../components/LabeledInput';
import RoleToggle from '../../components/RoleToggle';
import ConditionChip from '../../auth/register/screens/ConditionChip';
import FitnessGoalSelect from '../../auth/register/screens/FitnessGoal';
import {
      RegisterFormState,
      RegisterPayload,
      RegisterableRole,
      FITNESS_GOALS,
      MEDICAL_CONDITIONS,
} from '../../auth/register/types/register';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/RootStackParamList';
import { editProfile } from '../../services/client.service';
import { useAlert } from '../../context/AlertContext';

const INITIAL_STATE: RegisterFormState = {
      role: 'client',
      profileImage: null,
      name: '',
      phone: '',
      email: '',
      password: '',
      age: '',
      height: '',
      currentWeight: '',
      fitnessGoal: FITNESS_GOALS[0],
      medicalConditions: [],
};

type FormErrors = Partial<Record<keyof RegisterFormState, string>>;

type EditScreenProps = NativeStackScreenProps<
      RootStackParamList,
      'EditProfile'
>;

const EditScreen = ({ navigation, route }: EditScreenProps) => {
      const { profile } = route.params;
      const alert = useAlert();
      const [form, setForm] = useState<RegisterFormState>(profile);
      const [errors, setErrors] = useState<FormErrors>({});
      const [showPassword, setShowPassword] = useState(false);
      const [submitting, setSubmitting] = useState(false);

      const buttonScale = useRef(new Animated.Value(1)).current;

      const update = <K extends keyof RegisterFormState>(
            key: K,
            value: RegisterFormState[K],
      ) => {
            setForm(prev => ({ ...prev, [key]: value }));
            if (errors[key]) setErrors(prev => ({ ...prev, [key]: undefined }));
      };

      const setRole = (role: RegisterableRole) => update('role', role);

      const toggleCondition = (condition: string) => {
            setForm(prev => {
                  let next: string[];
                  if (condition === 'None') {
                        next = prev.medicalConditions.includes('None') ? [] : ['None'];
                  } else if (prev.medicalConditions.includes(condition)) {
                        next = prev.medicalConditions.filter(c => c !== condition);
                  } else {
                        next = [...prev.medicalConditions.filter(c => c !== 'None'), condition];
                  }
                  return { ...prev, medicalConditions: next };
            });
      };

      const pickImage = async () => {
            try {
                  const result = await launchImageLibrary({
                        mediaType: 'photo',
                        quality: 0.8,
                  });
                  if (result.didCancel || !result.assets?.length) return;
                  const asset = result.assets[0];
                  if (asset.uri) {
                        update('profileImage', {
                              uri: asset.uri,
                              fileName: asset.fileName,
                              type: asset.type,
                        });
                  }
            } catch (err) {
                  Alert.alert('Could not open photo library', 'Please try again.');
            }
      };

      const validate = (): boolean => {
            const next: FormErrors = {};
            if (!form.name.trim()) next.name = 'Full name is required';
            if (!/^\+?[0-9\s]{7,15}$/.test(form.phone.trim()))
                  next.phone = 'Enter a valid phone number';
            if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
                  next.email = 'Enter a valid email address';
            if (form.password.length < 6)
                  next.password = 'Minimum 6 characters required';
            if (!form.age || Number(form.age) <= 0) next.age = 'Required';
            if (!form.height || Number(form.height) <= 0) next.height = 'Required';
            if (!form.currentWeight || Number(form.currentWeight) <= 0)
                  next.currentWeight = 'Required';

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

      const onRegister = async (payload: RegisterPayload) => {
            // Placeholder for registration logic
            console.log('Registering user with payload:', payload);
            // Simulate a network request
      };

      const onNavigateToSignIn = () => {
            // Placeholder for navigation logic
            console.log('Navigating to Sign In screen');
            navigation.navigate('Login');
      };

      const handleSubmit = async () => {
            if (!validate()) return;

            const payload: RegisterPayload = {
                  name: form.name.trim(),
                  email: form.email.trim().toLowerCase(),
                  phone: form.phone.trim(),
                  role: form.role,
                  age: Number(form.age),
                  height: Number(form.height),
                  currentWeight: Number(form.currentWeight),
                  fitnessGoal: form.fitnessGoal,
                  medicalConditions: form.medicalConditions,
                  password: form.password,
                  profileImage: form.profileImage,
            };

            try {
                  setSubmitting(true);
                  const response = await editProfile(payload);

                  if (response.success) {
                        alert.success('Profile Updated');
                        setForm(INITIAL_STATE);
                        navigation.goBack();
                  } else {
                        alert.error('Error in profile update', 'Please try again latter');
                  }

            } finally {
                  setSubmitting(false);
            }
      };

      return (
            <KeyboardAvoidingView
                  style={styles.flex}
                  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                  <ScrollView
                        style={styles.flex}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                  >
                        {/* Header */}
                        {/* <View style={styles.header}>
                              <View style={styles.glowOuter} />
                              <View style={styles.glowInner} />
                              <View style={styles.badge}>
                                    <Icon name="pulse" size={30} color={COLORS.text} />
                              </View>
                              <View style={styles.titleRow}>
                                    <Text style={styles.title}>Start Your Journey</Text>
                                    <Icon
                                          name="heart"
                                          size={20}
                                          color={COLORS.primary}
                                          style={styles.titleHeart}
                                    />
                              </View>
                              <Text style={styles.subtitle}>
                                    Empowering women across India with scientific fitness and nutrition
                                    programs.
                              </Text>
                        </View> */}

                        {/* Role toggle */}
                        {/* <RoleToggle value={form.role} onChange={setRole} /> */}

                        {/* Profile picture */}
                        <View style={styles.card}>
                              <Text style={styles.cardLabel}>Profile Picture (Optional)</Text>
                              <View style={styles.avatarRow}>
                                    <Pressable onPress={pickImage} style={styles.avatarWrap}>
                                          {form.profileImage ? (
                                                <Image
                                                      source={{ uri: form.profileImage.uri }}
                                                      style={styles.avatarImage}
                                                />
                                          ) : (
                                                <View style={styles.avatarPlaceholder}>
                                                      <Text style={styles.avatarPlaceholderText}>No Pic</Text>
                                                </View>
                                          )}
                                          <View style={styles.cameraBadge}>
                                                <Icon name="camera" size={12} color={COLORS.text} />
                                          </View>
                                    </Pressable>
                                    <Pressable style={styles.chooseFileBtn} onPress={pickImage}>
                                          <Text style={styles.chooseFileText}>Choose Photo</Text>
                                    </Pressable>
                                    <Text style={styles.fileNameText} numberOfLines={1}>
                                          {form.profileImage?.fileName ?? 'No file chosen'}
                                    </Text>
                              </View>
                        </View>

                        {/* Name + Phone */}
                        <View style={styles.row}>
                              <LabeledInput
                                    label="Full Name"
                                    placeholder="Shreya Sharma"
                                    icon=""
                                    value={form.name}
                                    onChangeText={t => update('name', t)}
                                    error={errors.name}
                                    autoCapitalize="words"
                              />
                              <LabeledInput
                                    label="Phone Number"
                                    placeholder="+91 98765 43210"
                                    icon=""
                                    value={form.phone}
                                    onChangeText={t => update('phone', t)}
                                    error={errors.phone}
                                    keyboardType="phone-pad"
                              />
                        </View>

                        {/* Email */}
                        <LabeledInput
                              label="Email Address"
                              placeholder="name@domain.com"
                              icon="mail-outline"
                              value={form.email}
                              onChangeText={t => update('email', t)}
                              error={errors.email}
                              autoCapitalize="none"
                              keyboardType="email-address"
                        />

                        {/* Password */}
                        {/* <LabeledInput
                              label="Password"
                              placeholder="Enter your password"
                              icon="lock-closed-outline"
                              value={form.password}
                              onChangeText={t => update('password', t)}
                              error={errors.password}
                              secureTextEntry={!showPassword}
                              trailingIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                              onTrailingPress={() => setShowPassword(prev => !prev)}
                        /> */}

                        {/* Age / Height / Weight */}
                        <View style={styles.row}>
                              <LabeledInput
                                    label="Age"
                                    placeholder="25"
                                    icon=""
                                    value={form.age}
                                    onChangeText={t => update('age', t.replace(/[^0-9]/g, ''))}
                                    error={errors.age}
                                    keyboardType="number-pad"
                              />
                              <LabeledInput
                                    label="Height (cm)"
                                    placeholder="165"
                                    icon=""
                                    value={form.height}
                                    onChangeText={t => update('height', t.replace(/[^0-9]/g, ''))}
                                    error={errors.height}
                                    keyboardType="number-pad"
                              />
                              <LabeledInput
                                    label="Weight (kg)"
                                    placeholder="60"
                                    icon=""
                                    value={form.currentWeight}
                                    onChangeText={t =>
                                          update('currentWeight', t.replace(/[^0-9]/g, ''))
                                    }
                                    error={errors.currentWeight}
                                    keyboardType="number-pad"
                              />
                        </View>

                        {/* Fitness goal */}
                        <View style={styles.fieldBlock}>
                              <Text style={styles.cardLabel}>Primary Fitness Goal</Text>
                              <FitnessGoalSelect
                                    value={form.fitnessGoal}
                                    options={FITNESS_GOALS}
                                    onChange={v => update('fitnessGoal', v)}
                              />
                        </View>

                        {/* Medical conditions */}
                        <View style={styles.fieldBlock}>
                              <Text style={styles.cardLabel}>
                                    Medical & Health Conditions (PCOS, Thyroid, etc.)
                              </Text>
                              <View style={styles.chipGrid}>
                                    {MEDICAL_CONDITIONS.map(condition => (
                                          <ConditionChip
                                                key={condition}
                                                label={condition}
                                                selected={form.medicalConditions.includes(condition)}
                                                onPress={() => toggleCondition(condition)}
                                          />
                                    ))}
                              </View>
                        </View>

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
                                                <Text style={styles.submitText}>Save Changes</Text>
                                                <Icon name="arrow-forward" size={18} color={COLORS.text} />
                                          </>
                                    )}
                              </Pressable>
                        </Animated.View>

                        {/* Footer */}
                        {/* <View style={styles.footer}>
                              <View style={styles.divider} />
                              <Pressable onPress={onNavigateToSignIn} style={styles.footerRow}>
                                    <Text style={styles.footerText}>Already have an account? </Text>
                                    <Text style={styles.footerLink}>Sign In</Text>
                              </Pressable>
                        </View> */}
                  </ScrollView>
            </KeyboardAvoidingView>
      );
};

const styles = StyleSheet.create({
      flex: { flex: 1, backgroundColor: COLORS.background },
      scrollContent: {
            paddingHorizontal: 20,
            paddingTop: 32,
            paddingBottom: 48,
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
            fontSize: 24,
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
      card: {
            backgroundColor: COLORS.surface,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: 16,
            marginTop: 20,
            marginBottom: 20,
      },
      cardLabel: {
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 0.6,
            color: COLORS.textMuted,
            textTransform: 'uppercase',
            marginBottom: 12,
      },
      avatarRow: {
            flexDirection: 'row',
            alignItems: 'center',
      },
      avatarWrap: {
            marginRight: 12,
      },
      avatarImage: {
            width: 56,
            height: 56,
            borderRadius: 28,
            borderWidth: 2,
            borderColor: COLORS.gold,
      },
      avatarPlaceholder: {
            width: 56,
            height: 56,
            borderRadius: 28,
            backgroundColor: 'rgba(166, 24, 82, 0.18)',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: COLORS.primaryLight,
      },
      avatarPlaceholderText: {
            fontSize: 10,
            fontWeight: '700',
            color: COLORS.primaryLight,
      },
      cameraBadge: {
            position: 'absolute',
            right: -2,
            bottom: -2,
            width: 20,
            height: 20,
            borderRadius: 10,
            backgroundColor: COLORS.goldDark,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: COLORS.surface,
      },
      chooseFileBtn: {
            backgroundColor: COLORS.surfaceElevated,
            borderRadius: 12,
            paddingVertical: 8,
            paddingHorizontal: 14,
            borderWidth: 1,
            borderColor: COLORS.border,
            marginRight: 10,
      },
      chooseFileText: {
            color: COLORS.primaryLight,
            fontSize: 12,
            fontWeight: '700',
      },
      fileNameText: {
            flex: 1,
            color: COLORS.textMuted,
            fontSize: 12,
      },
      row: {
            flexDirection: 'column',
            gap: 12,
      },
      rowItem: {
            flex: 1,
      },
      thirdItem: {
            flex: 1,
      },
      fieldBlock: {
            marginBottom: 20,
      },
      chipGrid: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
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

export default EditScreen;
