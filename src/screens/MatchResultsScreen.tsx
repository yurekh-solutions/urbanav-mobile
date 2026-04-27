import React, { useEffect, useState, useMemo } from 'react';
import { View, ScrollView, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MapPin, Star, TrendingUp, Clock, Filter, Sparkles } from 'lucide-react-native';
import {
  ScreenBackground,
  ScreenHeader,
  GlassCard,
  Chip,
  Badge,
  PrimaryButton,
  GhostButton,
  Avatar,
  Skeleton,
  StaggeredList,
  FadeInView,
  EmptyState,
  Typography,
  RatingStars,
  PriceTag,
  PressableScale,
} from '../components/ui';
import { BRAND, SURFACE, TEXT, SEMANTIC } from '../theme/colors';
import { SPACING, RADIUS } from '../theme/spacing';
import { TYPE } from '../theme/typography';
import { useRequirementStore } from '../store';

type VendorMatch = {
  id: string;
  name: string;
  businessName: string;
  rating: number;
  totalOrders: number;
  distanceKm: number;
  responseTimeMins: number;
  estimatedPrice: number;
  score: number;
  mocked?: boolean;
  tags?: string[];
};

const RADIUS_OPTIONS = ['5 km', '10 km', '25 km', 'Any'];
const RATING_OPTIONS = ['All', '4+', '4.5+'];
const PRICE_OPTIONS = ['All', 'Low', 'Mid', 'Premium'];

