import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MessageSquare, Eye, CalendarDays } from 'lucide-react-native';
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
import { ordersAPI } from '../api';

type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'completed' | 'cancelled';

const STATUS_COLORS: Record<OrderStatus, { bg: string; fg: string; label: string }> = {
  pending:   { bg: 'rgba(245, 158, 11, 0.15)', fg: '#B8700B', label: 'Pending' },
  confirmed: { bg: 'rgba(59, 130, 246, 0.15)', fg: '#1E40AF', label: 'Confirmed' },
  delivered: { bg: 'rgba(34, 224, 130, 0.18)', fg: '#0E7A3C', label: 'Delivered' },
  completed: { bg: 'rgba(123, 37, 244, 0.15)', fg: LIGHT.accent, label: 'Completed' },
  cancelled: { bg: 'rgba(255, 91, 110, 0.15)', fg: '#A8152B', label: 'Cancelled' },
};

const LOCAL_FALLBACK = [
  {
    id: '1',
    orderNumber: 'UAV-001',
    status: 'confirmed' as OrderStatus,
    supplier: 'ProAV Solutions',
    items: ['Epson Pro Laser Projector', 'LED Wall Panel P3.9'],
    total: 65000,
    eventDate: '2024-04-15',
    createdAt: '2024-04-01',
    advancePaid: 19500,
  },
  {
    id: '2',
    orderNumber: 'UAV-002',
    status: 'pending' as OrderStatus,
    supplier: 'SoundMaster Events',
    items: ['JBL EON Sound System', 'Shure SM58 Mics x4'],
    total: 28000,
    eventDate: '2024-04-20',
    createdAt: '2024-04-02',
    advancePaid: 0,
  },
  {
    id: '3',
    orderNumber: 'UAV-003',
    status: 'completed' as OrderStatus,
    supplier: 'DJ Pro Rentals',
    items: ['Pioneer DJ Controller', 'LED Moving Head Light x6'],
    total: 42000,
    eventDate: '2024-04-10',
    createdAt: '2024-03-28',
    advancePaid: 42000,
  },
];

