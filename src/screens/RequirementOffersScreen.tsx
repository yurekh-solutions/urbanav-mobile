import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ChevronLeft, Star, Package, MessageSquare, Calendar, MapPin, Wallet } from 'lucide-react-native';
import {
  LightScreenBackground,
  LightCard,
  BlackButton,
  FadeInView,
  SlideUpView,
  LIGHT,
  NEU,
  NEON,
  SPACING,
  RADIUS,
  TYPE,
  SEMANTIC,
} from '../components/ui';
import { requirementAPI } from '../api';

export default function RequirementOffersScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { requirementId } = route.params;

  const [offers, setOffers] = useState<any[]>([]);
  const [requirement, setRequirement] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selecting, setSelecting] = useState(false);
  const [confirmModal, setConfirmModal] = useState<any>(null);

  const loadOffers = useCallback(async () => {
    try {
      const res = await requirementAPI.getOffers(requirementId);
      const data = res.data;
      setOffers(data?.offers ?? []);
      setRequirement(data?.requirement ?? null);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Could not load offers');
    } finally {
      setLoading(false);
    }
  }, [requirementId]);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOffers();
    setRefreshing(false);
  };

  const handleSelectOffer = async (offer: any) => {
    setSelecting(true);
    try {
      await requirementAPI.selectOffer(requirementId, offer.id || offer._id);
      setConfirmModal(null);
      Alert.alert('Order Created!', 'Your order has been placed successfully.', [
        { text: 'View Orders', onPress: () => navigation.navigate('Main', { screen: 'Orders' }) },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Could not select offer');
    } finally {
      setSelecting(false);
    }
  };

  const formatPrice = (price: number) => `₹${price?.toLocaleString('en-IN')}`;

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={12}
          color={i <= Math.round(rating) ? '#FFB547' : LIGHT.textMuted}
          fill={i <= Math.round(rating) ? '#FFB547' : 'transparent'}
        />
      );
    }
    return stars;
  };

  const renderHeader = () => {
    if (!requirement) return null;
    return (
      <FadeInView>
        <LightCard padding={SPACING.base} style={{ marginBottom: SPACING.sm }}>
          <Text style={[TYPE.h4, { color: LIGHT.text, marginBottom: SPACING.xs }]}>
            {requirement.eventType} Event
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm }}>
            {requirement.date && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Calendar size={12} color={LIGHT.textTertiary} />
                <Text style={[TYPE.caption, { color: LIGHT.textTertiary, marginLeft: 4 }]}>
                  {new Date(requirement.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </Text>
              </View>
            )}
            {requirement.address && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MapPin size={12} color={LIGHT.textTertiary} />
                <Text style={[TYPE.caption, { color: LIGHT.textTertiary, marginLeft: 4 }]} numberOfLines={1}>
                  {requirement.city || requirement.address}
                </Text>
              </View>
            )}
            {requirement.budget && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Wallet size={12} color={LIGHT.textTertiary} />
                <Text style={[TYPE.caption, { color: LIGHT.textTertiary, marginLeft: 4 }]}>
                  {requirement.budget}
                </Text>
              </View>
            )}
          </View>
          <View
            style={{
              marginTop: SPACING.sm,
              paddingHorizontal: SPACING.sm,
              paddingVertical: 4,
              backgroundColor: LIGHT.accentSoft,
              borderRadius: RADIUS.full,
              alignSelf: 'flex-start',
            }}
          >
            <Text style={[TYPE.tiny, { color: LIGHT.accent, fontWeight: '700' }]}>
              {offers.length} {offers.length === 1 ? 'OFFER' : 'OFFERS'} RECEIVED
            </Text>
          </View>
        </LightCard>
      </FadeInView>
    );
  };

  const renderOfferCard = ({ item, index }: { item: any; index: number }) => {
    const supplier = item.vendorId || item.supplier || {};
    const supplierName = supplier.businessName || supplier.name || 'Supplier';
    const rating = supplier.rating || supplier.averageRating || 0;
    const totalOrders = supplier.totalOrders || supplier.completedOrders || 0;

    return (
      <SlideUpView delay={index * 60}>
        <LightCard padding={SPACING.base} style={{ marginBottom: SPACING.sm }}>
          {/* Price */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm }}>
            <Text style={[TYPE.h2, { color: LIGHT.accent, fontWeight: '700' }]}>
              {formatPrice(item.offerPrice || item.offeredPrice || item.price || 0)}
            </Text>
            {index === 0 && (
              <View style={{ paddingHorizontal: SPACING.sm, paddingVertical: 3, backgroundColor: 'rgba(34, 224, 130, 0.15)', borderRadius: RADIUS.full }}>
                <Text style={[TYPE.tiny, { color: '#0E7A3C', fontWeight: '700' }]}>BEST PRICE</Text>
              </View>
            )}
          </View>

          {/* Supplier info */}
          <View style={{ marginBottom: SPACING.sm }}>
            <Text style={[TYPE.body, { color: LIGHT.text, fontWeight: '700', marginBottom: 2 }]}>
              {supplierName}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
              {rating > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                  {renderStars(rating)}
                  <Text style={[TYPE.caption, { color: LIGHT.textTertiary, marginLeft: 4 }]}>
                    {rating.toFixed(1)}
                  </Text>
                </View>
              )}
              {totalOrders > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Package size={11} color={LIGHT.textTertiary} />
                  <Text style={[TYPE.caption, { color: LIGHT.textTertiary, marginLeft: 3 }]}>
                    {totalOrders} orders
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Offer note */}
          {(item.offerNote || item.note) && (
            <View style={{ backgroundColor: LIGHT.cardSoft, borderRadius: RADIUS.sm, padding: SPACING.sm, marginBottom: SPACING.md }}>
              <Text style={[TYPE.bodySm, { color: LIGHT.textSecondary }]}>
                {item.offerNote || item.note}
              </Text>
            </View>
          )}

          {/* Select button */}
          <TouchableOpacity
            onPress={() => setConfirmModal(item)}
            activeOpacity={0.85}
            style={{
              height: 44,
              borderRadius: RADIUS.full,
              backgroundColor: LIGHT.btnBlack,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={[TYPE.buttonSm, { color: '#FFFFFF', fontWeight: '700' }]}>
              SELECT THIS OFFER
            </Text>
          </TouchableOpacity>
        </LightCard>
      </SlideUpView>
    );
  };

  return (
    <LightScreenBackground>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Header */}
        <FadeInView>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.base, paddingTop: SPACING.base, paddingBottom: SPACING.sm }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: SPACING.sm }}>
              <ChevronLeft size={24} color={LIGHT.text} />
            </TouchableOpacity>
            <View>
              <Text style={[TYPE.h2, { color: LIGHT.text, letterSpacing: -0.3 }]}>
                Compare Offers
              </Text>
              <Text style={[TYPE.caption, { color: LIGHT.textTertiary, marginTop: 2 }]}>
                Choose the best deal for your event
              </Text>
            </View>
          </View>
        </FadeInView>

        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={LIGHT.accent} />
            <Text style={[TYPE.body, { color: LIGHT.textTertiary, marginTop: SPACING.sm }]}>
              Loading offers...
            </Text>
          </View>
        ) : (
          <FlatList
            data={offers}
            keyExtractor={(item) => item.id || item._id || String(Math.random())}
            contentContainerStyle={{ padding: SPACING.base, paddingBottom: 24 }}
            ListHeaderComponent={renderHeader}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={LIGHT.accent} />
            }
            ListEmptyComponent={
              <View style={{ alignItems: 'center', padding: SPACING['2xl'] }}>
                <MessageSquare size={48} color={LIGHT.textMuted} />
                <Text style={[TYPE.h4, { color: LIGHT.text, marginTop: SPACING.base, marginBottom: SPACING.xs }]}>
                  No offers yet
                </Text>
                <Text style={[TYPE.body, { color: LIGHT.textTertiary, textAlign: 'center' }]}>
                  Suppliers are reviewing your requirement. You'll be notified when offers arrive.
                </Text>
              </View>
            }
            renderItem={renderOfferCard}
          />
        )}

        {/* Confirmation Modal */}
        <Modal
          visible={!!confirmModal}
          transparent
          animationType="fade"
          onRequestClose={() => !selecting && setConfirmModal(null)}
        >
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: SPACING.xl }}>
            <View style={{ backgroundColor: LIGHT.card, borderRadius: RADIUS.lg, padding: SPACING.xl, width: '100%', maxWidth: 340 }}>
              <Text style={[TYPE.h3, { color: LIGHT.text, marginBottom: SPACING.sm, textAlign: 'center' }]}>
                Accept Offer?
              </Text>
              <Text style={[TYPE.body, { color: LIGHT.textSecondary, textAlign: 'center', marginBottom: SPACING.lg }]}>
                Accept {formatPrice(confirmModal?.offerPrice || confirmModal?.offeredPrice || confirmModal?.price || 0)} offer from{' '}
                <Text style={{ fontWeight: '700', color: LIGHT.text }}>
                  {confirmModal?.vendorId?.businessName || confirmModal?.vendorId?.name || confirmModal?.supplier?.businessName || confirmModal?.supplier?.name || 'Supplier'}
                </Text>
                ?
              </Text>

              <TouchableOpacity
                onPress={() => handleSelectOffer(confirmModal)}
                disabled={selecting}
                style={{
                  height: 48,
                  borderRadius: RADIUS.full,
                  backgroundColor: LIGHT.btnBlack,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: SPACING.sm,
                  opacity: selecting ? 0.6 : 1,
                }}
              >
                {selecting ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={[TYPE.button, { color: '#FFFFFF', fontWeight: '700' }]}>
                    CONFIRM
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setConfirmModal(null)}
                disabled={selecting}
                style={{
                  height: 48,
                  borderRadius: RADIUS.full,
                  backgroundColor: LIGHT.cardSoft,
                  borderWidth: 1,
                  borderColor: LIGHT.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={[TYPE.button, { color: LIGHT.text, fontWeight: '600' }]}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </LightScreenBackground>
  );
}
