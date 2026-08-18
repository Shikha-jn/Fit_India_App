import React, { useState, useRef } from 'react';
import {
      ScrollView,
      StyleSheet,
      StatusBar,
      KeyboardAvoidingView,
      Platform,
      Alert,
      View,
      Text,
      Pressable,
      ActivityIndicator,
      TextInput,
      TextInputProps,
      Modal,
      Animated,
      Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/RootStackParamList';
import { LinearGradient } from 'react-native-linear-gradient';
import { COLORS, SPACING, TYPOGRAPHY, RADII } from '../../../theme/theme';
import { Contact, INTERESTED_PROGRAMS } from '../types/contact';
import { createInquiry } from '../../../services/client.service';
import { useAlert } from '../../../context/AlertContext';

interface ProgramSelectProps {
      label: string;
      value: string;
      options: readonly string[];
      onChange: (value: string) => void;
}

const ProgramSelect: React.FC<ProgramSelectProps> = ({
      label,
      value,
      options,
      onChange,
}) => {
      const [visible, setVisible] = useState(false);
      const slideAnim = useRef(new Animated.Value(300)).current;

      const open = () => {
            setVisible(true);
            Animated.spring(slideAnim, {
                  toValue: 0,
                  useNativeDriver: true,
                  friction: 10,
                  tension: 80,
            }).start();
      };

      const close = () => {
            Animated.timing(slideAnim, {
                  toValue: 300,
                  duration: 180,
                  useNativeDriver: true,
            }).start(() => setVisible(false));
      };

      const handleSelect = (option: string) => {
            onChange(option);
            close();
      };

      return (
            <View style={styles.programcontainer}>
                  <Text style={styles.programlabel}>{label}</Text>
                  <Pressable style={styles.field} onPress={open}>
                        <Text style={styles.fieldText} numberOfLines={1}>
                              {value}
                        </Text>
                        <Icon name="chevron-down" size={16} color={COLORS.textMuted} />
                  </Pressable>

                  <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
                        <Pressable style={styles.backdrop} onPress={close}>
                              <Animated.View
                                    style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
                              >
                                    <View style={styles.sheetHandle} />
                                    <Text style={styles.sheetTitle}>Interested Program</Text>
                                    {options.map((option) => {
                                          const isSelected = option === value;
                                          return (
                                                <Pressable
                                                      key={option}
                                                      style={styles.option}
                                                      onPress={() => handleSelect(option)}
                                                >
                                                      <Text
                                                            style={[
                                                                  styles.optionText,
                                                                  { color: isSelected ? COLORS.gold : COLORS.text },
                                                            ]}
                                                      >
                                                            {option}
                                                      </Text>
                                                      {isSelected && (
                                                            <Icon name="checkmark" size={18} color={COLORS.gold} />
                                                      )}
                                                </Pressable>
                                          );
                                    })}
                              </Animated.View>
                        </Pressable>
                  </Modal>
            </View>
      );
};

interface ContactChannelCardProps {
      icon: string;
      title: string;
      lines: string[];
      actionLabel?: string;
      onPress?: () => void;
}

const ContactChannelCard: React.FC<ContactChannelCardProps> = ({
      icon,
      title,
      lines,
      actionLabel,
      onPress,
}) => (
      <Pressable onPress={onPress} style={styles.channelcard}>
            <View style={styles.iconSquare}>
                  <Icon name={icon} size={19} color={COLORS.gold} />
            </View>
            <View style={styles.textBlock}>
                  <Text style={styles.channeltitle}>{title}</Text>
                  {lines.map((line, index) => (
                        <Text
                              key={index}
                              style={[styles.line, index === 0 && styles.lineFirst]}
                        >
                              {line}
                        </Text>
                  ))}
                  {!!actionLabel && <Text style={styles.action}>{actionLabel}</Text>}
            </View>
      </Pressable>
);

interface FormFieldProps extends TextInputProps {
      label: string;
      containerStyle?: object;
}

const FormField: React.FC<FormFieldProps> = ({
      label,
      containerStyle,
      style,
      multiline,
      ...rest
}) => {
      const [focused, setFocused] = useState(false);

      return (
            <View style={[styles.formcontainer, containerStyle]}>
                  <Text style={styles.label}>{label}</Text>
                  <TextInput
                        placeholderTextColor={COLORS.textMuted}
                        multiline={multiline}
                        style={[
                              styles.input,
                              multiline && styles.inputMultiline,
                              focused && styles.inputFocused,
                              style,
                        ]}
                        onFocus={(e) => {
                              setFocused(true);
                              rest.onFocus?.(e);
                        }}
                        onBlur={(e) => {
                              setFocused(false);
                              rest.onBlur?.(e);
                        }}
                        {...rest}
                  />
            </View>
      );
};

interface RequestConsultationFormProps {
      onSubmit?: (payload: Contact) => Promise<void> | void;
      navigation: any;
}

const RequestConsultationForm: React.FC<RequestConsultationFormProps> = ({
      onSubmit,
      navigation
}) => {
      const [fullName, setFullName] = useState('');
      const [phone, setPhone] = useState('');
      const [email, setEmail] = useState('');
      const [interestedProgram, setInterestedProgram] = useState<string>(
            INTERESTED_PROGRAMS[0],
      );
      const [healthConcerns, setHealthConcerns] = useState('');
      const [submitting, setSubmitting] = useState(false);

      const handleSubmit = async () => {
            if (!fullName.trim() || !phone.trim() || !email.trim()) {
                  Alert.alert(
                        'A few details are missing',
                        'Please fill in your name, phone number, and email so our team can reach you.',
                  );
                  return;
            }
            if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
                  Alert.alert('Check your email', 'That email address doesn\u2019t look right.');
                  return;
            }

            const payload: Contact = {
                  fullName: fullName.trim(),
                  phone: phone.trim(),
                  email: email.trim().toLowerCase(),
                  interestedProgram,
                  healthConcerns: healthConcerns.trim(),
            };

            try {
                  setSubmitting(true);
                  await onSubmit?.(payload);
                  setFullName('');
                  setPhone('');
                  setEmail('');
                  setInterestedProgram(INTERESTED_PROGRAMS[0]);
                  setHealthConcerns('');
                  navigation.goBack();
            } finally {
                  setSubmitting(false);
            }
      };

      return (
            <View style={styles.card}>
                  <Text style={styles.cardtitle}>Request Consultation</Text>
                  <Text style={styles.cardsubtitle}>
                        Fill in your health concerns, and our diet experts will reach out to
                        you within 24 hours.
                  </Text>

                  <View style={styles.row}>
                        <FormField
                              label="Full Name"
                              placeholder="e.g. Priyanjali Sharma"
                              value={fullName}
                              onChangeText={setFullName}
                              autoCapitalize="words"
                        />
                        <View style={styles.rowGap} />
                        <FormField
                              label="Phone Number"
                              placeholder="e.g. +91 98765 43210"
                              value={phone}
                              onChangeText={setPhone}
                              keyboardType="phone-pad"
                        />
                  </View>

                  <View style={styles.row}>
                        <FormField
                              label="Email Address"
                              placeholder="name@example.com"
                              value={email}
                              onChangeText={setEmail}
                              autoCapitalize="none"
                              autoCorrect={false}
                              keyboardType="email-address"
                        />
                        <View style={styles.rowGap} />
                        <ProgramSelect
                              label="Interested Program"
                              value={interestedProgram}
                              options={INTERESTED_PROGRAMS}
                              onChange={setInterestedProgram}
                        />
                  </View>

                  <FormField
                        label="Tell us about your health concerns (Optional)"
                        placeholder="e.g. Suffering from PCOS for 2 years, looking for sustainable lifestyle correction."
                        value={healthConcerns}
                        onChangeText={setHealthConcerns}
                        multiline
                  />

                  <Pressable onPress={handleSubmit} disabled={submitting} style={styles.submitWrap}>
                        <LinearGradient
                              colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={styles.submitBtn}
                        >
                              {submitting ? (
                                    <ActivityIndicator color={COLORS.text} />
                              ) : (
                                    <>
                                          <Icon name="paper-plane-outline" size={16} color={COLORS.text} />
                                          <Text style={styles.submitText}>Submit Inquiry</Text>
                                    </>
                              )}
                        </LinearGradient>
                  </Pressable>
            </View>
      );
};

