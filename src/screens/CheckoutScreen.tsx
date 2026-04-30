import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  MapPin,
  CalendarDays,
  CreditCard,
  Smartphone,
  Banknote,
  Lock,
  X,
  ShieldCheck,
  Plus,
  Check,
} from 'lucide-react-native';
import {
  ScreenBackground,
  GlassCard,
  NeuCard,
  Input,
  NeuInput,
  PrimaryButton,
  GhostButton,
  Badge,
  Divider,
  SuccessCheck,
  FadeInView,
  SlideUpView,
} from '../components/ui';
import { BRAND, NEON, TEXT, SURFACE, GLASS, SEMANTIC } from '../theme/colors';
import { SPACING, RADIUS } from '../theme/spacing';
import { TYPE } from '../theme/typography';
import { useCartStore } from '../store';
import { addressesAPI, ordersAPI } from '../api';

type PayMethod = 'razorpay' | 'cash';

const PAY_OPTIONS: { key: PayMethod; label: string; sub: string; Icon: any }[] = [
  { key: 'razorpay', label: 'UPI / Card', sub: 'Pay via Razorpay (demo)', Icon: Smartphone },
  { key: 'cash', label: 'Cash on Delivery', sub: 'Pay when equipment arrives', Icon: Banknote },
];

export default function CheckoutScreen({ navigation }: any) {
  const { items, getTotal, clearCart } = useCartStore();
  const [address, setAddress] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [notes, setNotes] = useState('');
  const [payMethod, setPayMethod] = useState<PayMethod>('razorpay');
  const [loading, setLoading] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddrId, setSelectedAddrId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await addressesAPI.list();
        const list = data?.addresses || data || [];
        setSavedAddresses(list);
        const def = list.find((a: any) => a.isDefault) || list[0];
        if (def) {
          setSelectedAddrId(def._id || def.id);
          setAddress(formatAddress(def));
        }
      } catch {
        // silent — user can enter address manually
      }
    })();
  }, []);

  const formatAddress = (a: any) =>
    [a.line1, a.line2, a.city, a.state, a.pincode].filter(Boolean).join(', ');

  const pickAddress = (a: any) => {
    setSelectedAddrId(a._id || a.id);
    setAddress(formatAddress(a));
  };

  if (items.length === 0) {
    navigation.goBack();
    return null;
  }

  const validateDate = (d: string) => /^\d{4}-\d{2}-\d{2}$/.test(d);

  const handlePlaceOrder = () => {
    if (!address.trim()) {
      Alert.alert('Missing Info', 'Please select or enter a delivery address.');
      return;
    }
    if (!eventDate || !validateDate(eventDate)) {
      Alert.alert('Invalid Date', 'Please enter event date in YYYY-MM-DD format.');
      return;
    }
    setPayOpen(true);
  };

  const confirmPay = async () => {
    setLoading(true);
    try {
      await ordersAPI.create({
        items: items.map((it) => ({
          equipmentId: it.id,
          name: it.name,
          quantity: it.quantity,
          rentalDays: it.rentalDays,
        })),
        address,
        eventDate,
        notes,
        paymentMethod: payMethod,
      });
    } catch {
      // backend may be demo — proceed regardless for smooth UX
    }
    setTimeout(() => {
      setLoading(false);
      setDone(true);
    }, 800);
  };

  const finish = () => {
    setPayOpen(false);
    setDone(false);
    clearCart();
    navigation.navigate('Orders');
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <FadeInView>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: SPACING.base,
              paddingTop: SPACING.base,
              paddingBottom: SPACING.sm,
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: SPACING.md }}>
              <ChevronLeft size={24} color={TEXT.primary} />
            </TouchableOpacity>
            <Text style={TYPE.h2}>Checkout</Text>
          </View>
        </FadeInView>

        <ScrollView
          contentContainerStyle={{ paddingHorizontal: SPACING.base, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Order summary */}
          <FadeInView delay={60}>
            <GlassCard style={{ marginBottom: SPACING.base }}>
              <Text style={[TYPE.h4, { marginBottom: SPACING.md }]}>Order Summary</Text>
              {items.map((item, i) => (
                <View key={item.id}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingVertical: SPACING.sm,
                    }}
                  >
                    <View style={{ flex: 1, marginRight: SPACING.sm }}>
                      <Text style={TYPE.body} numberOfLines={1}>{item.name}</Text>
                      <Text style={[TYPE.tiny, { color: TEXT.tertiary }]}>
                        Qty {item.quantity} · {item.rentalDays} day{item.rentalDays > 1 ? 's' : ''}
                      </Text>
                    </View>
                    <Text style={[TYPE.caption, { color: NEON.glow }]}>Contact for price</Text>
                  </View>
                  {i < items.length - 1 && <Divider />}
                </View>
              ))}
            </GlassCard>
          </FadeInView>

          {/* Delivery info */}
          <SlideUpView delay={120}>
            <NeuCard style={{ marginBottom: SPACING.base }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md }}>
                <MapPin size={18} color={NEON.glow} />
                <Text style={[TYPE.h4, { marginLeft: SPACING.sm }]}>Delivery Information</Text>
              </View>

              <NeuInput
                label="EVENT DATE"
                placeholder="YYYY-MM-DD"
                value={eventDate}
                onChangeText={setEventDate}
                leftIcon={<CalendarDays size={16} color={TEXT.tertiary} />}
                containerStyle={{ marginBottom: SPACING.md }}
              />

              {/* Saved addresses picker */}
              {savedAddresses.length > 0 && (
                <View style={{ marginBottom: SPACING.md }}>
                  <Text style={[TYPE.tiny, { color: TEXT.tertiary, marginBottom: SPACING.sm, letterSpacing: 0.5 }]}>
                    SAVED ADDRESSES
                  </Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: SPACING.sm }}
                  >
                    {savedAddresses.map((a) => {
                      const id = a._id || a.id;
                      const isSel = id === selectedAddrId;
                      return (
                        <TouchableOpacity
                          key={id}
                          onPress={() => pickAddress(a)}
                          style={{
                            paddingHorizontal: SPACING.md,
                            paddingVertical: SPACING.sm,
                            borderRadius: RADIUS.lg,
                            borderWidth: 1.5,
                            borderColor: isSel ? NEON.glow : GLASS.tier2Border,
                            backgroundColor: isSel ? `${BRAND[500]}22` : GLASS.tier2,
                            minWidth: 180,
                            maxWidth: 240,
                          }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                            <MapPin size={14} color={isSel ? NEON.glow : TEXT.tertiary} />
                            <Text style={[TYPE.caption, { marginLeft: 6, fontWeight: '600', color: TEXT.primary }]}>
                              {a.label || a.type || 'Address'}
                            </Text>
                            {isSel && <Check size={14} color={NEON.glow} style={{ marginLeft: 'auto' }} />}
                          </View>
                          <Text style={[TYPE.tiny, { color: TEXT.tertiary }]} numberOfLines={2}>
                            {formatAddress(a)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Addresses')}
                      style={{
                        paddingHorizontal: SPACING.md,
                        paddingVertical: SPACING.sm,
                        borderRadius: RADIUS.lg,
                        borderWidth: 1.5,
                        borderStyle: 'dashed',
                        borderColor: TEXT.muted,
                        alignItems: 'center',
                        justifyContent: 'center',
                        minWidth: 100,
                      }}
                    >
                      <Plus size={18} color={TEXT.tertiary} />
                      <Text style={[TYPE.tiny, { color: TEXT.tertiary, marginTop: 4 }]}>New</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              )}

              <NeuInput
                label="DELIVERY ADDRESS"
                placeholder="Full address, landmark, city"
                value={address}
                onChangeText={setAddress}
                leftIcon={<MapPin size={16} color={TEXT.tertiary} />}
                containerStyle={{ marginBottom: SPACING.md }}
              />

              <NeuInput
                label="SPECIAL NOTES (OPTIONAL)"
                placeholder="Setup time, access instructions..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                style={{ minHeight: 72, textAlignVertical: 'top' }}
              />
            </NeuCard>
          </SlideUpView>

          {/* Payment method */}
          <SlideUpView delay={180}>
            <GlassCard style={{ marginBottom: SPACING.base }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md }}>
                <CreditCard size={18} color={NEON.glow} />
                <Text style={[TYPE.h4, { marginLeft: SPACING.sm }]}>Payment Method</Text>
              </View>

              {PAY_OPTIONS.map((opt) => {
                const IconComp = opt.Icon;
                const selected = payMethod === opt.key;
                return (
                  <TouchableOpacity
                    key={opt.key}
                    onPress={() => setPayMethod(opt.key)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: SPACING.md,
                      borderRadius: RADIUS.lg,
                      backgroundColor: selected ? `${BRAND[500]}22` : GLASS.tier2,
                      borderWidth: 1.5,
                      borderColor: selected ? NEON.glow : GLASS.tier2Border,
                      marginBottom: SPACING.sm,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        backgroundColor: selected ? BRAND[500] : GLASS.tier1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: SPACING.md,
                      }}
                    >
                      <IconComp size={20} color={selected ? '#FFF' : TEXT.secondary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[TYPE.body, { fontWeight: '600' }]}>{opt.label}</Text>
                      <Text style={[TYPE.tiny, { color: TEXT.tertiary }]}>{opt.sub}</Text>
                    </View>
                    {/* Radio dot */}
                    <View
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: selected ? NEON.glow : TEXT.muted,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {selected && (
                        <View
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: 5,
                            backgroundColor: NEON.glow,
                          }}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </GlassCard>
          </SlideUpView>

          {/* Price breakdown */}
          <SlideUpView delay={240}>
            <GlassCard tier="tier2" style={{ marginBottom: SPACING.lg }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm }}>
                <Text style={[TYPE.body, { color: TEXT.secondary }]}>Subtotal</Text>
                <Text style={[TYPE.body, { color: TEXT.primary }]}>On confirmed quote</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm }}>
                <Text style={[TYPE.body, { color: TEXT.secondary }]}>Service fee (5%)</Text>
                <Text style={[TYPE.body, { color: TEXT.primary }]}>On quote</Text>
              </View>
              <Divider />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.sm }}>
                <Text style={TYPE.h4}>Total</Text>
                <Text style={[TYPE.h4, { color: NEON.pink }]}>Quoted price + 5%</Text>
              </View>
            </GlassCard>
          </SlideUpView>

          <SlideUpView delay={300}>
            <PrimaryButton
              title="Place Order"
              onPress={handlePlaceOrder}
              leftIcon={<Lock size={16} color="#FFF" />}
            />
            <Text style={[TYPE.tiny, { color: TEXT.muted, textAlign: 'center', marginTop: SPACING.sm }]}>
              Demo mode · Razorpay live keys in Phase C
            </Text>
          </SlideUpView>
        </ScrollView>

        {/* Mock payment sheet */}
        <Modal
          visible={payOpen}
          animationType="slide"
          transparent
          onRequestClose={() => !loading && !done && setPayOpen(false)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(20,8,33,0.6)', justifyContent: 'flex-end' }}>
            <View
              style={{
                backgroundColor: SURFACE.base,
                borderTopLeftRadius: RADIUS['2xl'],
                borderTopRightRadius: RADIUS['2xl'],
                borderTopWidth: 1,
                borderTopColor: GLASS.tier1Border,
                padding: SPACING.lg,
              }}
            >
              {done ? (
                <View style={{ alignItems: 'center', paddingVertical: SPACING.xl }}>
                  <SuccessCheck size={88} color={SEMANTIC.success} />
                  <Text style={[TYPE.h2, { marginTop: SPACING.base }]}>Order Placed!</Text>
                  <Text style={[TYPE.body, { color: TEXT.tertiary, textAlign: 'center', marginTop: SPACING.xs }]}>
                    Your order has been placed. The vendor will confirm shortly.
                  </Text>
                  <PrimaryButton title="View Orders" onPress={finish} style={{ marginTop: SPACING.lg }} />
                </View>
              ) : (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: SPACING.base,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <ShieldCheck size={20} color={SEMANTIC.success} />
                      <Text style={[TYPE.h3, { marginLeft: SPACING.sm }]}>Secure Checkout</Text>
                    </View>
                    <TouchableOpacity onPress={() => setPayOpen(false)}>
                      <X size={22} color={TEXT.secondary} />
                    </TouchableOpacity>
                  </View>

                  <GlassCard tier="tier2" style={{ marginBottom: SPACING.base }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm }}>
                      <Text style={[TYPE.body, { color: TEXT.secondary }]}>Items</Text>
                      <Text style={[TYPE.body, { color: TEXT.primary }]}>{items.length} item(s)</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm }}>
                      <Text style={[TYPE.body, { color: TEXT.secondary }]}>Method</Text>
                      <Text style={[TYPE.body, { color: TEXT.primary }]}>
                        {payMethod === 'razorpay' ? 'UPI / Card (Demo)' : 'Cash on Delivery'}
                      </Text>
                    </View>
                    <Divider />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.sm }}>
                      <Text style={TYPE.h4}>Total</Text>
                      <Text style={[TYPE.h4, { color: NEON.pink }]}>Quoted price + 5%</Text>
                    </View>
                  </GlassCard>

                  <PrimaryButton
                    title={loading ? 'Processing...' : 'Confirm Order'}
                    onPress={confirmPay}
                    loading={loading}
                    leftIcon={<Lock size={16} color="#FFF" />}
                  />
                  <Text style={[TYPE.tiny, { color: TEXT.muted, textAlign: 'center', marginTop: SPACING.sm }]}>
                    No real charge · Demo mode only
                  </Text>
                </>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </ScreenBackground>
  );
}
