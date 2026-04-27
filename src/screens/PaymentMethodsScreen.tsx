import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  useWindowDimensions,
  Modal,
  TextInput,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronLeft,
  CreditCard,
  Plus,
  Smartphone,
  Wallet,
  Shield,
  X,
  CheckCircle2,
  Trash2,
} from 'lucide-react-native';
import {
  LightScreenBackground,
  LightCard,
  FadeInView,
  LIGHT,
  SPACING,
  RADIUS,
  TYPE,
  SEMANTIC,
} from '../components/ui';
import { useAuthStore } from '../store';

type Method = {
  id: string;
  type: 'upi' | 'card' | 'wallet';
  label: string;
  detail: string;
  isDefault?: boolean;
};

// Payment method tokens are stored locally as demo until a PCI-compliant
// payment provider vault (Razorpay/Stripe) is integrated. Nothing sensitive
// like full card numbers ever touches the device or the server.
export default function PaymentMethodsScreen({ navigation }: any) {
  const { width } = useWindowDimensions();
  const { isGuest } = useAuthStore();
  const [methods, setMethods] = useState<Method[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [pickedType, setPickedType] = useState<'upi' | 'card' | 'wallet'>(
    'upi'
  );
  const [form, setForm] = useState({ label: '', detail: '' });
  const [saving, setSaving] = useState(false);

  const cardPadding = width < 360 ? SPACING.md : SPACING.base;

  const openAdd = (t: 'upi' | 'card' | 'wallet') => {
    if (isGuest) {
      Alert.alert(
        'Sign in required',
        'Create a free account to save payment methods.',
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'Sign in', onPress: () => navigation.navigate('Login') },
        ]
      );
      return;
    }
    setPickedType(t);
    setForm({
      label: t === 'upi' ? 'My UPI' : t === 'card' ? 'My Card' : 'My Wallet',
      detail: '',
    });
    setModalOpen(true);
  };

  const validate = () => {
    if (!form.detail.trim()) {
      return pickedType === 'upi'
        ? 'Enter your UPI ID (e.g. name@okaxis)'
        : pickedType === 'card'
        ? 'Enter last 4 digits of your card'
        : 'Enter your wallet number';
    }
    if (pickedType === 'upi' && !/^[\w.\-]+@[\w]+$/.test(form.detail.trim()))
      return 'Enter a valid UPI ID like name@bank';
    if (pickedType === 'card' && !/^\d{4}$/.test(form.detail.trim()))
      return 'Enter only the last 4 digits';
    return null;
  };

  const save = () => {
    const err = validate();
    if (err) return Alert.alert('Check details', err);
    setSaving(true);
    const next: Method = {
      id: `m_${Date.now()}`,
      type: pickedType,
      label: form.label.trim() || pickedType.toUpperCase(),
      detail: form.detail.trim(),
      isDefault: methods.length === 0,
    };
    setTimeout(() => {
      setMethods((m) => [...m, next]);
      setSaving(false);
      setModalOpen(false);
    }, 250);
  };

  const remove = (id: string) =>
    Alert.alert('Remove payment method?', 'You can re-add it anytime.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () =>
          setMethods((m) => {
            const filtered = m.filter((x) => x.id !== id);
            if (filtered.length && !filtered.some((x) => x.isDefault)) {
              filtered[0].isDefault = true;
            }
            return filtered;
          }),
      },
    ]);

  const setDefault = (id: string) =>
    setMethods((m) => m.map((x) => ({ ...x, isDefault: x.id === id })));

  const TypeCard = ({
    icon: Icon,
    title,
    subtitle,
    onPress,
  }: any) => (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flex: 1,
        backgroundColor: LIGHT.card,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        borderWidth: 1,
        borderColor: LIGHT.border,
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          backgroundColor: LIGHT.accentSoft,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 6,
        }}
      >
        <Icon size={20} color={LIGHT.accent} />
      </View>
      <Text
        style={{ color: LIGHT.text, fontWeight: '700', fontSize: 13 }}
        numberOfLines={1}
      >
        {title}
      </Text>
      <Text
        style={{
          color: LIGHT.textTertiary,
          fontSize: 10,
          marginTop: 2,
          textAlign: 'center',
        }}
        numberOfLines={1}
      >
        {subtitle}
      </Text>
    </TouchableOpacity>
  );

  return (
    <LightScreenBackground>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: SPACING.base,
            paddingTop: SPACING.sm,
            paddingBottom: SPACING.md,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={12}
            style={{ padding: 4, marginRight: 4 }}
          >
            <ChevronLeft size={26} color={LIGHT.text} />
          </TouchableOpacity>
          <Text style={[TYPE.h2, { color: LIGHT.text, letterSpacing: -0.3 }]}>
            Payment Methods
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: SPACING.base,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Secure banner */}
          <FadeInView>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: LIGHT.accentSoft,
                padding: SPACING.md,
                borderRadius: RADIUS.md,
                marginBottom: SPACING.base,
              }}
            >
              <Shield size={18} color={LIGHT.accent} />
              <Text
                style={{
                  color: LIGHT.text,
                  fontSize: 12,
                  marginLeft: 8,
                  flex: 1,
                  lineHeight: 16,
                }}
              >
                Your payment info is encrypted. Full card numbers are never
                stored on this device or on our servers.
              </Text>
            </View>
          </FadeInView>

          {/* Add method options */}
          <Text
            style={{
              color: LIGHT.textTertiary,
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 0.6,
              marginBottom: 8,
            }}
          >
            ADD NEW METHOD
          </Text>
          <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
            <TypeCard
              icon={Smartphone}
              title="UPI"
              subtitle="PhonePe, GPay, Paytm"
              onPress={() => openAdd('upi')}
            />
            <TypeCard
              icon={CreditCard}
              title="Card"
              subtitle="Credit / Debit"
              onPress={() => openAdd('card')}
            />
            <TypeCard
              icon={Wallet}
              title="Wallet"
              subtitle="Paytm, Amazon Pay"
              onPress={() => openAdd('wallet')}
            />
          </View>

          {/* Saved methods */}
          <Text
            style={{
              color: LIGHT.textTertiary,
              fontSize: 11,
              fontWeight: '700',
              letterSpacing: 0.6,
              marginTop: SPACING.lg,
              marginBottom: 8,
            }}
          >
            SAVED METHODS
          </Text>

          {methods.length === 0 ? (
            <LightCard padding={cardPadding} style={{ alignItems: 'center' }}>
              <CreditCard size={26} color={LIGHT.accent} />
              <Text
                style={[
                  TYPE.body,
                  {
                    color: LIGHT.text,
                    marginTop: 6,
                    fontWeight: '700',
                  },
                ]}
              >
                No saved payment methods
              </Text>
              <Text
                style={[
                  TYPE.caption,
                  {
                    color: LIGHT.textTertiary,
                    textAlign: 'center',
                    marginTop: 4,
                  },
                ]}
              >
                Pick a type above to save a method for faster checkout.
              </Text>
            </LightCard>
          ) : (
            methods.map((m, idx) => {
              const Icon =
                m.type === 'upi' ? Smartphone : m.type === 'card' ? CreditCard : Wallet;
              return (
                <FadeInView key={m.id} delay={idx * 40}>
                  <LightCard
                    padding={cardPadding}
                    style={{
                      marginBottom: SPACING.sm,
                      borderWidth: m.isDefault ? 1.5 : 0,
                      borderColor: m.isDefault ? LIGHT.accent : 'transparent',
                    }}
                  >
                    <View
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 10,
                          backgroundColor: LIGHT.accentSoft,
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: SPACING.md,
                        }}
                      >
                        <Icon size={18} color={LIGHT.accent} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            TYPE.body,
                            { color: LIGHT.text, fontWeight: '700' },
                          ]}
                          numberOfLines={1}
                        >
                          {m.label}
                        </Text>
                        <Text
                          style={[
                            TYPE.caption,
                            { color: LIGHT.textTertiary, marginTop: 2 },
                          ]}
                          numberOfLines={1}
                        >
                          {m.type === 'card'
                            ? `•••• •••• •••• ${m.detail}`
                            : m.detail}
                        </Text>
                      </View>
                      {m.isDefault ? (
                        <View
                          style={{
                            paddingHorizontal: 8,
                            paddingVertical: 3,
                            borderRadius: RADIUS.full,
                            backgroundColor: LIGHT.accentSoft,
                            marginRight: 6,
                          }}
                        >
                          <Text
                            style={{
                              color: LIGHT.accent,
                              fontSize: 10,
                              fontWeight: '800',
                            }}
                          >
                            DEFAULT
                          </Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => setDefault(m.id)}
                          hitSlop={8}
                          style={{ marginRight: 10 }}
                        >
                          <Text
                            style={{
                              color: LIGHT.accent,
                              fontSize: 12,
                              fontWeight: '700',
                            }}
                          >
                            Set default
                          </Text>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        onPress={() => remove(m.id)}
                        hitSlop={8}
                      >
                        <Trash2 size={16} color={SEMANTIC.error} />
                      </TouchableOpacity>
                    </View>
                  </LightCard>
                </FadeInView>
              );
            })
          )}
        </ScrollView>

        {/* Modal form */}
        <Modal
          visible={modalOpen}
          transparent
          animationType="slide"
          onRequestClose={() => setModalOpen(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' }}
          >
            <View style={{ flex: 1 }} />
            <View
              style={{
                backgroundColor: LIGHT.card,
                borderTopLeftRadius: RADIUS.xl,
                borderTopRightRadius: RADIUS.xl,
                padding: SPACING.base,
                paddingBottom: Platform.OS === 'ios' ? SPACING.xl : SPACING.base,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: SPACING.base,
                }}
              >
                <Text style={[TYPE.h3, { color: LIGHT.text }]}>
                  Add{' '}
                  {pickedType === 'upi'
                    ? 'UPI'
                    : pickedType === 'card'
                    ? 'Card'
                    : 'Wallet'}
                </Text>
                <TouchableOpacity
                  onPress={() => setModalOpen(false)}
                  hitSlop={12}
                >
                  <X size={22} color={LIGHT.textMuted} />
                </TouchableOpacity>
              </View>

              <View style={{ marginBottom: SPACING.md }}>
                <Text style={styles.fieldLabel}>NICKNAME</Text>
                <TextInput
                  value={form.label}
                  onChangeText={(v) => setForm((s) => ({ ...s, label: v }))}
                  placeholder="My UPI"
                  placeholderTextColor={LIGHT.textMuted}
                  style={styles.input}
                />
              </View>

              <View style={{ marginBottom: SPACING.md }}>
                <Text style={styles.fieldLabel}>
                  {pickedType === 'upi'
                    ? 'UPI ID'
                    : pickedType === 'card'
                    ? 'LAST 4 DIGITS'
                    : 'WALLET NUMBER'}
                </Text>
                <TextInput
                  value={form.detail}
                  onChangeText={(v) => setForm((s) => ({ ...s, detail: v }))}
                  placeholder={
                    pickedType === 'upi'
                      ? 'name@okaxis'
                      : pickedType === 'card'
                      ? '1234'
                      : '9xxxxxxxxx'
                  }
                  placeholderTextColor={LIGHT.textMuted}
                  keyboardType={pickedType === 'card' ? 'number-pad' : 'default'}
                  maxLength={pickedType === 'card' ? 4 : 40}
                  autoCapitalize="none"
                  style={styles.input}
                />
                {pickedType === 'card' ? (
                  <Text
                    style={{
                      color: LIGHT.textTertiary,
                      fontSize: 11,
                      marginTop: 4,
                    }}
                  >
                    For security we only store the last 4 digits. Full card
                    details will be tokenized by our payment provider.
                  </Text>
                ) : null}
              </View>

              <TouchableOpacity
                onPress={save}
                disabled={saving}
                style={{
                  backgroundColor: LIGHT.accent,
                  paddingVertical: SPACING.md,
                  borderRadius: RADIUS.lg,
                  alignItems: 'center',
                  marginTop: SPACING.sm,
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text
                    style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}
                  >
                    Save Method
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    </LightScreenBackground>
  );
}

const styles = {
  fieldLabel: {
    color: LIGHT.textTertiary,
    fontSize: 11,
    fontWeight: '700' as const,
    letterSpacing: 0.6,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: LIGHT.divider,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    color: LIGHT.text,
    fontSize: 15,
    backgroundColor: LIGHT.bg,
  },
};