const FILTERS: { label: string; value: string }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export default function OrdersScreen({ navigation }: any) {
  const [filter, setFilter] = useState('all');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      const res = await ordersAPI.getMyOrders();
      const list = (res.data?.orders ?? res.data ?? []).map((o: any) => ({
        id: o.id ?? o._id,
        orderNumber: o.orderNumber ?? `UAV-${(o.id ?? o._id ?? '').toString().slice(-3)}`,
        status: (o.status ?? 'pending') as OrderStatus,
        supplier: o.supplier?.businessName || o.supplierName || 'UrbanAV Vendor',
        items: (o.items ?? []).map((i: any) => i.name ?? i),
        total: o.total ?? 0,
        eventDate: o.eventDate ?? o.date ?? new Date().toISOString(),
        createdAt: o.createdAt ?? new Date().toISOString(),
        advancePaid: o.advancePaid ?? 0,
      }));
      setOrders(list.length ? list : LOCAL_FALLBACK);
    } catch {
      setOrders(LOCAL_FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // Refresh whenever the screen regains focus (e.g., after placing an order)
  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const visible =
    filter === 'all' ? orders : orders.filter((o) => o.status === filter);
  const activeCount = orders.filter((o) => o.status === 'confirmed').length;

  return (
    <LightScreenBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <FadeInView>
          <View
            style={{
              paddingHorizontal: SPACING.base,
              paddingTop: SPACING.base,
              paddingBottom: SPACING.sm,
            }}
          >
            <Text style={[TYPE.h2, { color: LIGHT.text, letterSpacing: -0.3 }]}>
              My Orders
            </Text>
            <Text style={[TYPE.caption, { color: LIGHT.textTertiary, marginTop: 2 }]}>
              {orders.length} total · {activeCount} active
            </Text>
          </View>
        </FadeInView>

        <FadeInView delay={60}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: SPACING.base,
              paddingBottom: SPACING.sm,
              gap: SPACING.xs,
            }}
          >
            {FILTERS.map((f) => {
              const selected = filter === f.value;
              return (
                <TouchableOpacity
                  key={f.value}
                  onPress={() => setFilter(f.value)}
                  activeOpacity={0.85}
                >
                  <View
                    style={{
                      paddingHorizontal: SPACING.base,
                      paddingVertical: SPACING.sm,
                      borderRadius: RADIUS.full,
                      backgroundColor: selected ? NEU.bg : LIGHT.card,
                      borderWidth: 1,
                      borderColor: selected ? `${NEON.purple}55` : LIGHT.border,
                      shadowColor: selected ? '#2D1558' : 'transparent',
                      shadowOffset: { width: 2, height: 2 },
                      shadowOpacity: selected ? 0.35 : 0,
                      shadowRadius: 6,
                      elevation: selected ? 3 : 0,
                    }}
                  >
                    <Text
                      style={[
                        TYPE.caption,
                        {
                          color: selected ? '#FFFFFF' : LIGHT.text,
                          fontWeight: selected ? '700' : '600',
                        },
                      ]}
                    >
                      {f.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </FadeInView>

        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={LIGHT.accent} />
          </View>
        ) : (
          <FlatList
            data={visible}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              padding: SPACING.base,
              paddingBottom: 24,
              gap: SPACING.sm,
            }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={LIGHT.accent}
              />
            }
            ListEmptyComponent={
              <View style={{ alignItems: 'center', padding: SPACING['2xl'] }}>
                <Text style={[TYPE.h4, { color: LIGHT.text, marginBottom: SPACING.xs }]}>
                  No orders found
                </Text>
                <Text
                  style={[
                    TYPE.body,
                    { color: LIGHT.textTertiary, marginBottom: SPACING.lg, textAlign: 'center' },
                  ]}
                >
                  {filter === 'all'
                    ? 'Post a requirement to get started'
                    : `No ${filter} orders`}
                </Text>
                <BlackButton
                  title="POST REQUIREMENT"
                  onPress={() => navigation.navigate('Requirement')}
                  fullWidth={false}
                  size="md"
                />
              </View>
            }
            renderItem={({ item, index }) => {
              const statusCfg =
                STATUS_COLORS[item.status as OrderStatus] || STATUS_COLORS.pending;
              return (
                <SlideUpView delay={index * 60}>
                  <LightCard padding={SPACING.base}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: SPACING.sm,
                      }}
                    >
                      <View>
                        <Text
                          style={[
                            TYPE.label,
                            { color: LIGHT.text, fontWeight: '700' },
                          ]}
                        >
                          {item.orderNumber}
                        </Text>
                        <Text style={[TYPE.tiny, { color: LIGHT.textMuted }]}>
                          Created{' '}
                          {new Date(item.createdAt).toLocaleDateString('en-IN')}
                        </Text>
                      </View>
                      <View
                        style={{
                          paddingHorizontal: SPACING.sm,
                          paddingVertical: 4,
                          borderRadius: RADIUS.full,
                          backgroundColor: statusCfg.bg,
                        }}
                      >
                        <Text
                          style={[
                            TYPE.tiny,
                            { color: statusCfg.fg, fontWeight: '700', letterSpacing: 0.5 },
                          ]}
                        >
                          {statusCfg.label.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        height: 1,
                        backgroundColor: LIGHT.divider,
                      }}
                    />

                    <View style={{ marginVertical: SPACING.sm }}>
                      <Text
                        style={[
                          TYPE.body,
                          { color: LIGHT.accent, fontWeight: '700', marginBottom: 2 },
                        ]}
                      >
                        {item.supplier}
                      </Text>
                      <Text
                        style={[
                          TYPE.caption,
                          { color: LIGHT.textTertiary },
                        ]}
                        numberOfLines={2}
                      >
                        {item.items.join(' · ')}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: SPACING.md,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <CalendarDays size={14} color={LIGHT.textTertiary} />
                        <Text
                          style={[
                            TYPE.caption,
                            { color: LIGHT.textTertiary, marginLeft: 4 },
                          ]}
                        >
                          {new Date(item.eventDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </Text>
                      </View>
                      <View style={{ alignItems: 'flex-end' }}>
                        <Text
                          style={[
                            TYPE.h4,
                            { color: LIGHT.text, fontWeight: '700' },
                          ]}
                        >
                          ₹{item.total.toLocaleString('en-IN')}
                        </Text>
                        {item.advancePaid > 0 && (
                          <Text
                            style={[
                              TYPE.tiny,
                              { color: SEMANTIC.success, fontWeight: '600' },
                            ]}
                          >
                            ₹{item.advancePaid.toLocaleString('en-IN')} advance paid
                          </Text>
                        )}
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('OrderDetail', { order: item })}
                        style={{
                          flex: 1,
                          height: 40,
                          borderRadius: RADIUS.full,
                          borderWidth: 1,
                          borderColor: LIGHT.border,
                          backgroundColor: LIGHT.cardSoft,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                        }}
                      >
                        <Eye size={14} color={LIGHT.text} />
                        <Text
                          style={[
                            TYPE.buttonSm,
                            { color: LIGHT.text, fontWeight: '700' },
                          ]}
                        >
                          Details
                        </Text>
                      </TouchableOpacity>
                      {item.status === 'confirmed' && (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate('Chat', { orderId: item.id })
                          }
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
                          <MessageSquare size={14} color="#FFFFFF" />
                          <Text
                            style={[
                              TYPE.buttonSm,
                              { color: '#FFFFFF', fontWeight: '700' },
                            ]}
                          >
                            Chat
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </LightCard>
                </SlideUpView>
              );
            }}
          />
        )}
      </SafeAreaView>
    </LightScreenBackground>
  );
}
