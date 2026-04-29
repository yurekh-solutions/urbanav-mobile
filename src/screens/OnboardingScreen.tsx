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
  ChevronRight,
  ArrowRight,
  Store,
  CalendarCheck,
  Handshake,
  Check,
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

// Buyer onboarding slides
const BUYER_SLIDES = [
  {
    key: 'post',
    Icon: Sparkles,
    tint: '#7B25F4',
    step: 1,
    totalSteps: 3,
    title: 'Post Your Event Requirement',
    body: 'Tell us what you need — equipment, venue, date, and budget. Takes under a minute to get started.',
    points: ['List your AV equipment needs', 'Set your budget and dates', 'Get matched with vendors'],
  },
  {
    key: 'match',
    Icon: MapPin,
    tint: '#E14D8A',
    step: 2,
    totalSteps: 3,
    title: 'Get Matched with Top Vendors',
    body: 'We rank verified AV vendors near you by rating, response time, and price transparency.',
    points: ['Verified vendor reviews', 'Location-based matching', 'Compare quotes easily'],
  },
  {
    key: 'trust',
    Icon: ShieldCheck,
    tint: '#0E7A3C',
    step: 3,
    totalSteps: 3,
    title: 'Book with OTP Trust Shield',
    body: 'Pay a small advance. Start & End OTPs protect both sides until the job is done right.',
    points: ['Secure payment protection', 'OTP verified handovers', 'Dispute resolution support'],
  },
];

// Supplier onboarding slides
const SUPPLIER_SLIDES = [
  {
    key: 'list',
    Icon: Store,
    tint: '#F97316',
    step: 1,
    totalSteps: 3,
    title: 'List Your Equipment',
    body: 'Add your AV inventory — projectors, speakers, lights, screens and more to start receiving inquiries.',
    points: ['Upload equipment photos', 'Set competitive pricing', 'Specify availability'],
  },
  {
    key: 'inquiry',
    Icon: CalendarCheck,
    tint: '#8B5CF6',
    step: 2,
    totalSteps: 3,
    title: 'Receive & Manage Inquiries',
    body: 'Get notified instantly when buyers request quotes. Respond quickly to win more bookings.',
    points: ['Real-time notifications', 'Quick quote generation', 'Calendar availability sync'],
  },
  {
    key: 'earn',
    Icon: Handshake,
    tint: '#059669',
    step: 3,
    totalSteps: 3,
    title: 'Earn with Trust & Safety',
    body: 'Secure payments, OTP-verified handovers, and review system to build your reputation.',
    points: ['Guaranteed payment collection', 'Start & End OTP verification', 'Build your 5-star rating'],
  },
];

