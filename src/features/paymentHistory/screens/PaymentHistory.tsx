import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, View, StyleSheet, StatusBar, Text, Pressable, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, TYPOGRAPHY, SPACING, RADII } from '../../../theme/theme';
import { Payment, PaymentStatusFilter, PaymentStatus, PaymentMethod } from '../types/paymentHistory';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/RootStackParamList';
import { paymentHistory } from '../../../services/client.service';

const CURRENCY_SYMBOLS: Record<string, string> = {
      INR: '\u20B9',
      USD: '$',
      EUR: '\u20AC',
      GBP: '\u00A3',
};

/** e.g. (100, "INR") -> "\u20B9100" ; falls back to "USD 100" style for unknown currencies. */
export function formatAmount(amount: number, currency: string): string {
      const symbol = CURRENCY_SYMBOLS[currency?.toUpperCase?.()] ?? null;
      const formatted = new Intl.NumberFormat('en-IN').format(amount);
      return symbol ? `${symbol}${formatted}` : `${currency} ${formatted}`;
}

/** e.g. "8/17/2026" */
export function formatShortDate(iso: string): string {
      const date = new Date(iso);
      if (Number.isNaN(date.getTime())) return '\u2014';
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

const PaymentHistoryHeader: React.FC = () => (
      <View style={styles.container}>
            <Text style={styles.title}>Billing & Invoices</Text>
            <Text style={styles.subtitle}>
                  A full record of your payments, webinar purchases, and plan renewals.
            </Text>
      </View>
);

interface PaymentSummaryRowProps {
      payments: Payment[];
}

const PaymentSummaryRow: React.FC<PaymentSummaryRowProps> = ({ payments }) => {
      const { capturedTotal, pendingTotal, currency } = useMemo(() => {
            let captured = 0;
            let pending = 0;
            payments.forEach((p) => {
                  if (p.status === 'captured') captured += p.amount;
                  if (p.status === 'pending') pending += p.amount;
            });
            return {
                  capturedTotal: captured,
                  pendingTotal: pending,
                  currency: payments[0]?.currency ?? 'INR',
            };
      }, [payments]);

      return (
            <View style={styles.row}>
                  <View style={styles.card}>
                        <Text style={styles.label}>Total Captured</Text>
                        <Text style={[styles.value, { color: '#4ADE80' }]}>
                              {formatAmount(capturedTotal, currency)}
                        </Text>
                  </View>
                  <View style={styles.card}>
                        <Text style={styles.label}>Pending</Text>
                        <Text style={[styles.value, { color: COLORS.warning }]}>
                              {formatAmount(pendingTotal, currency)}
                        </Text>
                  </View>
                  <View style={styles.card}>
                        <Text style={styles.label}>Invoices</Text>
                        <Text style={styles.value}>{payments.length}</Text>
                  </View>
            </View>
      );
};

interface FilterOption {
      value: PaymentStatusFilter;
      label: string;
}

const OPTIONS: FilterOption[] = [
      { value: 'all', label: 'All' },
      { value: 'captured', label: 'Captured' },
      { value: 'pending', label: 'Pending' },
      { value: 'failed', label: 'Failed' },
      { value: 'refunded', label: 'Refunded' },
];

interface PaymentFilterTabsProps {
      value: PaymentStatusFilter;
      onChange: (value: PaymentStatusFilter) => void;
      counts: Partial<Record<PaymentStatusFilter, number>>;
}

const PaymentFilterTabs: React.FC<PaymentFilterTabsProps> = ({
      value,
      onChange,
      counts,
}) => (
      <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filrow}
      >
            {OPTIONS.map((opt) => {
                  const isActive = opt.value === value;
                  const count = counts[opt.value];
                  return (
                        <Pressable
                              key={opt.value}
                              onPress={() => onChange(opt.value)}
                              style={[styles.pill, isActive && styles.pillActive]}
                        >
                              <Text style={[styles.fillabel, isActive && styles.labelActive]}>
                                    {opt.label}
                              </Text>
                              {typeof count === 'number' && count > 0 && (
                                    <Text style={[styles.count, isActive && styles.countActive]}>
                                          {count}
                                    </Text>
                              )}
                        </Pressable>
                  );
            })}
      </ScrollView>
);

interface StatusPillProps {
      status: PaymentStatus;
}

