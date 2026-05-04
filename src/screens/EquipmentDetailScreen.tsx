import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, Star, MessageSquare, ShoppingCart, Sparkles, CheckCircle } from 'lucide-react-native';
import {
  ScreenBackground,
  GlassCard,
  PrimaryButton,
  GhostButton,
  Badge,
  RatingStars,
  Avatar,
  Divider,
  FadeInView,
  SlideUpView,
  PriceTag,
} from '../components/ui';
import { BRAND, NEON, TEXT, SURFACE, GLASS, SEMANTIC } from '../theme/colors';
import { SPACING, RADIUS } from '../theme/spacing';
import { TYPE } from '../theme/typography';
import { useCartStore, useEquipmentStore } from '../store';
import { EQUIPMENT_DATA } from '../data/equipment';
import {
  fullEquipmentDatabase,
  getEquipmentById,
  getEquipmentImage,
} from '../data/equipment-database';

const RENTAL_DAYS = [1, 2, 3, 5, 7];

// Normalize any item (store shape / EQUIPMENT_DATA shape / fullEquipmentDatabase shape)
// into a single view model the UI below can render safely.
function normalizeEquipment(raw: any): any | null {
  if (!raw) return null;

  const id = raw.id || raw._id;
  const category = raw.category || '';

  // Image may be: a require() number, a { uri } object, a raw URI string, or missing.
  let image: any = raw.image;
  if (!image && Array.isArray(raw.images) && raw.images[0]) {
    image = { uri: raw.images[0] };
  }
  if (typeof image === 'string') image = { uri: image };
  if (!image && id) image = getEquipmentImage(id, category);

  // Specs may be: [{label,value}], string[], or undefined.
  let specs: Array<{ label: string; value: string }> = [];
  if (Array.isArray(raw.specs)) {
    specs = raw.specs
      .map((s: any, idx: number) => {
        if (!s) return null;
        if (typeof s === 'string') return { label: `Feature ${idx + 1}`, value: s };
        if (s.label && s.value) return { label: String(s.label), value: String(s.value) };
        return null;
      })
      .filter(Boolean) as Array<{ label: string; value: string }>;
  }

  return {
    id,
    name: raw.name || 'Equipment',
    category,
    image,
    price: raw.price ?? '#ContactForPrice',
    description:
      raw.description ||
      (raw.tags && raw.tags.length
        ? `Professional-grade ${category.replace(/-/g, ' ')} available for rental. Tags: ${raw.tags.slice(0, 4).join(', ')}.`
        : `Professional-grade ${category.replace(/-/g, ' ') || 'AV'} equipment available for event rental.`),
    supplier:
      raw.supplier ||
      raw.vendor ||
      raw.vendor?.businessName ||
      raw.vendor?.name ||
      'UrbanAV Partner',
    rating: typeof raw.rating === 'number' && raw.rating > 0 ? raw.rating : 4.8,
    specs,
  };
}

