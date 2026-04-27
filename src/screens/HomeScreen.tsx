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
  Monitor,
  Volume2,
  Mic,
  Lightbulb,
  Music,
  Tv,
  Bell,
  Sparkles,
  ChevronRight,
  Film,
  Camera,
  Grid3x3,
} from 'lucide-react-native';
import {
  LightScreenBackground,
  LightCard,
  LightSearchBar,
  FlatTile,
  LIGHT,
  BRAND,
  NEON,
  NEU,
  SEMANTIC,
  SPACING,
  RADIUS,
  TYPE,
  FadeInView,
  SlideUpView,
} from '../components/ui';
import { useAuthStore, useEquipmentStore } from '../store';

const LOGO = require('../../assets/logo.jpg');

const CATEGORY_CONFIG = [
  { key: 'all', label: 'All', Icon: Grid3x3, color: LIGHT.accent },
  { key: 'projectors', label: 'Projectors', Icon: Film, color: BRAND[500] },
  { key: 'led-walls', label: 'LED Walls', Icon: Monitor, color: '#E14D8A' },
  { key: 'sound-systems', label: 'Sound', Icon: Volume2, color: '#3B82F6' },
  { key: 'microphones', label: 'Mics', Icon: Mic, color: SEMANTIC.success },
  { key: 'dj-equipment', label: 'DJ', Icon: Music, color: '#F59E0B' },
  { key: 'lighting', label: 'Lighting', Icon: Lightbulb, color: BRAND[400] },
  { key: 'video-recording', label: 'Video', Icon: Camera, color: '#EC4899' },
  { key: 'led-tvs', label: 'LED TVs', Icon: Tv, color: '#06B6D4' },
];

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const { items, loading, fetchAll } = useEquipmentStore();
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAll(true);
    setRefreshing(false);
  };

  const filtered = useMemo(() => {
    let list = items;
    if (activeCat !== 'all') list = list.filter((e) => e.category === activeCat);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
      );
    } else if (activeCat === 'all') {
      list = list.filter((e) => e.popular).slice(0, 6);
    }
    return list.slice(0, 20);
  }, [items, activeCat, search]);

  return (
    <LightScreenBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={LIGHT.accent}
            />
          }
        >
          {/* Header */}
          <FadeInView>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: SPACING.base,
                paddingTop: SPACING.base,
                paddingBottom: SPACING.base,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                {/* Brand logo */}
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    overflow: 'hidden',
                    marginRight: SPACING.sm,
                    borderWidth: 1,
                    borderColor: LIGHT.border,
                    backgroundColor: LIGHT.card,
                  }}
                >
                  <Image
                    source={LOGO}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[TYPE.caption, { color: LIGHT.textTertiary, letterSpacing: 0.5 }]}>
                    Good day,
                  </Text>
                  <Text
                    style={[
                      TYPE.h2,
                      { color: LIGHT.text, letterSpacing: -0.3 },
                    ]}
                    numberOfLines={1}
                  >
                    {user?.name?.split(' ')[0] || 'Welcome'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={{ position: 'relative' }}>
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: LIGHT.card,
                    borderWidth: 1,
                    borderColor: LIGHT.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Bell size={20} color={LIGHT.text} strokeWidth={1.6} />
                </View>
                <View
                  style={{
                    position: 'absolute',
                    top: -2,
                    right: -2,
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: SEMANTIC.error,
                    borderWidth: 2,
                    borderColor: LIGHT.bg,
                  }}
                />
              </TouchableOpacity>
            </View>
          </FadeInView>

          {/* Search */}
          <FadeInView delay={60}>
            <View style={{ paddingHorizontal: SPACING.base, marginBottom: SPACING.lg }}>
              <LightSearchBar
                value={search}
                onChangeText={setSearch}
                placeholder="Search AV equipment..."
              />
            </View>
          </FadeInView>

          {/* Post Requirement CTA — dark neumorphic card (matches smart-home reference) */}
          {!search && (
            <SlideUpView delay={100}>
              <View
                style={{
                  paddingHorizontal: SPACING.base,
                  marginBottom: SPACING.xl,
                }}
              >
                {/* Outer wrapper: soft light highlight shadow (top-left) */}
                <View
                  style={{
                    borderRadius: RADIUS.xl,
                    shadowColor: '#FFFFFF',
                    shadowOffset: { width: -6, height: -6 },
                    shadowOpacity: 0.85,
                    shadowRadius: 14,
                  }}
                >
                  {/* Inner wrapper: deep shadow (bottom-right) + dark purple surface */}
                  <View
                    style={{
                      borderRadius: RADIUS.xl,
                      backgroundColor: NEU.bg, // #1D0A2E
                      padding: SPACING.lg,
                      flexDirection: 'row',
                      alignItems: 'center',
                      shadowColor: '#2D1558',
                      shadowOffset: { width: 8, height: 8 },
                      shadowOpacity: 0.35,
                      shadowRadius: 16,
                      elevation: 6,
                      borderWidth: 1,
                      borderColor: `${NEON.purple}33`,
                      overflow: 'hidden',
                    }}
                  >
                    {/* Subtle purple glow overlay at top-left for extruded feel */}
                    <View
                      pointerEvents="none"
                      style={{
                        position: 'absolute',
                        top: -40,
                        left: -40,
                        width: 140,
                        height: 140,
                        borderRadius: 70,
                        backgroundColor: `${NEON.purple}22`,
                      }}
                    />

                    <View style={{ flex: 1 }}>
                      <Text
                        style={[
                          TYPE.h4,
                          { color: '#FFFFFF', fontWeight: '700' },
                        ]}
                      >
                        Planning an event?
                      </Text>
                      <Text
                        style={[
                          TYPE.caption,
                          {
                            color: 'rgba(247, 217, 255, 0.72)',
                            marginTop: 4,
                            lineHeight: 16,
                          },
                        ]}
                      >
                        Post your requirement · get matched with top vendors
                      </Text>

                      {/* Neumorphic CTA button inside the card */}
                      <TouchableOpacity
                        onPress={() => navigation.navigate('Requirement')}
                        activeOpacity={0.85}
                        style={{ marginTop: SPACING.md, alignSelf: 'flex-start' }}
                      >
                        <View
                          style={{
                            borderRadius: RADIUS.full,
                            shadowColor: NEU.shadowLight,
                            shadowOffset: { width: -3, height: -3 },
                            shadowOpacity: 0.6,
                            shadowRadius: 6,
                          }}
                        >
                          <View
                            style={{
                              paddingHorizontal: SPACING.base,
                              paddingVertical: SPACING.sm,
                              borderRadius: RADIUS.full,
                              backgroundColor: NEON.purple,
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 6,
                              shadowColor: '#000',
                              shadowOffset: { width: 3, height: 3 },
                              shadowOpacity: 0.55,
                              shadowRadius: 6,
                              elevation: 4,
                              borderWidth: 1,
                              borderColor: `${NEON.glow}55`,
                            }}
                          >
                            <Sparkles size={14} color="#FFFFFF" />
                            <Text
                              style={[
                                TYPE.buttonSm,
                                {
                                  color: '#FFFFFF',
                                  fontWeight: '700',
                                  letterSpacing: 0.3,
                                },
                              ]}
                            >
                              Post Requirement
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>

                    {/* Right icon: neumorphic dark circle with sparkles */}
                    <View
                      style={{
                        marginLeft: SPACING.md,
                        borderRadius: 34,
                        shadowColor: NEU.shadowLight,
                        shadowOffset: { width: -4, height: -4 },
                        shadowOpacity: 0.6,
                        shadowRadius: 8,
                      }}
                    >
                      <View
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: 32,
                          backgroundColor: NEU.bgSubtle,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 1,
                          borderColor: `${NEON.purple}44`,
                          shadowColor: '#000',
                          shadowOffset: { width: 4, height: 4 },
                          shadowOpacity: 0.7,
                          shadowRadius: 8,
                          elevation: 4,
                        }}
                      >
                        <Sparkles
                          size={28}
                          color={NEON.glow}
                          strokeWidth={1.5}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </SlideUpView>
          )}

          {/* Category pill bar — flat, no shadows */}
          <SlideUpView delay={140}>
            <View style={{ marginBottom: SPACING.lg }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: SPACING.base,
                  marginBottom: SPACING.md,
                }}
              >
                <Text
                  style={[TYPE.h3, { color: LIGHT.text, letterSpacing: -0.2 }]}
                >
                  Categories
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Categories')}
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <Text style={[TYPE.caption, { color: LIGHT.accent, fontWeight: '600' }]}>
                    See all
                  </Text>
                  <ChevronRight size={14} color={LIGHT.accent} />
                </TouchableOpacity>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: SPACING.base,
                  gap: SPACING.xs,
                }}
              >
                {CATEGORY_CONFIG.map((c) => {
                  const IconComp = c.Icon;
                  const selected = activeCat === c.key;
                  return (
                    <FlatTile
                      key={c.key}
                      label={c.label}
                      selected={selected}
                      tint={c.color}
                      icon={
                        <IconComp
                          size={24}
                          color={selected ? '#FFFFFF' : c.color}
                          strokeWidth={1.75}
                        />
                      }
                      onPress={() => {
                        if (c.key === 'all') setActiveCat('all');
                        else setActiveCat(selected ? 'all' : c.key);
                      }}
                    />
                  );
                })}
              </ScrollView>
            </View>
          </SlideUpView>

          {/* Equipment list */}
          <SlideUpView delay={180}>
            <View style={{ paddingHorizontal: SPACING.base }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: SPACING.md,
                }}
              >
                <Text
                  style={[TYPE.h3, { color: LIGHT.text, letterSpacing: -0.2 }]}
                >
                  {search
                    ? `Results for "${search}"`
                    : activeCat !== 'all'
                    ? CATEGORY_CONFIG.find((c) => c.key === activeCat)?.label
                    : 'Popular Equipment'}
                </Text>
                {!search && (
                  <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
                    <Text
                      style={[TYPE.caption, { color: LIGHT.accent, fontWeight: '600' }]}
                    >
                      View all
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {loading && items.length === 0 ? (
                <View style={{ padding: SPACING['2xl'], alignItems: 'center' }}>
                  <ActivityIndicator size="large" color={LIGHT.accent} />
                </View>
              ) : filtered.length === 0 ? (
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
                filtered.map((item) => (
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
                          width: 68,
                          height: 68,
                          borderRadius: RADIUS.md,
                          marginRight: SPACING.md,
                          backgroundColor: LIGHT.cardSoft,
                        }}
                        resizeMode="cover"
                      />
                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text
                          style={[
                            TYPE.h4,
                            { color: LIGHT.text, fontSize: 15 },
                          ]}
                          numberOfLines={1}
                        >
                          {item.name}
                        </Text>
                        <Text
                          style={[
                            TYPE.caption,
                            { color: LIGHT.textTertiary, marginTop: 2 },
                          ]}
                          numberOfLines={1}
                        >
                          {item.vendor || 'UrbanAV Partner'}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: SPACING.xs,
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
                      <ChevronRight size={18} color={LIGHT.textMuted} />
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