const STATUSCONFIG: Record<PaymentStatus, { label: string; color: string; bg: string }> = {
      captured: { label: 'Captured', color: '#4ADE80', bg: 'rgba(34, 197, 94, 0.12)' },
      pending: { label: 'Pending', color: COLORS.warning, bg: 'rgba(245, 158, 11, 0.14)' },
      failed: { label: 'Failed', color: COLORS.error, bg: 'rgba(239, 68, 68, 0.12)' },
      refunded: { label: 'Refunded', color: COLORS.info, bg: 'rgba(59, 130, 246, 0.12)' },
};

const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
      const config = STATUSCONFIG[status];
      return (
            <View style={[styles.statuspill, { backgroundColor: config.bg }]}>
                  <View style={[styles.dot, { backgroundColor: config.color }]} />
                  <Text style={[styles.statuslabel, { color: config.color }]}>{config.label}</Text>
            </View>
      );
};

interface MethodBadgeProps {
      method: PaymentMethod;
}

const CONFIG: Record<PaymentMethod, { label: string; icon: string }> = {
      razorpay: { label: 'Razorpay', icon: 'card-outline' },
      cash: { label: 'Cash', icon: 'cash-outline' },
};

const MethodBadge: React.FC<MethodBadgeProps> = ({ method }) => {
      const config = CONFIG[method];
      return (
            <View style={styles.badge}>
                  <Icon name={config.icon} size={12} color={COLORS.textMuted} />
                  <Text style={styles.bglabel}>{config.label}</Text>
            </View>
      );
};

interface PaymentCardProps {
      payment: Payment;
}

const PaymentCard: React.FC<PaymentCardProps> = ({ payment }) => (
      <View style={styles.paycard}>
            <View style={styles.topRow}>
                  <Text style={styles.planName} numberOfLines={1}>
                        {payment.planName}
                  </Text>
                  <Text style={styles.amount}>{formatAmount(payment.amount, payment.currency)}</Text>
            </View>

            <Text style={styles.orderId} numberOfLines={1}>
                  {payment.orderId}
            </Text>

            <View style={styles.bottomRow}>
                  <View style={styles.bottomLeft}>
                        <MethodBadge method={payment.paymentMethod} />
                        <StatusPill status={payment.status} />
                  </View>
                  <Text style={styles.date}>{formatShortDate(payment.createdAt)}</Text>
            </View>
      </View>
);

interface EmptyPaymentsStateProps {
      title: string;
      message: string;
}

const EmptyPaymentsState: React.FC<EmptyPaymentsStateProps> = ({ title, message }) => (
      <View style={styles.empcontainer}>
            <View style={styles.iconCircle}>
                  <Icon name="receipt-outline" size={28} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptitle}>{title}</Text>
            <Text style={styles.message}>{message}</Text>
      </View>
);
const demoData: Payment[] = [{
      _id: '',
      amount: 0,
      client: '',
      createdAt: '',
      currency: '',
      orderId: '',
      paymentMethod: 'cash',
      planName: '',
      status: 'pending',
      updatedAt: '',
      __v: 0,
      billingEndDate: '',
      billingStartDate: '',
      paymentId: '',
      signature: '',
}]

type PaymentHistoryScreenProps = NativeStackScreenProps<RootStackParamList, 'PaymentHistory'>;

