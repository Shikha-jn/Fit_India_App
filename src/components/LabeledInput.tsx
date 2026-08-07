import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { COLORS } from '../theme/theme';

interface LabeledInputProps extends TextInputProps {
      label: string;
      error?: string;
      containerStyle?: object;
      rightElement?: React.ReactNode;
}

const LabeledInput: React.FC<LabeledInputProps> = ({
      label,
      error,
      containerStyle,
      rightElement,
      style,
      ...rest
}) => {
      const [focused, setFocused] = useState(false);

      return (
            <View style={[styles.container, containerStyle]}>
                  <Text style={styles.label}>{label}</Text>
                  <View
                        style={[
                              styles.inputWrap,
                              focused && styles.inputWrapFocused,
                              !!error && styles.inputWrapError,
                        ]}
                  >
                        <TextInput
                              {...rest}
                              placeholderTextColor={COLORS.textMuted}
                              style={[styles.input, style]}
                              onFocus={(e) => {
                                    setFocused(true);
                                    rest.onFocus?.(e);
                              }}
                              onBlur={(e) => {
                                    setFocused(false);
                                    rest.onBlur?.(e);
                              }}
                        />
                        {rightElement}
                  </View>
                  {!!error && <Text style={styles.errorText}>{error}</Text>}
            </View>
      );
};

const styles = StyleSheet.create({
      container: {
            marginBottom: 16,
      },
      label: {
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 0.6,
            color: COLORS.textMuted,
            textTransform: 'uppercase',
            marginBottom: 8,
      },
      inputWrap: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.surface,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingHorizontal: 16,
            height: 52,
      },
      inputWrapFocused: {
            borderColor: COLORS.gold,
            shadowColor: COLORS.gold,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.35,
            shadowRadius: 8,
            elevation: 4,
      },
      inputWrapError: {
            borderColor: COLORS.error,
      },
      input: {
            flex: 1,
            color: COLORS.text,
            fontSize: 14,
            fontWeight: '500',
            padding: 0,
            height: '100%',
      },
      errorText: {
            color: COLORS.error,
            fontSize: 11,
            fontWeight: '600',
            marginTop: 6,
      },
});

export default LabeledInput;