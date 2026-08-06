import React, { useRef, useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, LayoutChangeEvent } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../theme/theme';
import { RegisterableRole } from '../auth/register/types/register';

interface RoleToggleProps {
      value: RegisterableRole;
      onChange: (role: RegisterableRole) => void;
}

const OPTIONS: { role: RegisterableRole; label: string; icon: string }[] = [
      { role: 'client', label: 'Join as Member', icon: 'person-outline' },
      { role: 'trainer', label: 'Join as Coach/Trainer', icon: 'briefcase-outline' },
];

const RoleToggle: React.FC<RoleToggleProps> = ({ value, onChange }) => {
      const [containerWidth, setContainerWidth] = useState(0);
      const translateX = useRef(new Animated.Value(0)).current;

      const activeIndex = OPTIONS.findIndex((o) => o.role === value);

      useEffect(() => {
            if (!containerWidth) return;
            const segmentWidth = containerWidth / OPTIONS.length;
            Animated.spring(translateX, {
                  toValue: segmentWidth * activeIndex,
                  useNativeDriver: true,
                  friction: 9,
                  tension: 90,
            }).start();
      }, [activeIndex, containerWidth, translateX]);

      const onLayout = (e: LayoutChangeEvent) => {
            setContainerWidth(e.nativeEvent.layout.width);
      };

      return (
            <View style={styles.container} onLayout={onLayout}>
                  {containerWidth > 0 && (
                        <Animated.View
                              style={[
                                    styles.pill,
                                    {
                                          width: containerWidth / OPTIONS.length - 6,
                                          transform: [{ translateX }],
                                    },
                              ]}
                        />
                  )}
                  {OPTIONS.map((option) => {
                        const isActive = option.role === value;
                        return (
                              <Pressable
                                    key={option.role}
                                    style={styles.segment}
                                    onPress={() => onChange(option.role)}
                              >
                                    <Icon
                                          name={option.icon}
                                          size={16}
                                          color={isActive ? COLORS.primary : COLORS.textMuted}
                                          style={styles.segmentIcon}
                                    />
                                    <Text
                                          style={[
                                                styles.segmentLabel,
                                                { color: isActive ? COLORS.primary : COLORS.textMuted },
                                          ]}
                                          numberOfLines={1}
                                    >
                                          {option.label}
                                    </Text>
                              </Pressable>
                        );
                  })}
            </View>
      );
};

const styles = StyleSheet.create({
      container: {
            flexDirection: 'row',
            backgroundColor: COLORS.surface,
            borderRadius: 18,
            padding: 4,
            height: 56,
            borderWidth: 1,
            borderColor: COLORS.border,
      },
      pill: {
            position: 'absolute',
            top: 4,
            left: 4,
            bottom: 4,
            backgroundColor: COLORS.text,
            borderRadius: 14,
            shadowColor: COLORS.gold,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.4,
            shadowRadius: 8,
            elevation: 6,
      },
      segment: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
      },
      segmentIcon: {
            marginRight: 6,
      },
      segmentLabel: {
            fontSize: 13,
            fontWeight: '700',
      },
});

export default RoleToggle;