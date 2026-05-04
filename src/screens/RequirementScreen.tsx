import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MapPin, Calendar, Clock, Wallet, Sparkles } from 'lucide-react-native';
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
} from '../components/ui';
import CalendarPicker from '../components/CalendarPicker';
import { BRAND, SURFACE, TEXT, SEMANTIC } from '../theme/colors';
import { SPACING, RADIUS } from '../theme/spacing';
import { TYPE } from '../theme/typography';
import { useRequirementStore, useAuthStore } from '../store';

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

export default function RequirementScreen() {
  const navigation = useNavigation<any>();
  const submit = useRequirementStore((s) => s.submit);
  const { isGuest } = useAuthStore();

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

  const humanDate = (ymd: string) => {
    if (!ymd) return '';
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
    if (!m) return ymd;
    const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const toggleItem = (name: string) => {
    setItems((prev) => (prev.includes(name) ? prev.filter((i) => i !== name) : [...prev, name]));
  };

  const progress = Math.min(1, step / 3);

  const onSubmit = async () => {
    // Guest guard: posting a requirement requires an account.
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
      navigation.navigate('MatchResults', { requirementId: req.id });
    } catch (e: any) {
      Alert.alert('Could not save', e?.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenBackground>
      <ScreenHeader title="Post Requirement" subtitle="Tell us what, when, where" />

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
