import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, StatusBar, View, Text, Pressable } from 'react-native';
import { Plan } from '../types/subscription';
import Icon from 'react-native-vector-icons/Ionicons';
import RazorpayCheckout, {
      CheckoutOptions,
      SuccessResponse,
      ErrorResponse,
} from 'react-native-razorpay';
import { privateClient, RAZORPAY_KEY } from '../../../services/apiClients';
import { useAuthStore } from '../../../store/useAuthStore';
import { COLORS, SPACING, RADII, TYPOGRAPHY } from '../../../theme/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../types/RootStackParamList';
import { getSubscription } from '../../../services/client.service';
import { useAlert } from '../../../context/AlertContext';

const demoData: Plan[] = [{
      _id: '',
      description: '',
      durationDays: 0,
      features: [],
      name: '',
      price: 0,
      createdAt: '',
      updatedAt: '',
      __v: 0,
}]

type SubscriptionScreenProps = NativeStackScreenProps<RootStackParamList, 'Subscription'>;

export function formatPrice(price: number): string {
      return new Intl.NumberFormat('en-IN').format(price);
}
const PopularRibbon: React.FC = () => (
      <View style={styles.ribbon}>
            <Text style={styles.text}>POPULAR</Text>
      </View>
);

interface PlanCardProps {
      plan: Plan;
      isPopular?: boolean;
      onSubscribe?: (plan: Plan) => void;
}

const PlanCard: React.FC<PlanCardProps> = ({ plan, isPopular, onSubscribe }) => (
      <View style={[styles.card, isPopular && styles.cardPopular]}>
            {isPopular && <PopularRibbon />}

            <View style={styles.header}>
                  <Icon name="sparkles" size={15} color={COLORS.primaryLight} />
                  <Text style={styles.name}>{plan.name}</Text>
            </View>
            <Text style={styles.description}>{plan.description}</Text>

            <View style={styles.priceRow}>
                  <Text style={styles.currency}>₹</Text>
                  <Text style={styles.price}>{formatPrice(plan.price)}</Text>
                  <Text style={styles.duration}> / {plan.durationDays} days</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.featureList}>
                  {plan.features.map((feature, index) => (
                        <View key={`${plan._id}-${index}`} style={styles.featureRow}>
                              <View style={styles.featureDot} />
                              <Text style={styles.featureText}>{feature}</Text>
                        </View>
                  ))}
            </View>

            <Pressable
                  onPress={() => onSubscribe?.(plan)}
                  style={[styles.subscribeBtn, isPopular && styles.subscribeBtnPopular]}
            >
                  <Text style={styles.subscribeBtnText}>Subscribe Now</Text>
            </Pressable>
      </View>
);

const SubscriptionHeader: React.FC = () => (
      <View style={styles.container}>
            <Text style={styles.title}>Membership Plans</Text>
            <Text style={styles.subtitle}>
                  Unlock personalized diet programs, workout sheets, and priority
                  contact with certified prenatal/postnatal coaches.
            </Text>
      </View>
);

const EmptyPlansState: React.FC = () => (
      <View style={styles.empcontainer}>
            <View style={styles.iconCircle}>
                  <Icon name="pricetags-outline" size={28} color={COLORS.textMuted} />
            </View>
            <Text style={styles.emptitle}>No plans available right now</Text>
            <Text style={styles.message}>
                  Check back soon — new membership plans are on the way.
            </Text>
      </View>
);