export default function EquipmentDetailScreen({ route, navigation }: any) {
  const { id, equipment: passedEquip } = route.params ?? {};
  const { addToCart } = useCartStore();
  const storeItems = useEquipmentStore((s) => s.items);
  const fetchAll = useEquipmentStore((s) => s.fetchAll);

  // If store hasn't loaded yet (cold start / deep-link into detail screen), trigger it.
  useEffect(() => {
    if (!storeItems.length) fetchAll().catch(() => {});
  }, [storeItems.length, fetchAll]);

  // Unified lookup: pre-passed item → store → full 120+ catalog → legacy 67-item static.
  const equipment = useMemo(() => {
    if (passedEquip) return normalizeEquipment(passedEquip);
    if (!id) return null;
    const fromStore = storeItems.find((e: any) => e.id === id);
    if (fromStore) return normalizeEquipment(fromStore);
    const fromFull = getEquipmentById(id);
    if (fromFull) return normalizeEquipment(fromFull);
    const fromStatic = EQUIPMENT_DATA.find((eq) => eq.id === id);
    if (fromStatic) return normalizeEquipment(fromStatic);
    return null;
  }, [id, passedEquip, storeItems]);

  const [rentalDays, setRentalDays] = useState(1);
  const [added, setAdded] = useState(false);

  if (!equipment) {
    return (
      <ScreenBackground>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.lg }}>
            <Text style={[TYPE.h3, { textAlign: 'center', marginBottom: SPACING.base }]}>
              Equipment not found
            </Text>
            <GhostButton title="Go Back" onPress={() => navigation.goBack()} fullWidth={false} />
          </View>
        </SafeAreaView>
      </ScreenBackground>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: equipment.id,
      name: equipment.name,
      image: equipment.image,
      price: equipment.price,
      quantity: 1,
      rentalDays,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
    Alert.alert('Added to Cart', `${equipment.name} added for ${rentalDays} day${rentalDays > 1 ? 's' : ''}.`);
  };

  const handleInquire = () => {
    navigation.navigate('Requirement');
  };

  return (
    <ScreenBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          {/* Image */}
          <View style={{ position: 'relative' }}>
            <Image
              source={equipment.image}
              style={{ width: '100%', height: 280 }}
              resizeMode="cover"
            />
            {/* Back button overlay */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                position: 'absolute',
                top: SPACING.base,
                left: SPACING.base,
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(0,0,0,0.55)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronLeft size={22} color="#FFF" />
            </TouchableOpacity>

            {/* Badges */}
            <View style={{ position: 'absolute', top: SPACING.base, right: SPACING.base, gap: SPACING.xs }}>
              <Badge label="Contact for Price" tone="brand" />
            </View>
          </View>

          <View style={{ padding: SPACING.base }}>
            {/* Title + rating */}
            <FadeInView>
              <View style={{ marginBottom: SPACING.base }}>
                <Text style={[TYPE.caption, { color: NEON.glow, textTransform: 'uppercase', fontWeight: '700', marginBottom: SPACING.xs }]}>
                  {equipment.category?.replace(/-/g, ' ')}
                </Text>
                <Text style={[TYPE.h2, { marginBottom: SPACING.xs }]}>{equipment.name}</Text>
                <Text style={[TYPE.body, { color: TEXT.tertiary }]}>by {equipment.supplier}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm }}>
                  <RatingStars value={equipment.rating ?? 4.8} size={16} />
                  <Text style={[TYPE.caption, { color: TEXT.tertiary, marginLeft: SPACING.sm }]}>
                    {(equipment.rating ?? 4.8).toFixed(1)} rating · 120+ orders
                  </Text>
                </View>
              </View>
            </FadeInView>

            {/* Pricing + duration */}
            <SlideUpView delay={80}>
              <GlassCard style={{ marginBottom: SPACING.base }}>
                <Text style={[TYPE.label, { color: TEXT.tertiary, marginBottom: SPACING.xs }]}>
                  Rental Price
                </Text>
                <PriceTag value="#ContactForPrice" size="lg" />

                <Divider style={{ marginVertical: SPACING.md }} />

                <Text style={[TYPE.label, { color: TEXT.secondary, marginBottom: SPACING.sm }]}>
                  Select Duration
                </Text>
                <View style={{ flexDirection: 'row', gap: SPACING.sm, flexWrap: 'wrap' }}>
                  {RENTAL_DAYS.map((d) => (
                    <TouchableOpacity
                      key={d}
                      onPress={() => setRentalDays(d)}
                      style={{
                        paddingHorizontal: SPACING.md,
                        paddingVertical: SPACING.sm,
                        borderRadius: RADIUS.md,
                        backgroundColor: rentalDays === d ? BRAND[500] : GLASS.tier1,
                        borderWidth: 1.5,
                        borderColor: rentalDays === d ? NEON.glow : GLASS.tier1Border,
                      }}
                    >
                      <Text style={[TYPE.label, { color: '#FFF' }]}>{d}d</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: SPACING.md,
                    paddingTop: SPACING.md,
                    borderTopWidth: 1,
                    borderTopColor: GLASS.tier2Border,
                  }}
                >
                  <Text style={[TYPE.body, { color: TEXT.secondary }]}>
                    Duration: {rentalDays} day{rentalDays > 1 ? 's' : ''}
                  </Text>
                  <Text style={[TYPE.caption, { color: NEON.glow }]}>Contact for exact quote</Text>
                </View>
              </GlassCard>
            </SlideUpView>

            {/* Description */}
            {equipment.description && (
              <SlideUpView delay={120}>
                <View style={{ marginBottom: SPACING.base }}>
                  <Text style={[TYPE.h4, { marginBottom: SPACING.sm }]}>About This Equipment</Text>
                  <Text style={[TYPE.body, { color: TEXT.secondary, lineHeight: 22 }]}>
                    {equipment.description}
                  </Text>
                </View>
              </SlideUpView>
            )}

            {/* Specs */}
            {equipment.specs && equipment.specs.length > 0 && (
              <SlideUpView delay={160}>
                <GlassCard tier="tier2" style={{ marginBottom: SPACING.base }}>
                  <Text style={[TYPE.h4, { marginBottom: SPACING.md }]}>Specifications</Text>
                  {equipment.specs.map((spec: any, i: number) => (
                    <View key={i}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          paddingVertical: SPACING.sm,
                        }}
                      >
                        <Text style={[TYPE.body, { color: TEXT.tertiary }]}>{spec.label}</Text>
                        <Text style={[TYPE.body, { color: TEXT.primary, fontWeight: '600' }]}>{spec.value}</Text>
                      </View>
                      {i < equipment.specs.length - 1 && <Divider />}
                    </View>
                  ))}
                </GlassCard>
              </SlideUpView>
            )}

            {/* Supplier card */}
            <SlideUpView delay={200}>
              <GlassCard style={{ marginBottom: SPACING.base }}>
                <Text style={[TYPE.h4, { marginBottom: SPACING.md }]}>Supplier</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md }}>
                  <Avatar name={equipment.supplier} size={48} />
                  <View style={{ flex: 1, marginLeft: SPACING.md }}>
                    <Text style={[TYPE.body, { fontWeight: '700' }]}>{equipment.supplier}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                      <RatingStars value={4.8} size={13} />
                      <Text style={[TYPE.tiny, { color: TEXT.tertiary, marginLeft: 6 }]}>4.8 · 120+ orders</Text>
                    </View>
                  </View>
                </View>
                <GhostButton
                  title="Message Supplier"
                  onPress={() => navigation.navigate('Chat', { orderId: null })}
                  leftIcon={<MessageSquare size={16} color={NEON.glow} />}
                  size="sm"
                />
              </GlassCard>
            </SlideUpView>

            {/* CTA buttons */}
            <SlideUpView delay={240}>
              <View style={{ gap: SPACING.sm }}>
                <PrimaryButton
                  title={added ? 'Added to Cart!' : 'Add to Cart'}
                  onPress={handleAddToCart}
                  leftIcon={added
                    ? <CheckCircle size={18} color="#FFF" />
                    : <ShoppingCart size={18} color="#FFF" />
                  }
                />
                <GhostButton
                  title="Post a Requirement Instead"
                  onPress={handleInquire}
                  leftIcon={<Sparkles size={16} color={NEON.glow} />}
                />
              </View>
            </SlideUpView>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenBackground>
  );
}