// Step indicator component
function StepIndicator({ current, total, tint }: { current: number; total: number; tint: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm }}>
      {Array.from({ length: total }).map((_, i) => (
        <React.Fragment key={i}>
          <View
            style={{
              width: i === current - 1 ? 28 : 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: i < current ? tint : LIGHT.border,
            }}
          />
          {i < total - 1 && (
            <View
              style={{
                width: 8,
                height: 2,
                backgroundColor: i < current - 1 ? tint : LIGHT.border,
                marginHorizontal: 2,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

// Bullet point component
function BulletPoint({ text, tint }: { text: string; tint: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs }}>
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 11,
          backgroundColor: `${tint}15`,
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: SPACING.sm,
        }}
      >
        <Check size={12} color={tint} strokeWidth={2.5} />
      </View>
      <Text style={[TYPE.body, { color: LIGHT.textSecondary, fontSize: 14 }]}>{text}</Text>
    </View>
  );
}

// Role card component
function RoleCard({
  role,
  selected,
  onSelect,
  icon: Icon,
  title,
  subtitle,
  tint,
}: {
  role: Role;
  selected: boolean;
  onSelect: () => void;
  icon: any;
  title: string;
  subtitle: string;
  tint: string;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onSelect}
      style={{
        marginBottom: SPACING.md,
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: SPACING.base,
          borderRadius: RADIUS.xl,
          backgroundColor: selected ? `${tint}0F` : LIGHT.card,
          borderWidth: 2,
          borderColor: selected ? tint : LIGHT.border,
        }}
      >
        <View
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            backgroundColor: selected ? `${tint}20` : `${tint}10`,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: SPACING.base,
          }}
        >
          <Icon size={28} color={tint} strokeWidth={1.75} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[TYPE.h4, { color: LIGHT.text, fontWeight: '700', marginBottom: 2 }]}>
            {title}
          </Text>
          <Text style={[TYPE.caption, { color: LIGHT.textTertiary, lineHeight: 18 }]}>
            {subtitle}
          </Text>
        </View>
        <View
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: selected ? tint : LIGHT.border,
            backgroundColor: selected ? tint : 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {selected && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function OnboardingScreen({ navigation }: any) {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const [page, setPage] = useState(0);
  const [role, setRole] = useState<Role | null>(null);
  const { completeOnboarding, continueAsGuest } = useAuthStore();

  const slides = role === 'supplier' ? SUPPLIER_SLIDES : BUYER_SLIDES;
  const totalSlides = slides.length + 1; // +1 for role selection
  const isRolePage = page === slides.length;
  const currentSlide = page < slides.length ? slides[page] : null;

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
    if (page < slides.length) goTo(page + 1);
  };

  const handleSkip = () => {
    goTo(slides.length);
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
  };

  return (
    <LightScreenBackground>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        {/* Top bar: logo + step counter + skip */}
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
                width: 38,
                height: 38,
                borderRadius: 10,
                overflow: 'hidden',
                borderWidth: 1.5,
                borderColor: LIGHT.border,
                marginRight: SPACING.sm,
              }}
            >
              <Image source={LOGO} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            </View>
            <Text style={[TYPE.h4, { color: LIGHT.text, letterSpacing: -0.2 }]}>UrbanAV</Text>
          </View>
          {!isRolePage ? (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: `${currentSlide?.tint || NEON.purple}15`,
                  paddingHorizontal: SPACING.sm,
                  paddingVertical: 4,
                  borderRadius: RADIUS.full,
                  marginRight: SPACING.sm,
                }}
              >
                <Text style={[TYPE.tiny, { color: currentSlide?.tint || NEON.purple, fontWeight: '700' }]}>
                  Step {currentSlide?.step} of {currentSlide?.totalSteps}
                </Text>
              </View>
              <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <Text style={[TYPE.caption, { color: LIGHT.textTertiary, fontWeight: '600' }]}>Skip</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ width: 40 }} />
          )}
        </View>

        {/* Horizontal slides */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScroll}
          scrollEventThrottle={16}
          style={{ flex: 1 }}
        >
          {/* Feature slides */}
          {slides.map((s) => {
            const Icon = s.Icon;
            return (
              <View
                key={s.key}
                style={{
                  width,
                  paddingHorizontal: SPACING['2xl'],
                  justifyContent: 'center',
                }}
              >
                {/* Step indicator */}
                <StepIndicator current={s.step} total={s.totalSteps} tint={s.tint} />

                {/* Illustration circle */}
                <View style={{ alignItems: 'center', marginBottom: SPACING['2xl'] }}>
                  <View
                    style={{
                      width: 160,
                      height: 160,
                      borderRadius: 80,
                      backgroundColor: `${s.tint}10`,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: `${s.tint}25`,
                    }}
                  >
                    <View
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 50,
                        backgroundColor: `${s.tint}20`,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={48} color={s.tint} strokeWidth={1.5} />
                    </View>
                  </View>
                </View>

                {/* Step badge */}
                <View style={{ alignItems: 'center', marginBottom: SPACING.sm }}>
                  <View
                    style={{
                      backgroundColor: `${s.tint}12`,
                      paddingHorizontal: SPACING.base,
                      paddingVertical: 6,
                      borderRadius: RADIUS.full,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '700',
                        letterSpacing: 1.5,
                        color: s.tint,
                      }}
                    >
                      STEP {s.step}
                    </Text>
                  </View>
                </View>

                {/* Title */}
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

                {/* Body */}
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
                  {s.body}
                </Text>

                {/* Bullet points */}
                <View style={{ alignItems: 'center' }}>
                  {s.points.map((point, i) => (
                    <BulletPoint key={i} text={point} tint={s.tint} />
                  ))}
                </View>
              </View>
            );
          })}

          {/* Role selection page */}
          <View
            style={{
              width,
              paddingHorizontal: SPACING['2xl'],
              justifyContent: 'center',
            }}
          >
            {/* Step indicator */}
            <StepIndicator current={4} total={4} tint={LIGHT.accent} />

            {/* Header */}
            <View style={{ alignItems: 'center', marginBottom: SPACING.xl }}>
              <View
                style={{
                  backgroundColor: `${LIGHT.accent}12`,
                  paddingHorizontal: SPACING.base,
                  paddingVertical: 6,
                  borderRadius: RADIUS.full,
                  marginBottom: SPACING.sm,
                }}
              >
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    letterSpacing: 1.5,
                    color: LIGHT.accent,
                  }}
                >
                  ALMOST THERE
                </Text>
              </View>
              <Text
                style={[
                  TYPE.h1,
                  {
                    color: LIGHT.text,
                    textAlign: 'center',
                    letterSpacing: -0.5,
                    marginBottom: SPACING.xs,
                  },
                ]}
              >
                Join UrbanAV
              </Text>
              <Text
                style={[
                  TYPE.body,
                  {
                    color: LIGHT.textSecondary,
                    textAlign: 'center',
                    lineHeight: 22,
                  },
                ]}
              >
                Are you looking to rent equipment or provide it?
              </Text>
            </View>

            {/* Role cards */}
            <RoleCard
              role="buyer"
              selected={role === 'buyer'}
              onSelect={() => setRole('buyer')}
              icon={UserCircle}
              title="I'm a Buyer"
              subtitle="I need AV equipment for my events — weddings, corporate, parties, or any occasion"
              tint={NEON.purple}
            />
            <RoleCard
              role="supplier"
              selected={role === 'supplier'}
              onSelect={() => setRole('supplier')}
              icon={Store}
              title="I'm a Supplier"
              subtitle="I have AV equipment to rent out and want to reach more customers in my city"
              tint="#F97316"
            />

            {/* Selected role hint */}
            {role && (
              <View
                style={{
                  backgroundColor: `${role === 'buyer' ? NEON.purple : '#F97316'}10`,
                  padding: SPACING.md,
                  borderRadius: RADIUS.lg,
                  marginTop: SPACING.sm,
                }}
              >
                <Text style={[TYPE.caption, { color: LIGHT.textSecondary, textAlign: 'center' }]}>
                  {role === 'buyer'
                    ? "You'll be able to browse equipment, post requirements, and book vendors."
                    : "You'll be able to list equipment, manage inquiries, and grow your rental business."}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Pagination dots */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: SPACING.base,
          }}
        >
          {Array.from({ length: totalSlides }).map((_, i) => {
            const active = i === page;
            const slideData = i < slides.length ? slides[i] : null;
            const dotColor = active
              ? i < slides.length
                ? slideData?.tint || LIGHT.accent
                : LIGHT.accent
              : LIGHT.border;
            return (
              <View
                key={i}
                style={{
                  width: active ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  marginHorizontal: 3,
                  backgroundColor: dotColor,
                }}
              />
            );
          })}
        </View>

        {/* Bottom CTAs */}
        <View style={{ paddingHorizontal: SPACING['2xl'], paddingBottom: SPACING.lg }}>
          {!isRolePage ? (
            <BlackButton
              title={page === slides.length - 1 ? 'GET STARTED' : 'NEXT'}
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
                <Text style={{ color: LIGHT.textMuted }}>|</Text>
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
