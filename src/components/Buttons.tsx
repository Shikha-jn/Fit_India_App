import React from 'react';
import { Pressable, Text, StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../theme/theme';

interface ButtonProps {
      label: string;
      icon?: string;
      onPress?: () => void;
      style?: ViewStyle;
}

export const GradientButton: React.FC<ButtonProps> = ({ label, icon, onPress, style }) => (
      <Pressable onPress={onPress} style={[styles.wrap, style]}>
            <LinearGradient
                  colors={[COLORS.goldLight, COLORS.primaryLight]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientFill}
            >
                  <Text style={styles.gradientLabel}>{label}</Text>
                  {!!icon && <Icon name={icon} size={16} color={COLORS.text} style={styles.icon} />}
            </LinearGradient>
      </Pressable>
);

export const OutlineButton: React.FC<ButtonProps> = ({ label, icon, onPress, style }) => (
      <Pressable onPress={onPress} style={[styles.wrap, styles.outline, style]}>
            <Text style={styles.outlineLabel}>{label}</Text>
            {!!icon && <Icon name={icon} size={16} color={COLORS.text} style={styles.icon} />}
      </Pressable>
);

export const SolidButton: React.FC<ButtonProps> = ({ label, icon, onPress, style }) => (
      <Pressable onPress={onPress} style={[styles.wrap, styles.solid, style]}>
            <Text style={styles.gradientLabel}>{label}</Text>
            {!!icon && <Icon name={icon} size={16} color={COLORS.text} style={styles.icon} />}
      </Pressable>
);

const styles = StyleSheet.create({
      wrap: {
            borderRadius: 14,
            overflow: 'hidden',
      },
      gradientFill: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 52,
            paddingHorizontal: 20,
      },
      gradientLabel: {
            color: COLORS.text,
            fontSize: 14,
            fontWeight: '800',
      },
      outline: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 52,
            paddingHorizontal: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
            backgroundColor: COLORS.surfaceElevated,
      },
      outlineLabel: {
            color: COLORS.text,
            fontSize: 14,
            fontWeight: '700',
      },
      solid: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            height: 52,
            paddingHorizontal: 20,
            backgroundColor: COLORS.primary,
      },
      icon: {
            marginLeft: 8,
      },
});