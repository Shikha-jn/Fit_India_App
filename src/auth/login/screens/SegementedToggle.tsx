import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, LayoutChangeEvent } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../theme/theme';

export interface SegmentOption<T extends string> {
      value: T;
      label: string;
      icon: string;
}

interface SegmentedToggleProps<T extends string> {
      value: T;
      options: SegmentOption<T>[];
      onChange: (value: T) => void;
}

function SegmentedToggle<T extends string>({
      value,
      options,
      onChange,
}: SegmentedToggleProps<T>) {
      const [containerWidth, setContainerWidth] = useState(0);
      const translateX = useRef(new Animated.Value(0)).current;

      const activeIndex = options.findIndex((o) => o.value === value);

      useEffect(() => {
            if (!containerWidth) return;
            const segmentWidth = containerWidth / options.length;
            Animated.spring(translateX, {
                  toValue: segmentWidth * activeIndex,
                  useNativeDriver: true,
                  friction: 9,
                  tension: 90,
            }).start();
      }, [activeIndex, containerWidth, translateX, options.length]);

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
                                          width: containerWidth / options.length - 6,
                                          transform: [{ translateX }],
                                    },
                              ]}
                        />
                  )}
                  {options.map((option) => {
                        const isActive = option.value === value;
                        return (
                              <Pressable
                                    key={option.value}
                                    style={styles.segment}
                                    onPress={() => onChange(option.value)}
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
}

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

export default SegmentedToggle;