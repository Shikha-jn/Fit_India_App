import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons'

interface MenuRowProps {
      icon: string;
      label: string;
      value?: string;
      destructive?: boolean;
      onPress?: () => void;
      isLast?: boolean;
}

const MenuRow: React.FC<MenuRowProps> = ({
      icon,
      label,
      value,
      destructive,
      onPress,
      isLast,
}) => (
      <Pressable
            onPress={onPress}
            style={[styles.row, !isLast && styles.rowDivider]}
      >
            <View
                  style={[
                        styles.iconCircle,
                        { backgroundColor: destructive ? 'rgba(239, 68, 68, 0.12)' : COLORS.surfaceElevated },
                  ]}
            >
                  <Icon name={icon} size={16} color={destructive ? COLORS.error : COLORS.gold} />
            </View>
            <Text style={[styles.label, destructive && styles.labelDestructive]}>
                  {label}
            </Text>
            {!!value && <Text style={styles.value}>{value}</Text>}
            {!destructive && (
                  <Icon name="chevron-forward" size={16} color={COLORS.textMuted} />
            )}
      </Pressable>
);

interface MenuSectionProps {
      onViewAttendance?: () => void;
      onChangePassword?: () => void;
      onSubscription?: () => void;
      onPrivacySecurity?: () => void;
      onHelpSupport?: () => void;
      onLogout?: () => void;
      onPayment?: () => void;
}

const MenuSection: React.FC<MenuSectionProps> = ({
      onViewAttendance,
      onChangePassword,
      onSubscription,
      onPrivacySecurity,
      onHelpSupport,
      onLogout,
      onPayment
}) => (
      <>
            <View style={styles.card}>
                  <MenuRow icon="person-outline" label="Attendance" onPress={onViewAttendance} />
                  <MenuRow
                        icon="lock-closed-outline"
                        label="Change Password"
                        onPress={onChangePassword}
                  />
                  <MenuRow
                        icon="notifications-outline"
                        label="Subscription Plans"
                        onPress={onSubscription}
                  />
                  <MenuRow
                        icon="help-circle-outline"
                        label="Payment history"
                        onPress={onPayment}
                  />
                  <MenuRow
                        icon="help-circle-outline"
                        label="Help & FAQs"
                        onPress={onHelpSupport}
                        isLast
                  />
            </View>

            <View style={[styles.card, styles.logoutCard, { marginBottom: SPACING.xl }]}>
                  <MenuRow
                        icon="log-out-outline"
                        label="Log Out"
                        destructive
                        onPress={onLogout}
                        isLast
                  />
            </View>
      </>
);

const styles = StyleSheet.create({
      card: {
            backgroundColor: COLORS.surface,
            borderRadius: RADII.lg,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingHorizontal: SPACING.md,
            marginHorizontal: SPACING.md,
            marginTop: SPACING.sm + 4,
      },
      logoutCard: {
            marginTop: SPACING.md,
      },
      row: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: SPACING.md - 2,
      },
      rowDivider: {
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
      },
      iconCircle: {
            width: 34,
            height: 34,
            borderRadius: RADII.md,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: SPACING.md - 2,
      },
      label: {
            flex: 1,
            fontSize: 14,
            fontWeight: TYPOGRAPHY.semiBold,
            color: COLORS.text,
      },
      labelDestructive: {
            color: COLORS.error,
            fontWeight: TYPOGRAPHY.bold,
      },
      value: {
            fontSize: 12.5,
            fontWeight: TYPOGRAPHY.medium,
            color: COLORS.textMuted,
            marginRight: SPACING.sm,
      },
});

export default MenuSection;