const SubscriptionScreen = ({ navigation }: SubscriptionScreenProps) => {
      const { user } = useAuthStore();
      const [plans, setPlans] = useState<Plan[]>(demoData);
      const alert = useAlert();
      useEffect(() => {
            getSubsPlans();
      }, []);
      const getSubsPlans = async () => {
            const response = await getSubscription();
            const subsPlans = response.data;
            setPlans(subsPlans);
      }
      const resolvedPopularId = useMemo(() => {
            // if (popularPlanId !== undefined) return popularPlanId;
            if (plans.length === 0) return null;
            return plans.reduce((max, plan) => (plan.price > max.price ? plan : max), plans[0])
                  ._id;
      }, [plans]);

      const onSubscribe = async (plan: Plan) => {

            const order = await privateClient.post(`payments/create-order`, plan);
            console.log('order res:', order.data);
            if (order === null) {
                  alert.error('Failed',
                        'Unable to create order. Please try again.')
            }

            const options: CheckoutOptions = {
                  order_id: order.data?.orderId || '',
                  description: `Payment for Subscription`,
                  currency: 'INR',
                  key: RAZORPAY_KEY,
                  amount: Math.round(plan.price * 100), // Razorpay expects amount in paise
                  name: 'FitIndia',
                  prefill: {
                        name: user?.name || '',
                        email: user?.email || '',
                        contact: user?.phone || '',
                  },
                  theme: { color: COLORS.primary },
            };

            RazorpayCheckout.open(options)
                  .then((data: SuccessResponse) => {
                        if (data) {
                              alert.success('Payment Successfull');
                        }
                  })
                  .catch((error: ErrorResponse) => {
                        if (error) {
                              alert.error(error.description || 'Something went wrong');
                              console.log('error:', error);
                        } else {
                              alert.error('Payment Failed', 'Something went wrong');
                        }
                  });

      };

      return (
            <View style={styles.flex}>
                  <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
                  <FlatList
                        data={plans}
                        keyExtractor={(item) => item._id}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                        ListHeaderComponent={<SubscriptionHeader />}
                        renderItem={({ item }) => (
                              <PlanCard
                                    plan={item}
                                    isPopular={item._id === resolvedPopularId}
                                    onSubscribe={() => { onSubscribe(item) }}
                              />
                        )}
                        ListEmptyComponent={<EmptyPlansState />}
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
            padding: SPACING.md + 4,
            paddingBottom: SPACING.xxl,
      },
      card: {
            backgroundColor: COLORS.surface,
            borderRadius: RADII.xl,
            borderWidth: 1,
            borderColor: COLORS.border,
            padding: SPACING.lg - 4,
            marginBottom: SPACING.lg,
            overflow: 'hidden',
      },
      cardPopular: {
            borderColor: COLORS.primary,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.4,
            shadowRadius: 18,
            elevation: 8,
      },
      header: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 6,
      },
      name: {
            fontSize: 17,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.text,
            marginLeft: SPACING.sm - 2,
      },
      description: {
            fontSize: 13,
            color: COLORS.textMuted,
            marginBottom: SPACING.md,
      },
      priceRow: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            marginBottom: SPACING.md,
      },
      currency: {
            fontSize: 18,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.primaryLight,
            marginRight: 2,
            marginBottom: 3,
      },
      price: {
            fontSize: 30,
            fontWeight: TYPOGRAPHY.extraBold,
            color: COLORS.primaryLight,
            lineHeight: 34,
      },
      duration: {
            fontSize: 13,
            color: COLORS.textMuted,
            fontWeight: TYPOGRAPHY.medium,
            marginBottom: 5,
      },
      divider: {
            height: 1,
            backgroundColor: COLORS.border,
            marginBottom: SPACING.md,
      },
      featureList: {
            marginBottom: SPACING.lg - 4,
      },
      featureRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: SPACING.sm,
      },
      featureDot: {
            width: 5,
            height: 5,
            borderRadius: 2.5,
            backgroundColor: COLORS.primaryLight,
            marginRight: SPACING.sm,
      },
      featureText: {
            fontSize: 13,
            color: COLORS.textSecondary,
            fontWeight: TYPOGRAPHY.medium,
            flexShrink: 1,
      },
      subscribeBtn: {
            height: 52,
            borderRadius: RADII.full,
            backgroundColor: COLORS.primary,
            alignItems: 'center',
            justifyContent: 'center',
      },
      subscribeBtnPopular: {
            backgroundColor: COLORS.primaryDark,
            shadowColor: COLORS.primary,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.5,
            shadowRadius: 12,
            elevation: 6,
      },
      subscribeBtnText: {
            color: COLORS.text,
            fontSize: 14.5,
            fontWeight: TYPOGRAPHY.extraBold,
      },
      container: {
            marginBottom: SPACING.lg,
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
            lineHeight: 20,
      },
      empcontainer: {
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
      ribbon: {
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: COLORS.primary,
            borderTopRightRadius: 20,
            borderBottomLeftRadius: 14,
            paddingVertical: 6,
            paddingHorizontal: 14,
      },
      text: {
            color: COLORS.text,
            fontSize: 10,
            fontWeight: TYPOGRAPHY.extraBold,
            letterSpacing: 0.6,
      },
});

export default SubscriptionScreen;