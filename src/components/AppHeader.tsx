import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../theme/theme';

interface AppHeaderProps {
      isSignedIn?: boolean;
      onPressSignIn?: () => void;
      onPressNotifications?: () => void;
      onPressProfile?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({
      isSignedIn,
      onPressSignIn,
      onPressNotifications,
      onPressProfile,
}) => (
      <View style={styles.container}>
            <View style={styles.brandRow}>
                  <View style={styles.logoMark}>
                        <Text style={styles.logoText}>FIWM</Text>
                  </View>
                  <Text style={styles.brandName}>Fit India Women</Text>
            </View>

            <View style={styles.actionsRow}>
                  <Pressable onPress={onPressNotifications} hitSlop={8} style={styles.iconBtn}>
                        <Icon name="notifications-outline" size={20} color={COLORS.text} />
                  </Pressable>
                  <Pressable onPress={onPressSignIn} hitSlop={8}>
                        <View style={styles.avatar}>
                              <Icon name="person" size={16} color={COLORS.text} />
                        </View>
                  </Pressable>
            </View>
      </View>
);

const styles = StyleSheet.create({
      container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingVertical: 14,
            backgroundColor: COLORS.background,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
      },
      brandRow: {
            flexDirection: 'row',
            alignItems: 'center',
      },
      logoMark: {
            width: 34,
            height: 34,
            borderRadius: 10,
            backgroundColor: COLORS.surfaceElevated,
            borderWidth: 1,
            borderColor: COLORS.gold,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
      },
      logoText: {
            color: COLORS.gold,
            fontSize: 9,
            fontWeight: '800',
            letterSpacing: 0.5,
      },
      brandName: {
            color: COLORS.text,
            fontSize: 15,
            fontWeight: '800',
      },
      actionsRow: {
            flexDirection: 'row',
            alignItems: 'center',
      },
      iconBtn: {
            marginRight: 14,
      },
      avatar: {
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center',
      },
      signInPill: {
            paddingVertical: 9,
            paddingHorizontal: 20,
            borderRadius: 999,
      },
      signInText: {
            color: COLORS.text,
            fontSize: 13,
            fontWeight: '800',
      },
});

export default AppHeader;