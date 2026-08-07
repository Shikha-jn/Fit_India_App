import React from 'react';
import { View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../../../theme/theme';

interface IconSquareProps {
      icon: string;
      active?: boolean;
      size?: number;
}

const IconSquare: React.FC<IconSquareProps> = ({ icon, active, size = 48 }) => (
      <View
            style={[
                  styles.square,
                  {
                        width: size,
                        height: size,
                        borderRadius: size * 0.32,
                        backgroundColor: active ? COLORS.primary : 'rgba(166, 24, 82, 0.12)',
                  },
            ]}
      >
            <Icon name={icon} size={size * 0.42} color={active ? COLORS.text : COLORS.primary} />
      </View>
);

const styles = StyleSheet.create({
      square: {
            alignItems: 'center',
            justifyContent: 'center',
      },
});

export default IconSquare;