import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  Platform,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { MapPin, Calendar, Clock, Wallet, Sparkles, Plus, Eye, ChevronRight } from 'lucide-react-native';
import {
  ScreenBackground,
  ScreenHeader,
  GlassCard,
  NeuCard,
  Input,
  NeuInput,
  Chip,
  PrimaryButton,
  Typography,
  FadeInView,
  SlideUpView,
  StaggeredList,
  SectionTitle,
  LightScreenBackground,
  LightCard,
  BlackButton,
  LIGHT,
  SPACING,
  RADIUS,
  TYPE,
  SEMANTIC,
  NEU,
  NEON,
} from '../components/ui';
import CalendarPicker from '../components/CalendarPicker';
import { BRAND, SURFACE, TEXT } from '../theme/colors';
import { useRequirementStore, useAuthStore } from '../store';
import { requirementAPI } from '../api';

const EVENT_TYPES = ['Corporate', 'Wedding', 'Personal', 'Exhibition', 'Concert', 'Conference'];
const EQUIPMENT_OPTIONS = [
  'Projector',
  'Sound System',
  'LED Wall',
  'Microphones',
  'Lighting',
  'DJ Equipment',
  'Screens',
  'Video Recording',
  'Karaoke',
  'Cables',
];
const BUDGET_BANDS = ['Under ₹10K', '₹10K-25K', '₹25K-50K', '₹50K-1L', '₹1L+', 'Flexible'];

const STATUS_COLORS: Record<string, { bg: string; fg: string; label: string }> = {
  open: { bg: 'rgba(34, 224, 130, 0.15)', fg: '#0E7A3C', label: 'OPEN' },
  matched: { bg: 'rgba(123, 37, 244, 0.15)', fg: LIGHT.accent, label: 'MATCHED' },
  closed: { bg: 'rgba(138, 125, 148, 0.15)', fg: '#8A7D94', label: 'CLOSED' },
  cancelled: { bg: 'rgba(255, 91, 110, 0.15)', fg: '#A8152B', label: 'CANCELLED' },
};