interface ContactInfoSectionProps {
      phone?: string;
      email?: string;
}

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({
      phone = '+91 80851 75775',
      email = 'info@fitindiawomen.com',
}) => (
      <View style={styles.container}>
            <Text style={styles.title}>Contact Information</Text>
            <Text style={styles.subtitle}>
                  Have questions about program customisation, monthly schedules, or diet
                  consultations? Get in touch via any channel below.
            </Text>

            <ContactChannelCard
                  icon="call"
                  title="Call Us Directly"
                  lines={[phone]}
                  actionLabel="Tap to call"
                  onPress={() => Linking.openURL(`tel:${phone.replace(/\s/g, '')}`).catch(() => { })}
            />

            <ContactChannelCard
                  icon="mail"
                  title="Email Support"
                  lines={[email]}
                  actionLabel="Write to us"
                  onPress={() => Linking.openURL(`mailto:${email}`).catch(() => { })}
            />

            <ContactChannelCard
                  icon="time"
                  title="Counseling Hours"
                  lines={['Monday – Saturday: 7:00 AM – 7:00 PM', 'Sunday: Closed']}
            />
      </View>
);

// interface ContactScreenProps {
//       phone?: string;
//       email?: string;
//       onSubmitInquiry?: (payload: ConsultationRequestPayload) => Promise<void> | void;
// }

type ContactScreenProps = NativeStackScreenProps<RootStackParamList, 'Contact'>;

