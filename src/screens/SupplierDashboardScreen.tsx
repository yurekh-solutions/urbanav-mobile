import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard, GlassButton } from '../components/ui';
import { COLORS, SIZES } from '../theme/colors';

const mockStats = {
  totalEarnings: 12450,
  activeOrders: 8,
  pendingRequests: 3,
  totalEquipment: 24,
  monthlyRevenue: 3200,
  rating: 4.8,
};

const mockOrders = [
  {
    id: '1',
    orderNumber: 'ORD-101',
    buyer: 'John Doe',
    items: ['Epson Projector', 'LED Wall'],
    total: 650,
    status: 'pending',
    eventDate: '2024-04-15',
  },
  {
    id: '2',
    orderNumber: 'ORD-102',
    buyer: 'Jane Smith',
    items: ['Sound System'],
    total: 200,
    status: 'confirmed',
    eventDate: '2024-04-18',
  },
];

const mockEquipment = [
  { id: '1', name: 'Epson Pro Laser Projector', price: '#ContactForPrice', status: 'available' },
  { id: '2', name: 'LED Wall Panel P3.9', price: '#ContactForPrice', status: 'rented' },
  { id: '3', name: 'Screen 120 inch', price: '#ContactForPrice', status: 'available' },
];

export default function SupplierDashboardScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState('orders');

  const renderOrder = ({ item }: any) => (
    <GlassCard style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderNumber}>{item.orderNumber}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                item.status === 'pending'
                  ? 'rgba(245, 158, 11, 0.2)'
                  : 'rgba(59, 130, 246, 0.2)',
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: item.status === 'pending' ? '#F59E0B' : '#3B82F6',
              },
            ]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      <Text style={styles.buyerName}>{item.buyer}</Text>
      <Text style={styles.orderItems}>{item.items.join(', ')}</Text>
      <View style={styles.orderFooter}>
        <Text style={styles.eventDate}>
          📅 {new Date(item.eventDate).toLocaleDateString()}
        </Text>
        <Text style={styles.orderTotal}>${item.total}</Text>
      </View>
      {item.status === 'pending' && (
        <View style={styles.orderActions}>
          <GlassButton
            title="Accept"
            onPress={() => {}}
            style={styles.acceptButton}
          />
          <GlassButton
            title="Reject"
            onPress={() => {}}
            variant="accent"
            style={styles.rejectButton}
          />
        </View>
      )}
    </GlassCard>
  );

  const renderEquipment = ({ item }: any) => (
    <GlassCard style={styles.equipmentCard}>
      <View>
        <Text style={styles.equipmentName}>{item.name}</Text>
        <Text style={styles.equipmentPrice}>
          {typeof item.price === 'number' ? `$${item.price}/day` : item.price}
        </Text>
      </View>
      <View
        style={[
          styles.availabilityBadge,
          {
            backgroundColor:
              item.status === 'available'
                ? 'rgba(34, 197, 94, 0.2)'
                : 'rgba(245, 158, 11, 0.2)',
          },
        ]}
      >
        <Text
          style={[
            styles.availabilityText,
            {
              color: item.status === 'available' ? '#22C55E' : '#F59E0B',
            },
          ]}
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
    </GlassCard>
  );

  return (
    <LinearGradient
      colors={[COLORS.backgroundGradientStart, COLORS.backgroundGradientMid, COLORS.backgroundGradientEnd]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Supplier Dashboard</Text>
          <TouchableOpacity>
            <Text style={{ fontSize: 24 }}>🔔</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <GlassCard style={styles.statCard}>
              <Text style={styles.statIcon}>💰</Text>
              <Text style={styles.statValue}>${mockStats.totalEarnings.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Total Earnings</Text>
            </GlassCard>
            <GlassCard style={styles.statCard}>
              <Text style={styles.statIcon}>📦</Text>
              <Text style={styles.statValue}>{mockStats.activeOrders}</Text>
              <Text style={styles.statLabel}>Active Orders</Text>
            </GlassCard>
            <GlassCard style={styles.statCard}>
              <Text style={styles.statIcon}>⏳</Text>
              <Text style={styles.statValue}>{mockStats.pendingRequests}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </GlassCard>
            <GlassCard style={styles.statCard}>
              <Text style={styles.statIcon}>🎯</Text>
              <Text style={styles.statValue}>{mockStats.totalEquipment}</Text>
              <Text style={styles.statLabel}>Equipment</Text>
            </GlassCard>
          </View>

          {/* Monthly Revenue */}
          <GlassCard style={styles.revenueCard}>
            <Text style={styles.revenueLabel}>This Month</Text>
            <Text style={styles.revenueValue}>${mockStats.monthlyRevenue.toLocaleString()}</Text>
            <Text style={styles.revenueGrowth}>↑ 12% from last month</Text>
          </GlassCard>

          {/* Tabs */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'orders' && styles.tabActive]}
              onPress={() => setActiveTab('orders')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'orders' && styles.tabTextActive,
                ]}
              >
                Orders ({mockOrders.length})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'equipment' && styles.tabActive]}
              onPress={() => setActiveTab('equipment')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'equipment' && styles.tabTextActive,
                ]}
              >
                Equipment ({mockEquipment.length})
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {activeTab === 'orders' ? (
            <FlatList
              data={mockOrders}
              renderItem={renderOrder}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <FlatList
              data={mockEquipment}
              renderItem={renderEquipment}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContent}
            />
          )}

          <GlassButton
            title="+ Add New Equipment"
            onPress={() => {}}
            style={styles.addButton}
          />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  headerTitle: {
    fontSize: SIZES.fontSizeXLarge,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SIZES.paddingSmall,
    gap: SIZES.paddingSmall,
  },
  statCard: {
    width: '48%',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: SIZES.fontSizeXLarge,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: SIZES.fontSizeSmall,
    color: COLORS.gray,
    textAlign: 'center',
  },
  revenueCard: {
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.paddingSmall,
    alignItems: 'center',
    padding: SIZES.paddingLarge,
  },
  revenueLabel: {
    fontSize: SIZES.fontSize,
    color: COLORS.gray,
    marginBottom: 8,
  },
  revenueValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.accentOrange,
    marginBottom: 8,
  },
  revenueGrowth: {
    fontSize: SIZES.fontSizeSmall,
    color: COLORS.success,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.padding,
    marginBottom: SIZES.paddingSmall,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: SIZES.borderRadiusSmall,
    backgroundColor: 'rgba(155, 89, 182, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(155, 89, 182, 0.3)',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tabText: {
    fontSize: SIZES.fontSize,
    color: COLORS.gray,
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: SIZES.padding,
    gap: SIZES.paddingSmall,
    paddingBottom: SIZES.padding,
  },
  orderCard: {
    padding: SIZES.padding,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderNumber: {
    fontSize: SIZES.fontSizeLarge,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: SIZES.fontSizeSmall,
    fontWeight: 'bold',
  },
  buyerName: {
    fontSize: SIZES.fontSize,
    color: COLORS.primaryLight,
    marginBottom: 4,
  },
  orderItems: {
    fontSize: SIZES.fontSizeSmall,
    color: COLORS.lightGray,
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventDate: {
    fontSize: SIZES.fontSizeSmall,
    color: COLORS.gray,
  },
  orderTotal: {
    fontSize: SIZES.fontSizeLarge,
    fontWeight: 'bold',
    color: COLORS.accentOrange,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: SIZES.paddingSmall,
  },
  acceptButton: {
    flex: 1,
    height: 40,
  },
  rejectButton: {
    flex: 1,
    height: 40,
  },
  equipmentCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.padding,
  },
  equipmentName: {
    fontSize: SIZES.fontSize,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  equipmentPrice: {
    fontSize: SIZES.fontSizeLarge,
    fontWeight: 'bold',
    color: COLORS.primaryLight,
  },
  availabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  availabilityText: {
    fontSize: SIZES.fontSizeSmall,
    fontWeight: 'bold',
  },
  addButton: {
    marginHorizontal: SIZES.padding,
    marginBottom: SIZES.paddingLarge,
  },
});
