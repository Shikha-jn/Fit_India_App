import React, { useState } from 'react';
import { ScrollView, StyleSheet, StatusBar, KeyboardAvoidingView, Platform, View, Text, TextInput, Pressable, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, TYPOGRAPHY, RADII } from '../../../theme/theme';
import { ScheduleWebinarPayload } from '../types/webinar';
import ScheduleWebinarForm from '../components/sections/ScheduleWebinarForm';

interface ScheduleDateTimeFieldProps {
      label: string;
      value: string;
      onChangeText: (text: string) => void;
}

/** Auto-inserts separators as digits are typed: "1408202619300" -> "14-08-2026 19:30" */
function formatAsTyped(input: string): string {
      const digits = input.replace(/\D/g, '').slice(0, 12);
      const day = digits.slice(0, 2);
      const month = digits.slice(2, 4);
      const year = digits.slice(4, 8);
      const hour = digits.slice(8, 10);
      const minute = digits.slice(10, 12);

      let result = day;
      if (month) result += `-${month}`;
      if (year) result += `-${year}`;
      if (hour) result += ` ${hour}`;
      if (minute) result += `:${minute}`;
      return result;
}

const ScheduleDateTimeField: React.FC<ScheduleDateTimeFieldProps> = ({
      label,
      value,
      onChangeText,
}) => (
      <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <View style={styles.field}>
                  <TextInput
                        value={value}
                        onChangeText={(text) => onChangeText(formatAsTyped(text))}
                        placeholder="dd-mm-yyyy --:--"
                        placeholderTextColor={COLORS.textMuted}
                        keyboardType="number-pad"
                        maxLength={16}
                        style={styles.input}
                  />
                  <Icon name="calendar-outline" size={16} color={COLORS.textMuted} />
            </View>
      </View>
);

interface BannerImageFieldProps {
      value: string;
      onChangeText: (url: string) => void;
}

const BannerImageField: React.FC<BannerImageFieldProps> = ({ value, onChangeText }) => {
      const pickImage = async () => {
            try {
                  const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.8 });
                  if (result.didCancel || !result.assets?.length) return;
                  const uri = result.assets[0].uri;
                  if (uri) onChangeText(uri);
            } catch {
                  // silently ignore — user can still paste a URL
            }
      };

      return (
            <View style={styles.bancontainer}>
                  <Text style={styles.banlabel}>Webinar Banner Image</Text>

                  <View style={styles.uploadRow}>
                        <Pressable onPress={pickImage} style={styles.uploadBtn}>
                              <Icon name="add-circle-outline" size={16} color={COLORS.primaryLight} />
                              <Text style={styles.uploadBtnText}>Upload Image File</Text>
                        </Pressable>
                        <Text style={styles.orText}>or paste a URL below</Text>
                  </View>

                  <TextInput
                        value={value}
                        onChangeText={onChangeText}
                        placeholder="https://images.unsplash.com/photo-xxx or banner image link"
                        placeholderTextColor={COLORS.textMuted}
                        autoCapitalize="none"
                        autoCorrect={false}
                        style={styles.urlInput}
                  />

                  {!!value && (
                        <Image source={{ uri: value }} style={styles.preview} resizeMode="cover" />
                  )}
            </View>
      );
};

interface ScheduleWebinarFormProps {
      onSchedule?: (payload: ScheduleWebinarPayload) => Promise<void> | void;
}

