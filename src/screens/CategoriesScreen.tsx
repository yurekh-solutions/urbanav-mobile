import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ChevronRight,
  X,
  Film,
  Monitor,
  Volume2,
  Mic,
  Music,
  Lightbulb,
  Camera,
  Tv,
  Plug,
  Grid3x3,
} from 'lucide-react-native';
import {
  LightScreenBackground,
  LightSearchBar,
  LightCard,
  LIGHT,
  SPACING,
  RADIUS,
  TYPE,
  FadeInView,
  SlideUpView,
} from '../components/ui';
import { useEquipmentStore } from '../store';

const CATEGORIES = [
  { id: 'all', name: 'All', key: 'all', Icon: Grid3x3, color: LIGHT.accent },
  { id: '1', name: 'Projectors', key: 'projectors', Icon: Film, color: '#B83DF5' },
  { id: '2', name: 'LED Walls', key: 'led-walls', Icon: Monitor, color: '#E14D8A' },
  { id: '3', name: 'Sound', key: 'sound-systems', Icon: Volume2, color: '#3B82F6' },
  { id: '4', name: 'Microphones', key: 'microphones', Icon: Mic, color: '#22E082' },
  { id: '5', name: 'DJ', key: 'dj-equipment', Icon: Music, color: '#F59E0B' },
  { id: '6', name: 'Lighting', key: 'lighting', Icon: Lightbulb, color: '#CC6BFF' },
  { id: '7', name: 'Video', key: 'video-recording', Icon: Camera, color: '#EC4899' },
  { id: '8', name: 'LED TVs', key: 'led-tvs', Icon: Tv, color: '#06B6D4' },
  { id: '9', name: 'Cables', key: 'cables-accessories', Icon: Plug, color: '#64748B' },
];

export default function CategoriesScreen({ route, navigation }: any) {
  const [selectedKey, setSelectedKey] = useState<string>(
    route?.params?.categoryKey ?? 'all'
  );
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { items, loading, fetchAll } = useEquipmentStore();

  useEffect(() => {
    fetchAll();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAll(true);
    setRefreshing(false);
  };

  const filteredEquipment = useMemo(() => {
    let list = items;
    if (selectedKey && selectedKey !== 'all') {
      list = list.filter((e) => e.category === selectedKey);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
      );
    }
    return list.slice(0, 40);
  }, [items, selectedKey, search]);

  const activeCat = CATEGORIES.find((c) => c.key === selectedKey);

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
              Browse Equipment
            </Text>
            <Text
              style={[
                TYPE.caption,
                { color: LIGHT.textTertiary, marginTop: 2 },
              ]}
            >
              {activeCat && activeCat.key !== 'all'
                ? `Viewing: ${activeCat.name}`
                : 'All categories'}
            </Text>
          </View>
        </FadeInView>

        <FadeInView delay={60}>
          <View
            style={{ paddingHorizontal: SPACING.base, marginBottom: SPACING.md }}
          >
            <LightSearchBar
              value={search}
              onChangeText={setSearch}
              placeholder="Search equipment..."
            />
          </View>
        </FadeInView>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={LIGHT.accent}
            />
          }
        >
          {/* Horizontal category pill bar — flat, no blur */}
          <SlideUpView delay={80}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: SPACING.base,
                gap: SPACING.xs,
                paddingBottom: SPACING.base,
              }}
            >
              {CATEGORIES.map((cat) => {
                const IconComp = cat.Icon;
                const selected = selectedKey === cat.key;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    onPress={() => setSelectedKey(cat.key)}
                    activeOpacity={0.85}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                        paddingHorizontal: SPACING.base,
                        paddingVertical: SPACING.sm,
                        borderRadius: RADIUS.full,
                        backgroundColor: selected ? cat.color : LIGHT.card,
                        borderWidth: 1,
                        borderColor: selected ? cat.color : LIGHT.border,
                      }}
                    >
                      <IconComp
                        size={16}
                        color={selected ? '#FFFFFF' : cat.color}
                        strokeWidth={1.75}
                      />
                      <Text
                        style={[
                          TYPE.caption,
                          {
                            color: selected ? '#FFFFFF' : LIGHT.text,
                            fontWeight: selected ? '700' : '600',
                          },
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </SlideUpView>

          {/* Equipment list */}
          <SlideUpView delay={160}>
            <View style={{ paddingHorizontal: SPACING.base }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: SPACING.md,
                }}
              >
                <Text style={[TYPE.h3, { color: LIGHT.text }]}>
                  {filteredEquipment.length} items
                </Text>
                {selectedKey && selectedKey !== 'all' && (
                  <TouchableOpacity
                    onPress={() => setSelectedKey('all')}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Text
                      style={[
                        TYPE.caption,
                        { color: LIGHT.accent, marginRight: 4, fontWeight: '600' },
                      ]}
                    >
                      Clear
                    </Text>
                    <X size={14} color={LIGHT.accent} />
                  </TouchableOpacity>
                )}
              </View>

              {loading && items.length === 0 ? (
                <View style={{ padding: SPACING['2xl'], alignItems: 'center' }}>
                  <ActivityIndicator size="large" color={LIGHT.accent} />
                </View>
              ) : filteredEquipment.length === 0 ? (
                <LightCard tinted padding={SPACING.lg}>
                  <Text
                    style={[
                      TYPE.body,
                      { color: LIGHT.textTertiary, textAlign: 'center' },
                    ]}
                  >
                    No equipment found.
                  </Text>
                </LightCard>
              ) : (
                filteredEquipment.map((item) => (
                  <LightCard
                    key={item.id}
                    style={{ marginBottom: SPACING.sm }}
                    padding={SPACING.sm}
                    onPress={() =>
                      navigation.navigate('EquipmentDetail', { id: item.id })
                    }
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Image
                        source={
                          typeof item.image === 'string'
                            ? { uri: item.image }
                            : item.image
                        }
                        style={{
                          width: 80,
                          height: 80,
                          borderRadius: RADIUS.md,
                          marginRight: SPACING.md,
                          backgroundColor: LIGHT.cardSoft,
                        }}
                        resizeMode="cover"
                      />
                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text
                          style={[TYPE.h4, { color: LIGHT.text, fontSize: 15 }]}
                          numberOfLines={2}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={[
                            TYPE.caption,
                            {
                              color: LIGHT.textTertiary,
                              marginTop: 2,
                              marginBottom: SPACING.xs,
                            },
                          ]}
                          numberOfLines={1}
                        >
                          {item.vendor || 'UrbanAV Partner'}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <View
                            style={{
                              paddingHorizontal: SPACING.sm,
                              paddingVertical: 3,
                              borderRadius: RADIUS.full,
                              backgroundColor: LIGHT.accentSoft,
                            }}
                          >
                            <Text
                              style={[
                                TYPE.tiny,
                                {
                                  color: LIGHT.accent,
                                  fontWeight: '700',
                                  letterSpacing: 0.5,
                                },
                              ]}
                            >
                              CONTACT FOR PRICE
                            </Text>
                          </View>
                        </View>
                      </View>
                      <ChevronRight size={16} color={LIGHT.textMuted} />
                    </View>
                  </LightCard>
                ))
              )}
            </View>
          </SlideUpView>
        </ScrollView>
      </SafeAreaView>
    </LightScreenBackground>
  );
}
