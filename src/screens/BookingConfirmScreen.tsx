   import React, { useMemo, useState } from 'react';
import { View, ScrollView, Text, Modal, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Lock, ShieldCheck, CreditCard, X, Smartphone } from 'lucide-react-native';
import {
  ScreenBackground,
  ScreenHeader,
  GlassCard,
  PrimaryButton,
  GhostButton,
  Typography,
  Badge,
  Chip,
  SuccessCheck,
  FadeInView,
  SlideUpView,
  PressableScale,
} from '../components/ui';
import { BRAND, SURFACE, TEXT, SEMANTIC } from '../theme/colors';
import { SPACING, RADIUS } from '../theme/spacing';
import { TYPE } from '../theme/typography';
import { VendorMatch, useInquiryStore } from '../store';

const ADVANCE_STEPS = [20, 30, 40, 50];

export default function BookingConfirmScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const vendor: VendorMatch = route.params?.vendor;
  const finalPrice: number = route.params?.finalPrice ?? vendor?.estimatedPrice ?? 25000;
  const inquiryId: string | undefined = route.params?.inquiryId;

  const accept = useInquiryStore((s) => s.accept);

  const [advancePct, setAdvancePct] = useState(30);
  const [payOpen, setPayOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);

  const advance = useMemo(() => Math.round((finalPrice * advancePct) / 100), [finalPrice, advancePct]);
  const balance = finalPrice - advance;
  const platformFee = Math.round(finalPrice * 0.03);

  const openMockPay = () => {
    // Guest guard: completing a booking requires an account.
    const { isGuest } = require('../store').useAuthStore.getState();
    if (isGuest) {
      const { Alert } = require('react-native');
      Alert.alert(
        'Sign in required',
        'Create a free account to book and get the OTP trust shield on your order.',
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'Sign in', onPress: () => navigation.navigate('Login') },
        ]
      );
      return;
    }
    setPayOpen(true);
  };

  const confirmMockPay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setDone(true);
      if (inquiryId) accept(inquiryId);
    }, 1100);
  };

  const closeAll = () => {
    setPayOpen(false);
    setDone(false);
    navigation.popToTop();
    navigation.navigate('Orders');
  };

  if (!vendor) {
    return (
      <ScreenBackground>
        <ScreenHeader title="Confirm Booking" onBack={() => navigation.goBack()} />
        <View style={{ padding: SPACING.base }}>
          <Typography>No vendor selected.</Typography>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <ScreenHeader title="Confirm Booking" subtitle="Lock the price, pay advance" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ padding: SPACING.base, paddingBottom: SPACING['4xl'] }}>
        <FadeInView>
          <GlassCard>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={TYPE.h3}>{vendor.businessName}</Text>
              <Badge label="Locked" tone="success" />
            </View>
            <Text style={[TYPE.caption, { color: TEXT.tertiary, marginTop: 2 }]}>
              Rating {vendor.rating.toFixed(1)} · {vendor.distanceKm.toFixed(1)} km away
            </Text>

            <View style={{ marginTop: SPACING.base, padding: SPACING.md, borderRadius: RADIUS.md, backgroundColor: BRAND[50] }}>
              <Text style={[TYPE.caption, { color: TEXT.tertiary }]}>Final Price</Text>
              <Text style={[TYPE.display, { color: BRAND[700], marginTop: 2 }]}>₹{finalPrice.toLocaleString('en-IN')}</Text>
            </View>
          </GlassCard>
        </FadeInView>

        <SlideUpView delay={100}>
          <GlassCard style={{ marginTop: SPACING.base }}>
            <Text style={TYPE.h4}>Advance Payment</Text>
            <Text style={[TYPE.caption, { color: TEXT.tertiary, marginTop: 2 }]}>
              Platform holds the advance until the job starts with OTP verification.
            </Text>
            <View style={{ flexDirection: 'row', marginTop: SPACING.md }}>
              {ADVANCE_STEPS.map((pct) => (
                <Chip key={pct} label={`${pct}%`} selected={advancePct === pct} onPress={() => setAdvancePct(pct)} />
              ))}
            </View>

            <Row label="Advance now" value={`₹${advance.toLocaleString('en-IN')}`} strong />
            <Row label="Balance before event" value={`₹${balance.toLocaleString('en-IN')}`} />
            <Row label="Platform fee (est.)" value={`₹${platformFee.toLocaleString('en-IN')}`} faint />
          </GlassCard>
        </SlideUpView>

        <SlideUpView delay={180}>
          <GlassCard tier="tier3" style={{ marginTop: SPACING.base, flexDirection: 'row' }}>
            <ShieldCheck size={22} color={SEMANTIC.success} />
            <View style={{ flex: 1, marginLeft: SPACING.md }}>
              <Text style={[TYPE.h4, { color: TEXT.primary }]}>Protected by OTP Trust</Text>
              <Text style={[TYPE.caption, { color: TEXT.tertiary, marginTop: 2 }]}>
                Start OTP when vendor arrives. End OTP when job is complete. Vendor only gets paid after verification.
              </Text>
            </View>
          </GlassCard>
        </SlideUpView>

        <SlideUpView delay={260}>
          <View style={{ marginTop: SPACING.lg }}>
            <PrimaryButton
              title={`Pay ₹${advance.toLocaleString('en-IN')} advance`}
              onPress={openMockPay}
              leftIcon={<Lock size={16} color="#FFF" />}
            />
            <Text style={[TYPE.caption, { color: TEXT.tertiary, textAlign: 'center', marginTop: SPACING.sm }]}>
              Demo mode · no real charge · no payment gateway keys
            </Text>
          </View>
        </SlideUpView>
      </ScrollView>

      <Modal visible={payOpen} animationType="slide" transparent onRequestClose={() => !paying && !done && setPayOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(27,18,48,0.5)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: SURFACE.base, borderTopLeftRadius: RADIUS.xl, borderTopRightRadius: RADIUS.xl, padding: SPACING.lg }}>
            {done ? (
              <View style={{ alignItems: 'center', paddingVertical: SPACING.xl }}>
                <SuccessCheck size={88} color={SEMANTIC.success} />
                <Text style={[TYPE.h2, { marginTop: SPACING.base }]}>Booking confirmed</Text>
                <Text style={[TYPE.body, { color: TEXT.tertiary, textAlign: 'center', marginTop: SPACING.xs }]}>
                  Advance of ₹{advance.toLocaleString('en-IN')} held securely. We will generate your Start and End OTPs.
                </Text>
                <PrimaryButton title="Go to Orders" onPress={closeAll} style={{ marginTop: SPACING.lg }} />
              </View>
            ) : (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.md }}>
                  <Text style={TYPE.h3}>Secure Checkout</Text>
                  <TouchableOpacity onPress={() => !paying && setPayOpen(false)}>
                    <X size={20} color={TEXT.secondary} />
                  </TouchableOpacity>
                </View>
                <GlassCard tier="tier2" padding={SPACING.md}>
                  <Row label="Amount" value={`₹${advance.toLocaleString('en-IN')}`} strong />
                  <Row label="For" value={vendor.businessName} />
                  <Row label="Mode" value="UPI / Card (Demo)" faint />
                </GlassCard>
                <View style={{ flexDirection: 'row', marginTop: SPACING.md }}>
                  <MethodPill icon={<Smartphone size={16} color={BRAND[600]} />} label="UPI" selected />
                  <MethodPill icon={<CreditCard size={16} color={TEXT.tertiary} />} label="Card" />
                </View>
                <PrimaryButton
                  title={paying ? 'Processing...' : `Pay ₹${advance.toLocaleString('en-IN')}`}
                  onPress={confirmMockPay}
                  loading={paying}
                  style={{ marginTop: SPACING.lg }}
                />
                <Text style={[TYPE.caption, { color: TEXT.tertiary, textAlign: 'center', marginTop: SPACING.sm }]}>
                  No charge. Demo only. Real Razorpay comes in Phase C.
                </Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScreenBackground>
  );
}

const Row: React.FC<{ label: string; value: string; strong?: boolean; faint?: boolean }> = ({ label, value, strong, faint }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.sm }}>
    <Text style={[TYPE.body, { color: faint ? TEXT.tertiary : TEXT.secondary }]}>{label}</Text>
    <Text style={[strong ? TYPE.h4 : TYPE.body, { color: strong ? BRAND[700] : TEXT.primary }]}>{value}</Text>
  </View>
);

const MethodPill: React.FC<{ icon: React.ReactNode; label: string; selected?: boolean }> = ({ icon, label, selected }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.base,
      paddingVertical: SPACING.sm,
      borderRadius: RADIUS.full,
      borderWidth: 1.5,
      borderColor: selected ? BRAND[500] : SURFACE.border,
      backgroundColor: selected ? BRAND[50] : SURFACE.subtle,
      marginRight: SPACING.sm,
    }}
  >
    {icon}
    <Text style={[TYPE.label, { color: selected ? BRAND[700] : TEXT.secondary, marginLeft: SPACING.xs }]}>{label}</Text>
  </View>
);
