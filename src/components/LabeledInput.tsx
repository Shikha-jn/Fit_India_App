import { useState, useRef } from 'react';
import {
  Animated,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../theme/theme'; // adjust path as needed

interface LabeledInputProps {
  label: string;
  placeholder: string;
  icon: string;
  value: string;
  onChangeText: (t: string) => void;
  error?: string;
  keyboardType?: any;
  autoCapitalize?: any;
  secureTextEntry?: boolean;
  trailingIcon?: string;
  onTrailingPress?: () => void;
  maxLength?: number;
}

export default function LabeledInput({
  label,
  placeholder,
  icon,
  value,
  onChangeText,
  error,
  keyboardType = 'default',
  autoCapitalize = 'none',
  secureTextEntry = false,
  trailingIcon,
  onTrailingPress,
  maxLength,
}: LabeledInputProps) {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  const onFocus = () => {
    setFocused(true);
    Animated.spring(borderAnim, {
      toValue: 1,
      useNativeDriver: false,
      speed: 28,
    }).start();
  };
  const onBlur = () => {
    setFocused(false);
    Animated.spring(borderAnim, {
      toValue: 0,
      useNativeDriver: false,
      speed: 28,
    }).start();
  };

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      error ? COLORS.error : COLORS.border,
      error ? COLORS.error : COLORS.primary,
    ],
  });

  return (
    <View style={fStyles.wrap}>
      <Text style={fStyles.label}>{label}</Text>
      <Animated.View
        style={[fStyles.row, { borderColor }, focused && fStyles.rowFocused]}
      >
        <Ionicons
          name={icon as any}
          size={18}
          color={
            focused ? COLORS.primary : error ? COLORS.error : COLORS.textMuted
          }
          style={fStyles.icon}
        />
        <TextInput
          style={fStyles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textMuted}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          secureTextEntry={secureTextEntry}
          maxLength={maxLength}
        />
        {trailingIcon && (
          <TouchableOpacity onPress={onTrailingPress} style={fStyles.trailing}>
            <Ionicons
              name={trailingIcon as any}
              size={18}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        )}
      </Animated.View>
      {!!error && (
        <View style={fStyles.errorRow}>
          <Ionicons name="alert-circle" size={12} color={COLORS.error} />
          <Text style={fStyles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const fStyles = StyleSheet.create({
  wrap: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: 11,
    fontWeight: TYPOGRAPHY.bold,
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 7,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    height: 54,
    paddingHorizontal: SPACING.md,
  },
  rowFocused: {
    backgroundColor: COLORS.surfaceElevated,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
  trailing: {
    padding: 4,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 5,
  },
  errorText: {
    fontSize: 11,
    color: COLORS.error,
    fontWeight: TYPOGRAPHY.semiBold,
  },
});
