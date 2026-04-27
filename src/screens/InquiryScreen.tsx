import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Text, Alert, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Send, Handshake, TrendingDown, CheckCircle2 } from 'lucide-react-native';
import {
  ScreenBackground,
  ScreenHeader,
  GlassCard,
  Avatar,
  PrimaryButton,
  GhostButton,
  Badge,
  Typography,
  PressableScale,
  FadeInView,
  SlideUpView,
  PriceTag,
  Input,
} from '../components/ui';
import { BRAND, SURFACE, TEXT, SEMANTIC } from '../theme/colors';
import { SPACING, RADIUS } from '../theme/spacing';
import { TYPE } from '../theme/typography';
import { useInquiryStore, VendorMatch, Inquiry, QuoteMessage } from '../store';

export default function InquiryScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const vendor: VendorMatch = route.params?.vendor;
  const requirementId: string = route.params?.requirementId ?? 'req_demo';

  const send = useInquiryStore((s) => s.send);
  const addMessage = useInquiryStore((s) => s.addMessage);
  const list = useInquiryStore((s) => s.list);

  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [draft, setDraft] = useState('');
  const [counterOffer, setCounterOffer] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    (async () => {
      const created = await send(vendor.id, requirementId, vendor.businessName, vendor.estimatedPrice);
      // Seed a vendor response so the negotiation UI has content right away.
      addMessage(created.id, { from: 'vendor', kind: 'quote', text: 'Hi! Here is my initial quote for your event.', price: vendor.estimatedPrice });
      setInquiry({ ...created });
    })();
  }, [vendor?.id]);

  // Keep local inquiry in sync with store list
  useEffect(() => {
    if (!inquiry) return;
    const fresh = list.find((i) => i.id === inquiry.id);
    if (fresh) setInquiry(fresh);
  }, [list]);

  const sendMessage = () => {
    if (!inquiry || !draft.trim()) return;
    addMessage(inquiry.id, { from: 'buyer', kind: 'message', text: draft.trim() });
    setDraft('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
  };

  const sendCounter = () => {
    if (!inquiry) return;
    const price = Number(counterOffer);
    if (!price || price <= 0) {
      Alert.alert('Invalid price', 'Enter a positive counter-offer amount.');
      return;
    }
    addMessage(inquiry.id, { from: 'buyer', kind: 'counter', price, text: `Can you do ₹${price.toLocaleString('en-IN')}?` });
    setCounterOffer('');
    // Fake vendor counter after 800ms for demo realism
    setTimeout(() => {
      const mid = Math.round(((vendor.estimatedPrice + price) / 2) / 100) * 100;
      addMessage(inquiry.id, { from: 'vendor', kind: 'counter', price: mid, text: `Best I can do is ₹${mid.toLocaleString('en-IN')}.` });
    }, 900);
  };

  const acceptLatest = () => {
    if (!inquiry) return;
    const latestPrice =
      [...inquiry.counterHistory].reverse().find((m) => m.price)?.price ?? inquiry.quotedPrice ?? vendor.estimatedPrice;
    addMessage(inquiry.id, { from: 'buyer', kind: 'accept', price: latestPrice, text: `Accepting ₹${latestPrice.toLocaleString('en-IN')}` });
    navigation.navigate('BookingConfirm', { vendor, requirementId, finalPrice: latestPrice, inquiryId: inquiry.id });
  };

  if (!vendor) {
    return (
      <ScreenBackground>
        <ScreenHeader title="Inquiry" onBack={() => navigation.goBack()} />
        <View style={{ padding: SPACING.base }}>
          <Typography variant="body">Vendor not found.</Typography>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <ScreenHeader
        title={vendor.businessName}
        subtitle={`${vendor.distanceKm.toFixed(1)} km · ${vendor.responseTimeMins}m response`}
        onBack={() => navigation.goBack()}
      />

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ padding: SPACING.base, paddingBottom: SPACING['2xl'] }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          <FadeInView>
            <GlassCard tier="tier2" padding={SPACING.md} style={{ marginBottom: SPACING.base, flexDirection: 'row', alignItems: 'center' }}>
              <Avatar name={vendor.businessName} size={44} />
              <View style={{ flex: 1, marginLeft: SPACING.md }}>
                <Text style={TYPE.h4}>{vendor.businessName}</Text>
                <Text style={[TYPE.caption, { color: TEXT.tertiary }]}>Initial est: ₹{vendor.estimatedPrice.toLocaleString('en-IN')}</Text>
              </View>
              <Badge label={inquiry?.status ?? 'sending'} tone={inquiry?.status === 'accepted' ? 'success' : 'brand'} />
            </GlassCard>
          </FadeInView>

          {(inquiry?.counterHistory ?? []).map((m, i) => (
            <MessageBubble key={m.id} msg={m} index={i} />
          ))}
        </ScrollView>

        <View style={{ padding: SPACING.base, borderTopWidth: 1, borderTopColor: SURFACE.border, backgroundColor: SURFACE.base }}>
          <View style={{ flexDirection: 'row', marginBottom: SPACING.sm }}>
            <View style={{ flex: 1, marginRight: SPACING.sm }}>
              <Input
                placeholder="Counter-offer (₹)"
                keyboardType="numeric"
                value={counterOffer}
                onChangeText={setCounterOffer}
                leftIcon={<TrendingDown size={16} color={TEXT.tertiary} />}
              />
            </View>
            <GhostButton title="Counter" onPress={sendCounter} size="md" fullWidth={false} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1, marginRight: SPACING.sm }}>
              <Input placeholder="Message the vendor..." value={draft} onChangeText={setDraft} />
            </View>
            <PrimaryButton title="Send" onPress={sendMessage} size="md" fullWidth={false} leftIcon={<Send size={14} color="#FFF" />} />
          </View>
          <PressableScale onPress={acceptLatest} style={{ marginTop: SPACING.sm }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: SPACING.md,
                borderRadius: RADIUS.lg,
                backgroundColor: SEMANTIC.successSoft,
                borderWidth: 1,
                borderColor: SEMANTIC.success,
              }}
            >
              <CheckCircle2 size={18} color={SEMANTIC.success} />
              <Text style={[TYPE.button, { color: SEMANTIC.success, marginLeft: SPACING.sm }]}>Accept latest quote & book</Text>
            </View>
          </PressableScale>
        </View>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const MessageBubble: React.FC<{ msg: QuoteMessage; index: number }> = ({ msg, index }) => {
  const mine = msg.from === 'buyer';
  const isQuote = msg.kind === 'quote' || msg.kind === 'counter';
  return (
    <SlideUpView delay={index * 40}>
      <View style={{ flexDirection: 'row', justifyContent: mine ? 'flex-end' : 'flex-start', marginBottom: SPACING.sm }}>
        {!mine && <Handshake size={18} color={BRAND[500]} style={{ marginRight: SPACING.xs, marginTop: 12 }} />}
        <View
          style={{
            maxWidth: '80%',
            padding: SPACING.md,
            borderRadius: RADIUS.lg,
            borderTopLeftRadius: mine ? RADIUS.lg : 4,
            borderTopRightRadius: mine ? 4 : RADIUS.lg,
            backgroundColor: mine ? BRAND[500] : SURFACE.base,
            borderWidth: mine ? 0 : 1,
            borderColor: SURFACE.border,
          }}
        >
          {isQuote && msg.price ? (
            <View style={{ marginBottom: msg.text ? SPACING.xs : 0 }}>
              <Text style={[TYPE.tiny, { color: mine ? 'rgba(255,255,255,0.8)' : TEXT.tertiary }]}>
                {msg.kind === 'counter' ? 'COUNTER OFFER' : 'QUOTE'}
              </Text>
              <Text style={[TYPE.h3, { color: mine ? '#FFF' : BRAND[700] }]}>
                ₹{msg.price.toLocaleString('en-IN')}
              </Text>
            </View>
          ) : null}
          {msg.text ? (
            <Text style={[TYPE.body, { color: mine ? '#FFF' : TEXT.primary }]}>{msg.text}</Text>
          ) : null}
        </View>
      </View>
    </SlideUpView>
  );
};
