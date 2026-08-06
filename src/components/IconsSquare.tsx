import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../theme/theme';

interface IconSquareProps {
      icon: string;
      size?: number;
      tone?: 'gold' | 'primary';
}

const IconSquare: React.FC<IconSquareProps> = ({ icon, size = 44, tone = 'gold' }) => {
      const colors =
            tone === 'gold'
                  ? [COLORS.goldLight, COLORS.primaryLight]
                  : [COLORS.primaryLight, COLORS.primaryDark];

      return (
            <LinearGradient
                  colors={colors}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[
                        styles.square,
                        { width: size, height: size, borderRadius: size * 0.32 },
                  ]}
            >
                  <Icon name={icon} size={size * 0.46} color={COLORS.text} />
            </LinearGradient>
      );
};

const styles = StyleSheet.create({
      square: {
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
      },
});

export default IconSquare;