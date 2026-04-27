import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Sparkles,
  MapPin,
  ShieldCheck,
  UserCircle,
  Truck,
  ChevronRight,
  ArrowRight,
} from 'lucide-react-native';
import {
  LightScreenBackground,
  LightCard,
  BlackButton,
  LIGHT,
  NEU,
  NEON,
  SPACING,
  RADIUS,
  TYPE,
} from '../components/ui';
import { useAuthStore } from '../store';

const LOGO = require('../../assets/logo.jpg');

type Role = 'buyer' | 'supplier';

const SLIDES = [
  {
    key: 'post',
    Icon: Sparkles,
    tint: '#7B25F4',
    eyebrow: 'Step 1',
    title: 'Post your event requirement',
    body: 'Tell us what you need — equipment, venue, date, budget. Takes under a minute.',
  },
  {
    key: 'match',
    Icon: MapPin,
    tint: '#E14D8A',
    eyebrow: 'Step 2',
    title: 'Get matched with top AV vendors',
    body: 'We rank vendors near you by rating, response time and price so you can pick with confidence.',
  },
  {
    key: 'trust',
    Icon: ShieldCheck,
    tint: '#0E7A3C',
    eyebrow: 'Step 3',
    title: 'Book with OTP trust shield',
    body: 'Pay a small advance. Start & End OTPs protect both sides until the job is done.',
  },
];

