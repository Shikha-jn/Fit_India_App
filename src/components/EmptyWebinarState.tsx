import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../theme/theme';

interface EmptyWebinarStateProps {
      title?: string;
      message?: string;
}

const EmptyWebinarState: React.FC<EmptyWebinarStateProps> = ({
      title = 'No scheduled webinars',
      message = 'Our expert health advisors are designing new live webinars. Check back soon for new schedules on yoga, PCOS care, and healthy eating!',
}) => {
      const float = useRef(new Animated.Value(0)).current;

      useEffect(() => {
            const loop = Animated.loop(
                  Animated.sequence([
                        Animated.timing(float, {
                              toValue: 1,
                              duration: 1400,
                              useNativeDriver: true,
                        }),
                        Animated.timing(float, {
                              toValue: 0,
                              duration: 1400,
                              useNativeDriver: true,
                        }),
                  ]),
            );
            loop.start();
            return () => loop.stop();
      }, [float]);

      const translateY = float.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -6],
      });

      return (
            <View style={styles.container}>
                  <Animated.View style={[styles.iconCircle, { transform: [{ translateY }] }]}>
                        <Icon name="videocam-outline" size={32} color={COLORS.textMuted} />
                  </Animated.View>
                  <Text style={styles.title}>{title}</Text>
                  <Text style={styles.message}>{message}</Text>
            </View>
      );
};

const styles = StyleSheet.create({
      container: {
            marginHorizontal: 20,
            marginTop: 8,
            borderRadius: 24,
            borderWidth: 1.5,
            borderStyle: 'dashed',
            borderColor: COLORS.border,
            paddingVertical: 48,
            paddingHorizontal: 28,
            alignItems: 'center',
      },
      iconCircle: {
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: COLORS.surfaceElevated,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18,
      },
      title: {
            fontSize: 16,
            fontWeight: '800',
            color: COLORS.text,
            marginBottom: 8,
      },
      message: {
            fontSize: 12.5,
            color: COLORS.textMuted,
            textAlign: 'center',
            lineHeight: 19,
      },
});

export default EmptyWebinarState;