const ScheduleWebinarForm: React.FC<ScheduleWebinarFormProps> = ({ onSchedule }) => {
      const [title, setTitle] = useState('');
      const [description, setDescription] = useState('');
      const [scheduleInput, setScheduleInput] = useState('');
      const [capacity, setCapacity] = useState('50');
      const [originalPrice, setOriginalPrice] = useState('');
      const [discountedPrice, setDiscountedPrice] = useState('');
      const [meetingLink, setMeetingLink] = useState('');
      const [bannerImage, setBannerImage] = useState('');
      const [saving, setSaving] = useState(false);

      const handleSchedule = async () => {
            if (!title.trim()) {
                  Alert.alert('Webinar title required', 'Give this live panel a title.');
                  return;
            }

            const scheduleTime = parseScheduleDateTime(scheduleInput);
            if (!scheduleTime) {
                  Alert.alert(
                        'Invalid date & time',
                        'Enter the schedule as dd-mm-yyyy followed by a 24-hour time, e.g. 14-08-2026 19:30.',
                  );
                  return;
            }

            if (!meetingLink.trim()) {
                  Alert.alert('Meeting link required', 'Add the virtual meeting link for this panel.');
                  return;
            }

            const payload: ScheduleWebinarPayload = {
                  title: title.trim(),
                  description: description.trim(),
                  scheduleTime,
                  capacity: Number(capacity) || 0,
                  originalPrice: Number(originalPrice) || 0,
                  discountedPrice: Number(discountedPrice) || 0,
                  meetingLink: meetingLink.trim(),
                  bannerImage: bannerImage.trim(),
            };

            try {
                  setSaving(true);
                  await onSchedule?.(payload);
                  setTitle('');
                  setDescription('');
                  setScheduleInput('');
                  setCapacity('50');
                  setOriginalPrice('');
                  setDiscountedPrice('');
                  setMeetingLink('');
                  setBannerImage('');
            } finally {
                  setSaving(false);
            }
      };

      return (
            <View style={styles.card}>
                  <View style={styles.body}>
                        <View style={styles.header}>
                              <View style={styles.plusCircle}>
                                    <Icon name="add" size={16} color={COLORS.primaryLight} />
                              </View>
                              <Text style={styles.headerText}>Schedule New Live Panel</Text>
                        </View>

                        <FormField
                              label="Webinar Title"
                              placeholder="PCOS/PCOD Guideline and Care Regime"
                              value={title}
                              onChangeText={setTitle}
                        />

                        <FormField
                              label="Description"
                              placeholder="Provide a short synopsis of what points will be discussed, prerequisites, etc."
                              value={description}
                              onChangeText={setDescription}
                              multiline
                        />

                        <View style={styles.row}>
                              <ScheduleDateTimeField
                                    label="Schedule Date & Time"
                                    value={scheduleInput}
                                    onChangeText={setScheduleInput}
                              />
                              <FormField
                                    label="Max Capacity (Seats)"
                                    placeholder="50"
                                    value={capacity}
                                    onChangeText={(t) => setCapacity(t.replace(/[^0-9]/g, ''))}
                                    keyboardType="number-pad"
                                    containerStyle={styles.rowItemRight}
                              />
                        </View>

                        <View style={styles.row}>
                              <FormField
                                    label="Original Price (Fake Slashed Price)"
                                    placeholder="e.g. 999"
                                    value={originalPrice}
                                    onChangeText={(t) => setOriginalPrice(t.replace(/[^0-9]/g, ''))}
                                    keyboardType="number-pad"
                              />
                              <FormField
                                    label="Discounted Price (Actual Price)"
                                    placeholder="e.g. 499 (0 for Free)"
                                    value={discountedPrice}
                                    onChangeText={(t) => setDiscountedPrice(t.replace(/[^0-9]/g, ''))}
                                    keyboardType="number-pad"
                                    containerStyle={styles.rowItemRight}
                              />
                        </View>

                        <FormField
                              label="Virtual Meeting Link"
                              placeholder="https://meet.google.com/abc-defg-hij"
                              value={meetingLink}
                              onChangeText={setMeetingLink}
                              autoCapitalize="none"
                              autoCorrect={false}
                              keyboardType="url"
                        />

                        <BannerImageField value={bannerImage} onChangeText={setBannerImage} />
                  </View>

                  <Pressable onPress={handleSchedule} disabled={saving} style={styles.submitBtn}>
                        {saving ? (
                              <ActivityIndicator color={COLORS.text} />
                        ) : (
                              <Text style={styles.submitText}>Schedule Webinar</Text>
                        )}
                  </Pressable>
            </View>
      );
};

interface ScheduleWebinarScreenProps {
      onSchedule?: (payload: ScheduleWebinarPayload) => Promise<void> | void;
}

const ScheduleWebinarScreen: React.FC<ScheduleWebinarScreenProps> = ({
      onSchedule,
}) => (
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
                  <ScheduleWebinarForm onSchedule={onSchedule} />
            </ScrollView>
      </KeyboardAvoidingView>
);

const styles = StyleSheet.create({
      flex: {
            flex: 1,
            backgroundColor: COLORS.background,
      },
      content: {
            paddingVertical: 20,
            paddingBottom: 40,
      },
      card: {
            backgroundColor: COLORS.surfaceElevated,
            borderRadius: RADII.xl,
            borderWidth: 1,
            borderColor: COLORS.border,
            marginHorizontal: SPACING.md,
            marginTop: SPACING.md,
            overflow: 'hidden',
      },
      body: {
            padding: SPACING.lg - 4,
      },
      header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: SPACING.lg,
      },
      plusCircle: {
            width: 28,
            height: 28,
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: COLORS.primaryLight,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: SPACING.sm + 2,
      },
      headerText: {
            fontSize: 15,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.4,
            color: COLORS.text,
            textTransform: 'uppercase',
      },
      row: {
            flexDirection: 'row',
      },
      rowItemRight: {
            marginLeft: SPACING.sm + 2,
      },
      submitBtn: {
            height: 58,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: COLORS.primary,
      },
      submitText: {
            color: COLORS.text,
            fontSize: 15,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.3,
      },
      container: {
            flex: 1,
            marginBottom: SPACING.lg - 4,
      },
      label: {
            fontSize: 11,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
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
      input: {
            flex: 1,
            color: COLORS.text,
            fontSize: 13.5,
            fontWeight: TYPOGRAPHY.medium,
            padding: 0,
      },
      bancontainer: {
            marginBottom: SPACING.md,
      },
      banlabel: {
            fontSize: 11,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
            color: COLORS.text,
            marginBottom: SPACING.sm,
      },
      uploadRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: SPACING.sm + 2,
      },
      uploadBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(198, 53, 115, 0.12)',
            borderWidth: 1,
            borderColor: 'rgba(198, 53, 115, 0.4)',
            borderRadius: RADII.full,
            paddingVertical: 10,
            paddingHorizontal: 16,
            marginRight: SPACING.sm + 2,
      },
      uploadBtnText: {
            color: COLORS.primaryLight,
            fontSize: 12.5,
            fontWeight: TYPOGRAPHY.extraBold,
            marginLeft: 6,
      },
      orText: {
            fontSize: 11.5,
            color: COLORS.textMuted,
            flexShrink: 1,
      },
      urlInput: {
            backgroundColor: COLORS.surface,
            borderRadius: RADII.md + 2,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingHorizontal: SPACING.md,
            height: 50,
            color: COLORS.text,
            fontSize: 13,
            fontWeight: TYPOGRAPHY.medium,
      },
      preview: {
            width: '100%',
            height: 140,
            borderRadius: RADII.md + 2,
            marginTop: SPACING.sm + 4,
      },
});

export default ScheduleWebinarScreen;