export default function OnboardingScreen({ navigation }: any) {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const [role, setRole] = useState<Role | null>(null);
  const { completeOnboarding, continueAsGuest } = useAuthStore();

  const isRolePage = page === SLIDES.length; // last "page" is role picker
  const totalPages = SLIDES.length + 1;

  const goTo = (idx: number) => {
    scrollRef.current?.scrollTo({ x: idx * width, animated: true });
    setPage(idx);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const idx = Math.round(x / width);
    if (idx !== page) setPage(idx);
  };

  const handleNext = () => {
    if (page < SLIDES.length) goTo(page + 1);
  };

  const handleSkip = () => {
    goTo(SLIDES.length); // jump to role picker
  };

  const handleSignIn = async () => {
    await completeOnboarding(role);
    navigation.replace('Login');
  };

  const handleCreateAccount = async () => {
    await completeOnboarding(role);
    navigation.replace('Register', { preselectedRole: role });
  };

  const handleGuest = async () => {
    await completeOnboarding(role);
    await continueAsGuest();
    // store change will swap navigator to Main tabs
  };

  return (
    <LightScreenBackground>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* ── Top bar: logo + skip ─────────────────────────────── */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: SPACING.base,
            paddingTop: SPACING.sm,
            paddingBottom: SPACING.sm,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: LIGHT.border,
                marginRight: SPACING.sm,
              }}
            >
              <Image source={LOGO} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            </View>
            <Text style={[TYPE.h4, { color: LIGHT.text, letterSpacing: -0.2 }]}>UrbanAV</Text>
          </View>
          {!isRolePage && (
            <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Text style={[TYPE.caption, { color: LIGHT.textTertiary, fontWeight: '600' }]}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Horizontal slides + role page ────────────────────── */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScroll}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
        >
          {SLIDES.map((s) => {
            const Icon = s.Icon;
            return (
              <View
                key={s.key}
                style={{
                  width,
                  paddingHorizontal: SPACING.xl,
                  justifyContent: 'center',
                }}
              >
                {/* Big illustration circle */}
                <View style={{ alignItems: 'center', marginBottom: SPACING['2xl'] }}>
                  <View
                    style={{
                      width: 180,
                      height: 180,
                      borderRadius: 90,
                      backgroundColor: `${s.tint}12`,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: `${s.tint}22`,
                    }}
                  >
                    <View
                      style={{
                        width: 110,
                        height: 110,
                        borderRadius: 55,
                        backgroundColor: `${s.tint}22`,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={52} color={s.tint} strokeWidth={1.5} />
                    </View>
                  </View>
                </View>

                <Text
                  style={[
                    TYPE.caption,
                    {
                      color: s.tint,
                      letterSpacing: 1.2,
                      fontWeight: '700',
                      textAlign: 'center',
                      marginBottom: SPACING.xs,
                    },
                  ]}
                >
                  {s.eyebrow.toUpperCase()}
                </Text>
                <Text
                  style={[
                    TYPE.h1,
                    {
                      color: LIGHT.text,
                      textAlign: 'center',
                      letterSpacing: -0.5,
                      marginBottom: SPACING.sm,
                    },
                  ]}
                >
                  {s.title}
                </Text>
                <Text
                  style={[
                    TYPE.body,
                    {
                      color: LIGHT.textSecondary,
                      textAlign: 'center',
                      lineHeight: 22,
                      paddingHorizontal: SPACING.sm,
                    },
                  ]}
                >
                  {s.body}
                </Text>
              </View>
            );
          })}

          {/* ── Role picker page ─────────────────────────────── */}
          <View
            style={{
              width,
              paddingHorizontal: SPACING.xl,
              justifyContent: 'center',
            }}
          >
            <Text
              style={[
                TYPE.caption,
                {
                  color: LIGHT.accent,
                  letterSpacing: 1.2,
                  fontWeight: '700',
                  textAlign: 'center',
                  marginBottom: SPACING.xs,
                },
              ]}
            >
              ALMOST DONE
            </Text>
            <Text
              style={[
                TYPE.h1,
                {
                  color: LIGHT.text,
                  textAlign: 'center',
                  letterSpacing: -0.5,
                  marginBottom: SPACING.sm,
                },
              ]}
            >
              What brings you here?
            </Text>
            <Text
              style={[
                TYPE.body,
                {
                  color: LIGHT.textSecondary,
                  textAlign: 'center',
                  lineHeight: 22,
                  marginBottom: SPACING.xl,
                },
              ]}
            >
              Pick one — we'll tailor your home screen. You can switch later.
            </Text>

            {/* Role cards */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setRole('buyer')}
              style={{ marginBottom: SPACING.md }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: SPACING.base,
                  borderRadius: RADIUS.lg,
                  backgroundColor: role === 'buyer' ? `${NEON.purple}0F` : LIGHT.card,
                  borderWidth: 1.5,
                  borderColor: role === 'buyer' ? NEON.purple : LIGHT.border,
                }}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    backgroundColor: `${NEON.purple}15`,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: SPACING.base,
                  }}
                >
                  <UserCircle size={28} color={NEON.purple} strokeWidth={1.75} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[TYPE.h4, { color: LIGHT.text, fontWeight: '700' }]}>
                    I'm a Buyer
                  </Text>
                  <Text style={[TYPE.caption, { color: LIGHT.textTertiary, marginTop: 2 }]}>
                    Renting AV for an event — weddings, corporate, parties
                  </Text>
                </View>
                <ChevronRight size={18} color={role === 'buyer' ? NEON.purple : LIGHT.textTertiary} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => setRole('supplier')}
              style={{ marginBottom: SPACING.xl }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: SPACING.base,
                  borderRadius: RADIUS.lg,
                  backgroundColor: role === 'supplier' ? '#E14D8A12' : LIGHT.card,
                  borderWidth: 1.5,
                  borderColor: role === 'supplier' ? '#E14D8A' : LIGHT.border,
                }}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    backgroundColor: '#E14D8A15',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: SPACING.base,
                  }}
                >
                  <Truck size={26} color="#E14D8A" strokeWidth={1.75} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[TYPE.h4, { color: LIGHT.text, fontWeight: '700' }]}>
                    I'm a Supplier
                  </Text>
                  <Text style={[TYPE.caption, { color: LIGHT.textTertiary, marginTop: 2 }]}>
                    Renting out equipment — grow bookings, list inventory
                  </Text>
                </View>
                <ChevronRight size={18} color={role === 'supplier' ? '#E14D8A' : LIGHT.textTertiary} />
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* ── Pagination dots ──────────────────────────────────── */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: SPACING.base,
          }}
        >
          {Array.from({ length: totalPages }).map((_, i) => {
            const active = i === page;
            return (
              <View
                key={i}
                style={{
                  width: active ? 24 : 7,
                  height: 7,
                  borderRadius: 4,
                  marginHorizontal: 3,
                  backgroundColor: active ? LIGHT.accent : LIGHT.border,
                }}
              />
            );
          })}
        </View>

        {/* ── Bottom CTAs ──────────────────────────────────────── */}
        <View style={{ paddingHorizontal: SPACING.xl, paddingBottom: SPACING.lg }}>
          {!isRolePage ? (
            <BlackButton
              title={page === SLIDES.length - 1 ? 'GET STARTED' : 'NEXT'}
              onPress={handleNext}
              rightIcon={<ArrowRight size={16} color="#FFFFFF" strokeWidth={2} />}
            />
          ) : (
            <>
              <BlackButton
                title={role ? 'CREATE ACCOUNT' : 'SELECT A ROLE TO CONTINUE'}
                onPress={handleCreateAccount}
                disabled={!role}
              />
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: SPACING.md,
                  gap: SPACING.md,
                }}
              >
                <TouchableOpacity onPress={handleSignIn}>
                  <Text
                    style={[
                      TYPE.caption,
                      {
                        color: LIGHT.textSecondary,
                        fontWeight: '600',
                        textDecorationLine: 'underline',
                      },
                    ]}
                  >
                    I already have an account
                  </Text>
                </TouchableOpacity>
                <Text style={{ color: LIGHT.textMuted }}>·</Text>
                <TouchableOpacity onPress={handleGuest}>
                  <Text
                    style={[
                      TYPE.caption,
                      {
                        color: LIGHT.textSecondary,
                        fontWeight: '600',
                        textDecorationLine: 'underline',
                      },
                    ]}
                  >
                    Browse as guest
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </SafeAreaView>
    </LightScreenBackground>
  );
}