const ContactScreen = ({ navigation }: ContactScreenProps) => {
      const alert = useAlert();
      const phone = '+91 80851 75775';
      const email = 'info@fitindiawomen.com';
      const onSubmitInquiry = async (inquiry: Contact) => {
            const response = await createInquiry(inquiry);
            console.log('Inquiry response:', response.data);
            if (response.success) {
                  alert.success(response.message);
            } else {
                  alert.error(response.message);
            }
      }
      return (
            <KeyboardAvoidingView
                  style={styles.flex}
                  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                  <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
                  <ScrollView
                        style={styles.flex}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                  >
                        <ContactInfoSection phone={phone} email={email} />
                        <RequestConsultationForm onSubmit={onSubmitInquiry} navigation={navigation} />
                  </ScrollView>
            </KeyboardAvoidingView>
      );
};

const styles = StyleSheet.create({
      flex: {
            flex: 1,
            backgroundColor: COLORS.background,
      },
      content: {
            paddingBottom: 40,
      },
      container: {
            paddingHorizontal: SPACING.md,
            paddingTop: SPACING.lg,
      },
      title: {
            fontSize: 24,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
            marginBottom: SPACING.sm,
      },
      subtitle: {
            fontSize: 13,
            color: COLORS.textMuted,
            lineHeight: 20,
            marginBottom: SPACING.lg,
      },
      card: {
            backgroundColor: COLORS.surfaceElevated,
            borderRadius: RADII.xl,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: SPACING.lg - 4,
            marginHorizontal: SPACING.md,
            marginTop: SPACING.xl,
      },
      cardtitle: {
            fontSize: 21,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
            marginBottom: SPACING.sm,
      },
      cardsubtitle: {
            fontSize: 12.5,
            color: COLORS.textMuted,
            lineHeight: 19,
            marginBottom: SPACING.lg,
      },
      row: {
            flexDirection: 'row',
      },
      rowGap: {
            width: SPACING.sm + 2,
      },
      submitWrap: {
            borderRadius: RADII.md + 4,
            overflow: 'hidden',
            marginTop: SPACING.xs,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 14,
            elevation: 8,
      },
      submitBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 54,
      },
      submitText: {
            color: COLORS.text,
            fontSize: 15,
            fontWeight: TYPOGRAPHY.extraBold,
            marginLeft: SPACING.sm,
      },
      channelcard: {
            flexDirection: 'row',
            backgroundColor: COLORS.surface,
            borderRadius: RADII.lg,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: SPACING.md,
            marginBottom: SPACING.md,
      },
      iconSquare: {
            width: 46,
            height: 46,
            borderRadius: RADII.md,
            backgroundColor: 'rgba(212, 171, 58, 0.12)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: SPACING.md,
      },
      textBlock: {
            flex: 1,
      },
      channeltitle: {
            fontSize: 15,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
            marginBottom: 4,
      },
      line: {
            fontSize: 12.5,
            color: COLORS.textSecondary,
            fontWeight: TYPOGRAPHY.medium,
      },
      lineFirst: {
            marginBottom: 1,
      },
      action: {
            fontSize: 12,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.gold,
            marginTop: SPACING.xs + 2,
      },
      formcontainer: {
            flex: 1,
            marginBottom: SPACING.md,
      },
      label: {
            fontSize: 11,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.4,
            color: COLORS.text,
            marginBottom: SPACING.sm,
      },
      input: {
            backgroundColor: COLORS.surface,
            borderRadius: RADII.md + 2,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingHorizontal: SPACING.md,
            height: 50,
            color: COLORS.text,
            fontSize: 14,
            fontWeight: TYPOGRAPHY.medium,
      },
      inputMultiline: {
            height: 110,
            paddingTop: SPACING.sm + 4,
            textAlignVertical: 'top',
      },
      inputFocused: {
            borderColor: COLORS.gold,
            shadowColor: COLORS.gold,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 4,
      },
      programcontainer: {
            flex: 1,
            marginBottom: SPACING.md,
      },
      programlabel: {
            fontSize: 11,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.4,
            color: COLORS.text,
            marginBottom: SPACING.sm,
      },
      field: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: COLORS.surface,
            borderRadius: RADII.md + 2,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingHorizontal: SPACING.md,
            height: 50,
      },
      fieldText: {
            flex: 1,
            color: COLORS.text,
            fontSize: 13.5,
            fontWeight: TYPOGRAPHY.bold,
            marginRight: SPACING.sm,
      },
      backdrop: {
            flex: 1,
            backgroundColor: COLORS.overlay,
            justifyContent: 'flex-end',
      },
      sheet: {
            backgroundColor: COLORS.surfaceElevated,
            borderTopLeftRadius: RADII.xl,
            borderTopRightRadius: RADII.xl,
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: 32,
            borderTopWidth: 1,
            borderColor: COLORS.border,
            maxHeight: '65%',
      },
      sheetHandle: {
            alignSelf: 'center',
            width: 40,
            height: 4,
            borderRadius: 2,
            backgroundColor: COLORS.divider,
            marginBottom: 16,
      },
      sheetTitle: {
            color: COLORS.textMuted,
            fontSize: 12,
            fontWeight: TYPOGRAPHY.bold,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
            marginBottom: 8,
      },
      option: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingVertical: 15,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
      },
      optionText: {
            fontSize: 15,
            fontWeight: TYPOGRAPHY.semiBold,
            flexShrink: 1,
            marginRight: 8,
      },
});

export default ContactScreen;