const PaymentHistoryScreen = ({ navigation }: PaymentHistoryScreenProps) => {
      const [payments, setPayments] = useState<Payment[]>(demoData);

      useEffect(() => {
            fetchPayments();
      }, []);
      const fetchPayments = async () => {
            const response = await paymentHistory();
            const pay = response.data;
            setPayments(pay);
      }
      const [refreshing, setrefreshing] = useState(false);
      const [filter, setFilter] = useState<PaymentStatusFilter>('all');

      const counts = useMemo(() => {
            return payments.reduce<Partial<Record<PaymentStatusFilter, number>>>((acc, p) => {
                  acc[p.status] = (acc[p.status] ?? 0) + 1;
                  return acc;
            }, {});
      }, [payments]);

      const filtered = useMemo(() => {
            const list = filter === 'all' ? payments : payments.filter((p) => p.status === filter);
            return [...list].sort(
                  (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            );
      }, [payments, filter]);

      const onRefresh = () => {
            try {
                  setrefreshing(true);
                  fetchPayments();
            } finally {
                  setrefreshing(false);
            }
      }

      return (
            <View style={styles.flex}>
                  <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
                  <FlatList
                        data={filtered}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={
                              <>
                                    <PaymentHistoryHeader />
                                    <PaymentSummaryRow payments={payments} />
                                    <PaymentFilterTabs value={filter} onChange={setFilter} counts={counts} />
                              </>
                        }
                        renderItem={({ item }) => (
                              <View style={styles.cardWrap}>
                                    <PaymentCard payment={item} />
                              </View>
                        )}
                        ListEmptyComponent={
                              <EmptyPaymentsState
                                    title={filter === 'all' ? 'No invoices yet' : `No ${filter} payments`}
                                    message="Your billing history will show up here once a payment is recorded."
                              />
                        }
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                  />
            </View>
      );
};

const styles = StyleSheet.create({
      flex: {
            flex: 1,
            backgroundColor: COLORS.background,
      },
      listContent: {
            paddingBottom: 40,
      },
      cardWrap: {
            paddingHorizontal: 16,
      },
      container: {
            paddingHorizontal: SPACING.md,
            paddingTop: SPACING.lg,
      },
      title: {
            fontSize: 24,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
            marginBottom: SPACING.sm,
      },
      subtitle: {
            fontSize: 13,
            color: COLORS.textMuted,
            lineHeight: 19,
      },
      row: {
            flexDirection: 'row',
            gap: SPACING.sm + 2,
            paddingHorizontal: SPACING.md,
            marginTop: SPACING.md,
      },
      card: {
            flex: 1,
            backgroundColor: COLORS.surface,
            borderRadius: RADII.lg,
            borderWidth: 1,
            borderColor: COLORS.border,
            paddingVertical: SPACING.md,
            paddingHorizontal: SPACING.sm + 2,
            alignItems: 'center',
      },
      label: {
            fontSize: 9.5,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.4,
            textTransform: 'uppercase',
            color: COLORS.textMuted,
            marginBottom: 8,
            textAlign: 'center',
      },
      value: {
            fontSize: 15,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
      },
      filrow: {
            paddingHorizontal: SPACING.md,
            gap: SPACING.sm,
            marginTop: SPACING.md,
            marginBottom: SPACING.sm,
      },
      pill: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 9,
            paddingHorizontal: 14,
            borderRadius: RADII.full,
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.border,
      },
      pillActive: {
            backgroundColor: COLORS.primary,
            borderColor: COLORS.primary,
      },
      fillabel: {
            fontSize: 12.5,
            fontWeight: TYPOGRAPHY.bold,
            color: COLORS.textMuted,
            marginRight: 6,
      },
      labelActive: {
            color: COLORS.text,
      },
      count: {
            fontSize: 11,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.textMuted,
      },
      countActive: {
            color: 'rgba(255,255,255,0.8)',
      },
      paycard: {
            backgroundColor: COLORS.surface,
            borderRadius: RADII.lg,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: SPACING.md,
            marginBottom: SPACING.sm + 4,
      },
      topRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 4,
      },
      planName: {
            flex: 1,
            fontSize: 14.5,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
            marginRight: SPACING.sm,
      },
      amount: {
            fontSize: 15,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.goldLight,
      },
      orderId: {
            fontSize: 11,
            color: COLORS.textMuted,
            fontWeight: TYPOGRAPHY.medium,
            marginBottom: SPACING.sm + 4,
      },
      bottomRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
      },
      bottomLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: SPACING.sm,
      },
      date: {
            fontSize: 11.5,
            color: COLORS.textMuted,
            fontWeight: TYPOGRAPHY.semiBold,
      },
      empcontainer: {
            marginHorizontal: SPACING.md,
            marginTop: SPACING.sm,
            borderRadius: RADII.xl,
            borderWidth: 1.5,
            borderStyle: 'dashed',
            borderColor: COLORS.border,
            paddingVertical: SPACING.xxl - SPACING.xs,
            paddingHorizontal: SPACING.lg,
            alignItems: 'center',
      },
      iconCircle: {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: COLORS.surfaceElevated,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: SPACING.md,
      },
      emptitle: {
            fontSize: 15,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
            marginBottom: SPACING.sm,
      },
      message: {
            fontSize: 12.5,
            color: COLORS.textMuted,
            textAlign: 'center',
            lineHeight: 19,
      },
      statuspill: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            borderRadius: RADII.full,
            paddingVertical: 5,
            paddingHorizontal: 10,
      },
      dot: {
            width: 5,
            height: 5,
            borderRadius: 2.5,
            marginRight: 5,
      },
      statuslabel: {
            fontSize: 10.5,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.3,
      },
      badge: {
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'flex-start',
            backgroundColor: COLORS.surfaceElevated,
            borderRadius: RADII.sm + 2,
            paddingVertical: 4,
            paddingHorizontal: 8,
      },
      bglabel: {
            fontSize: 10.5,
            fontWeight: TYPOGRAPHY.bold,
            color: COLORS.textMuted,
            marginLeft: 4,
      },
});

export default PaymentHistoryScreen;