export default function RequirementScreen() {
  const navigation = useNavigation<any>();
  const submit = useRequirementStore((s) => s.submit);
  const { isGuest, isAuthenticated } = useAuthStore();

  // View mode: 'list' or 'wizard'
  const [mode, setMode] = useState<'list' | 'wizard'>('list');
  const [myRequirements, setMyRequirements] = useState<any[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Wizard state
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [eventType, setEventType] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [items, setItems] = useState<string[]>([]);
  const [budget, setBudget] = useState<string | null>('Flexible');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const loadMyRequirements = useCallback(async () => {
    if (isGuest || !isAuthenticated) {
      setListLoading(false);
      setMyRequirements([]);
      return;
    }
    try {
      const res = await requirementAPI.getMy();
      const list = res.data?.requirements ?? res.data ?? [];
      setMyRequirements(
        list.map((r: any) => ({
          ...r,
          id: r.id ?? r._id,
        }))
      );
    } catch {
      setMyRequirements([]);
    } finally {
      setListLoading(false);
    }
  }, [isGuest, isAuthenticated]);

  useEffect(() => {
    loadMyRequirements();
  }, [loadMyRequirements]);

  useFocusEffect(
    useCallback(() => {
      loadMyRequirements();
    }, [loadMyRequirements])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMyRequirements();
    setRefreshing(false);
  };

  const humanDate = (ymd: string) => {
    if (!ymd) return '';
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
    if (!m) {
      try {
        return new Date(ymd).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      } catch { return ymd; }
    }
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const toggleItem = (name: string) => {
    setItems((prev) => (prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]));
  };

  const progress = Math.min(1, step / 3);

  const onSubmit = async () => {
    if (isGuest) {
      Alert.alert(
        'Sign in required',
        'Create a free account to post your requirement and get matched with vendors.',
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'Sign in', onPress: () => navigation.navigate('Login') },
        ]
      );
      return;
    }
    if (!address || !eventType || !date || items.length === 0) {
      Alert.alert('Incomplete', 'Please fill address, event type, date and at least one item.');
      return;
    }
    setLoading(true);
    try {
      const req = await submit({
        address,
        city,
        eventType,
        date,
        startTime,
        endTime,
        items,
        budget,
        notes,
      });
      // Reset wizard
      setAddress(''); setCity(''); setEventType(null); setDate('');
      setStartTime(''); setEndTime(''); setItems([]); setBudget('Flexible');
      setNotes(''); setStep(1);
      setMode('list');
      await loadMyRequirements();
      navigation.navigate('MatchResults', { requirementId: req.id });
    } catch (e: any) {
      Alert.alert('Could not save', e?.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ─── LIST VIEW ───────────────────────────────────────────────
  if (mode === 'list') {
    if (listLoading) {
      return (
        <LightScreenBackground>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={LIGHT.accent} />
          </View>
        </LightScreenBackground>
      );
    }

    // If guest or no requirements, show prompt
    if (isGuest || (!isAuthenticated && myRequirements.length === 0)) {
      return (
        <LightScreenBackground>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl }}>
            <Sparkles size={48} color={LIGHT.textMuted} />
            <Text style={[TYPE.h3, { color: LIGHT.text, marginTop: SPACING.base, marginBottom: SPACING.xs, textAlign: 'center' }]}>
              Post a Requirement
            </Text>
            <Text style={[TYPE.body, { color: LIGHT.textTertiary, textAlign: 'center', marginBottom: SPACING.lg }]}>
              Tell us what you need and get offers from verified suppliers
            </Text>
            <BlackButton
              title="POST NEW REQUIREMENT"
              onPress={() => {
                if (isGuest) {
                  Alert.alert('Sign in required', 'Create an account to post requirements.', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Sign in', onPress: () => navigation.navigate('Login') },
                  ]);
                } else {
                  setMode('wizard');
                }
              }}
              size="md"
            />
          </View>
        </LightScreenBackground>
      );
    }

    if (myRequirements.length === 0) {
      return (
        <LightScreenBackground>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl }}>
            <Sparkles size={48} color={LIGHT.textMuted} />
            <Text style={[TYPE.h3, { color: LIGHT.text, marginTop: SPACING.base, marginBottom: SPACING.xs, textAlign: 'center' }]}>
              No requirements yet
            </Text>
            <Text style={[TYPE.body, { color: LIGHT.textTertiary, textAlign: 'center', marginBottom: SPACING.lg }]}>
              Post your first requirement and get matched with equipment suppliers
            </Text>
            <BlackButton title="POST REQUIREMENT" onPress={() => setMode('wizard')} size="md" />
          </View>
        </LightScreenBackground>
      );
    }

    return (
      <LightScreenBackground>
        <View style={{ flex: 1 }}>
          <FadeInView>
            <View style={{ paddingHorizontal: SPACING.base, paddingTop: SPACING.base + 20, paddingBottom: SPACING.sm }}>
              <Text style={[TYPE.h2, { color: LIGHT.text, letterSpacing: -0.3 }]}>
                My Requirements
              </Text>
              <Text style={[TYPE.caption, { color: LIGHT.textTertiary, marginTop: 2 }]}>
                {myRequirements.length} posted
              </Text>
            </View>
          </FadeInView>

          <FlatList
            data={myRequirements}
            keyExtractor={(item) => item.id || item._id || String(Math.random())}
            contentContainerStyle={{ padding: SPACING.base, paddingBottom: 100, gap: SPACING.sm }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={LIGHT.accent} />
            }
            renderItem={({ item, index }) => {
              const status = (item.status || 'open').toLowerCase();
              const statusCfg = STATUS_COLORS[status] || STATUS_COLORS.open;
              const offersCount = item.offersCount ?? item.offers?.length ?? 0;

              return (
                <SlideUpView delay={index * 50}>
                  <LightCard padding={SPACING.base}>
                    {/* Top row: event + status */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm }}>
                      <View style={{ flex: 1 }}>
                        <Text style={[TYPE.body, { color: LIGHT.text, fontWeight: '700' }]}>
                          {item.eventType} Event
                        </Text>
                        <Text style={[TYPE.caption, { color: LIGHT.textTertiary, marginTop: 2 }]}>
                          {humanDate(item.date)}
                        </Text>
                      </View>
                      <View style={{ paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: RADIUS.full, backgroundColor: statusCfg.bg }}>
                        <Text style={[TYPE.tiny, { color: statusCfg.fg, fontWeight: '700', letterSpacing: 0.5 }]}>
                          {statusCfg.label}
                        </Text>
                      </View>
                    </View>

                    <View style={{ height: 1, backgroundColor: LIGHT.divider }} />

                    {/* Details */}
                    <View style={{ marginVertical: SPACING.sm }}>
                      {item.budget && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                          <Wallet size={12} color={LIGHT.textTertiary} />
                          <Text style={[TYPE.caption, { color: LIGHT.textSecondary, marginLeft: 6 }]}>
                            Budget: {item.budget}
                          </Text>
                        </View>
                      )}
                      {item.city && (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <MapPin size={12} color={LIGHT.textTertiary} />
                          <Text style={[TYPE.caption, { color: LIGHT.textSecondary, marginLeft: 6 }]}>
                            {item.city}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* Actions */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
                      {status === 'matched' ? (
                        <TouchableOpacity
                          onPress={() => navigation.navigate('Main', { screen: 'Orders' })}
                          style={{
                            flex: 1,
                            height: 40,
                            borderRadius: RADIUS.full,
                            backgroundColor: LIGHT.btnBlack,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                          }}
                        >
                          <Eye size={14} color="#FFFFFF" />
                          <Text style={[TYPE.buttonSm, { color: '#FFFFFF', fontWeight: '700' }]}>
                            View Order
                          </Text>
                        </TouchableOpacity>
                      ) : (
                        <>
                          {offersCount > 0 && (
                            <TouchableOpacity
                              onPress={() => navigation.navigate('RequirementOffers', { requirementId: item.id })}
                              style={{
                                flex: 1,
                                height: 40,
                                borderRadius: RADIUS.full,
                                backgroundColor: LIGHT.btnBlack,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                              }}
                            >
                              <Text style={[TYPE.buttonSm, { color: '#FFFFFF', fontWeight: '700' }]}>
                                {offersCount} {offersCount === 1 ? 'Offer' : 'Offers'}
                              </Text>
                              <ChevronRight size={14} color="#FFFFFF" />
                            </TouchableOpacity>
                          )}
                          {offersCount === 0 && status === 'open' && (
                            <View style={{
                              flex: 1,
                              height: 40,
                              borderRadius: RADIUS.full,
                              backgroundColor: LIGHT.cardSoft,
                              borderWidth: 1,
                              borderColor: LIGHT.border,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                              <Text style={[TYPE.caption, { color: LIGHT.textTertiary }]}>
                                Waiting for offers...
                              </Text>
                            </View>
                          )}
                        </>
                      )}
                    </View>
                  </LightCard>
                </SlideUpView>
              );
            }}
          />

          {/* FAB */}
          <TouchableOpacity
            onPress={() => setMode('wizard')}
            activeOpacity={0.85}
            style={{
              position: 'absolute',
              bottom: 24,
              right: SPACING.base,
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: LIGHT.btnBlack,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Plus size={24} color="#FFFFFF" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </LightScreenBackground>
    );
  }

  // ─── WIZARD VIEW ─────────────────────────────────────────────
  return (
    <ScreenBackground>
      <ScreenHeader
        title="Post Requirement"
        subtitle="Tell us what, when, where"
        onBack={myRequirements.length > 0 ? () => setMode('list') : undefined}
      />

      <View style={{ paddingHorizontal: SPACING.base }}>
        <View style={{ height: 6, backgroundColor: SURFACE.muted, borderRadius: RADIUS.full, overflow: 'hidden' }}>
          <View style={{ width: `${progress * 100}%`, height: '100%', backgroundColor: BRAND[500] }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.xs }}>
          {['Location', 'Event', 'Equipment'].map((label, i) => (
            <Text key={label} style={[TYPE.caption, { color: step > i ? BRAND[600] : TEXT.muted, fontWeight: step > i ? '700' : '500' }]}>
              {label}
            </Text>
          ))}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: SPACING.base, paddingBottom: SPACING['4xl'] }}>
        <FadeInView delay={60}>
          <NeuCard style={{ marginBottom: SPACING.base }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md }}>
              <MapPin size={18} color={BRAND[600]} />
              <Text style={[TYPE.h4, { marginLeft: SPACING.sm }]}>Where is the event?</Text>
            </View>
            <NeuInput
              placeholder="Event address or landmark"
              value={address}
              onChangeText={(t) => {
                setAddress(t);
                if (t.length > 8 && step < 2) setStep(2);
              }}
              containerStyle={{ marginBottom: SPACING.sm }}
            />
            <NeuInput placeholder="City" value={city} onChangeText={setCity} />
            <Text style={[TYPE.caption, { color: TEXT.tertiary, marginTop: SPACING.sm }]}>
              Free geocoding via OpenStreetMap. We use your city to find vendors within 5-10 km.
            </Text>
          </NeuCard>
        </FadeInView>

        <SlideUpView delay={120}>
          <GlassCard style={{ marginBottom: SPACING.base }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md }}>
              <Sparkles size={18} color={BRAND[600]} />
              <Text style={[TYPE.h4, { marginLeft: SPACING.sm }]}>Event Type</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {EVENT_TYPES.map((t) => (
                <Chip
                  key={t}
                  label={t}
                  selected={eventType === t}
                  onPress={() => {
                    setEventType(t);
                    if (step < 2) setStep(2);
                  }}
                />
              ))}
            </View>

            <View style={{ flexDirection: 'row', marginTop: SPACING.md }}>
              <View style={{ flex: 1, marginRight: SPACING.sm }}>
                <Text style={[TYPE.label, { color: TEXT.secondary, marginBottom: 6 }]}>Date</Text>
                <TouchableOpacity
                  onPress={() => setCalendarOpen(true)}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderWidth: 1,
                    borderColor: date ? BRAND[500] : SURFACE.border,
                    backgroundColor: SURFACE.panel,
                    borderRadius: RADIUS.md,
                    paddingHorizontal: 14,
                    paddingVertical: 14,
                  }}
                >
                  <Calendar size={16} color={date ? BRAND[600] : TEXT.tertiary} />
                  <Text
                    style={{
                      marginLeft: 10,
                      flex: 1,
                      color: date ? TEXT.primary : TEXT.tertiary,
                      fontSize: 14,
                      fontWeight: date ? '600' : '400',
                    }}
                  >
                    {date ? humanDate(date) : 'Select a date'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flexDirection: 'row', marginTop: SPACING.sm }}>
              <View style={{ flex: 1, marginRight: SPACING.sm }}>
                <Input
                  label="Start"
                  placeholder="18:00"
                  value={startTime}
                  onChangeText={setStartTime}
                  leftIcon={<Clock size={16} color={TEXT.tertiary} />}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Input
                  label="End"
                  placeholder="23:00"
                  value={endTime}
                  onChangeText={setEndTime}
                  leftIcon={<Clock size={16} color={TEXT.tertiary} />}
                />
              </View>
            </View>
          </GlassCard>
        </SlideUpView>

        <SlideUpView delay={200}>
          <GlassCard style={{ marginBottom: SPACING.base }}>
            <SectionTitle title="Equipment Needed" />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {EQUIPMENT_OPTIONS.map((opt) => (
                <Chip key={opt} label={opt} selected={items.includes(opt)} onPress={() => toggleItem(opt)} />
              ))}
            </View>

            <View style={{ marginTop: SPACING.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs }}>
                <Wallet size={14} color={TEXT.secondary} />
                <Text style={[TYPE.label, { color: TEXT.secondary, marginLeft: 6 }]}>Budget</Text>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {BUDGET_BANDS.map((b) => (
                  <Chip key={b} label={b} selected={budget === b} onPress={() => setBudget(b)} />
                ))}
              </View>
            </View>

            <View style={{ marginTop: SPACING.md }}>
              <Input
                label="Notes (optional)"
                placeholder="Any special requirements, setup time, access info..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                style={{ minHeight: 80, textAlignVertical: 'top' }}
              />
            </View>
          </GlassCard>
        </SlideUpView>

        <SlideUpView delay={280}>
          <PrimaryButton
            title={loading ? 'Finding matches...' : 'Find matching vendors'}
            onPress={onSubmit}
            loading={loading}
            leftIcon={<Sparkles size={18} color="#FFF" />}
          />
          <Text style={[TYPE.caption, { color: TEXT.tertiary, textAlign: 'center', marginTop: SPACING.sm }]}>
            No payment yet. You will review quotes before booking.
          </Text>
        </SlideUpView>
      </ScrollView>

      <CalendarPicker
        visible={calendarOpen}
        value={date}
        onClose={() => setCalendarOpen(false)}
        onSelect={(ymd) => {
          setDate(ymd);
          if (step < 3) setStep(3);
        }}
        accentColor={BRAND[500]}
      />
    </ScreenBackground>
  );
}