export default function MatchResultsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const requirementId = route.params?.requirementId;
  const fetchMatches = useRequirementStore((s) => s.fetchMatches);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [vendors, setVendors] = useState<VendorMatch[]>([]);
  const [radius, setRadius] = useState('10 km');
  const [rating, setRating] = useState('All');
  const [price, setPrice] = useState('All');

  const load = async () => {
    try {
      const result = await fetchMatches(requirementId);
      setVendors(result);
    } catch {
      setVendors([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
  }, [requirementId]);

  const filtered = useMemo(() => {
    return vendors.filter((v) => {
      if (radius === '5 km' && v.distanceKm > 5) return false;
      if (radius === '10 km' && v.distanceKm > 10) return false;
      if (radius === '25 km' && v.distanceKm > 25) return false;
      if (rating === '4+' && v.rating < 4) return false;
      if (rating === '4.5+' && v.rating < 4.5) return false;
      if (price === 'Low' && v.estimatedPrice > 25000) return false;
      if (price === 'Mid' && (v.estimatedPrice < 25000 || v.estimatedPrice > 75000)) return false;
      if (price === 'Premium' && v.estimatedPrice < 75000) return false;
      return true;
    });
  }, [vendors, radius, rating, price]);

  return (
    <ScreenBackground>
      <ScreenHeader title="Top Matches" subtitle={`${filtered.length} vendors ranked for you`} onBack={() => navigation.goBack()} />

      <View style={{ paddingHorizontal: SPACING.base, paddingBottom: SPACING.sm }}>
        <FadeInView>
          <GlassCard tier="tier2" padding={SPACING.md}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm }}>
              <Filter size={16} color={BRAND[600]} />
              <Text style={[TYPE.label, { marginLeft: SPACING.sm, color: TEXT.secondary }]}>FILTERS</Text>
            </View>
            <Text style={[TYPE.caption, { color: TEXT.tertiary, marginBottom: 4 }]}>Radius</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {RADIUS_OPTIONS.map((r) => (
                <Chip key={r} label={r} selected={radius === r} onPress={() => setRadius(r)} />
              ))}
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <View style={{ flex: 1 }}>
                <Text style={[TYPE.caption, { color: TEXT.tertiary, marginBottom: 4 }]}>Rating</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {RATING_OPTIONS.map((r) => (
                    <Chip key={r} label={r} selected={rating === r} onPress={() => setRating(r)} />
                  ))}
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[TYPE.caption, { color: TEXT.tertiary, marginBottom: 4 }]}>Price</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {PRICE_OPTIONS.map((p) => (
                    <Chip key={p} label={p} selected={price === p} onPress={() => setPrice(p)} />
                  ))}
                </View>
              </View>
            </View>
          </GlassCard>
        </FadeInView>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: SPACING.base, paddingTop: 0, paddingBottom: SPACING['4xl'] }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={BRAND[500]} />}
      >
        {loading ? (
          <View>
            {[0, 1, 2].map((i) => (
              <GlassCard key={i} style={{ marginBottom: SPACING.md }}>
                <View style={{ flexDirection: 'row' }}>
                  <Skeleton width={48} height={48} radius={24} />
                  <View style={{ flex: 1, marginLeft: SPACING.md }}>
                    <Skeleton width={'60%'} height={14} style={{ marginBottom: 8 }} />
                    <Skeleton width={'40%'} height={12} />
                  </View>
                </View>
                <Skeleton height={48} style={{ marginTop: SPACING.md }} />
              </GlassCard>
            ))}
          </View>
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No vendors match your filters"
            message="Try expanding the radius or relaxing price constraints."
            action={<GhostButton title="Reset filters" onPress={() => { setRadius('Any'); setRating('All'); setPrice('All'); }} fullWidth={false} />}
          />
        ) : (
          <StaggeredList stagger={60}>
            {filtered.map((v, idx) => (
              <PressableScale
                key={v.id}
                onPress={() => navigation.navigate('Inquiry', { vendor: v, requirementId })}
                style={{ marginBottom: SPACING.md }}
              >
                <GlassCard>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar name={v.businessName || v.name} size={52} />
                    <View style={{ flex: 1, marginLeft: SPACING.md }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={TYPE.h4} numberOfLines={1}>{v.businessName || v.name}</Text>
                        {idx === 0 && <Badge label="Best Match" tone="brand" style={{ marginLeft: SPACING.sm }} />}
                        {v.mocked && <Badge label="Demo" tone="neutral" style={{ marginLeft: SPACING.sm }} />}
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <RatingStars value={v.rating} size={14} />
                        <Text style={[TYPE.caption, { color: TEXT.tertiary, marginLeft: 6 }]}>
                          {v.rating.toFixed(1)} · {v.totalOrders} orders
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', marginTop: SPACING.md, flexWrap: 'wrap' }}>
                    <MetricPill icon={<MapPin size={12} color={BRAND[600]} />} label={`${v.distanceKm.toFixed(1)} km`} />
                    <MetricPill icon={<Clock size={12} color={BRAND[600]} />} label={`${v.responseTimeMins}m reply`} />
                    <MetricPill icon={<TrendingUp size={12} color={BRAND[600]} />} label={`Score ${Math.round(v.score * 100)}`} />
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.md }}>
                    <View>
                      <Text style={[TYPE.caption, { color: TEXT.tertiary }]}>Estimated</Text>
                      <PriceTag value={v.estimatedPrice} suffix="pkg" size="md" />
                    </View>
                    <PrimaryButton
                      title="Send Inquiry"
                      onPress={() => navigation.navigate('Inquiry', { vendor: v, requirementId })}
                      size="sm"
                      fullWidth={false}
                      leftIcon={<Sparkles size={14} color="#FFF" />}
                    />
                  </View>
                </GlassCard>
              </PressableScale>
            ))}
          </StaggeredList>
        )}
      </ScrollView>
    </ScreenBackground>
  );
}

const MetricPill: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: SPACING.sm,
      paddingVertical: 4,
      borderRadius: RADIUS.full,
      backgroundColor: BRAND[50],
      marginRight: SPACING.xs,
      marginBottom: SPACING.xs,
    }}
  >
    {icon}
    <Text style={[TYPE.caption, { color: BRAND[700], marginLeft: 4, fontWeight: '600' }]}>{label}</Text>
  </View>
);
