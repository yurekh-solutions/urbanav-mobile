import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react-native';
import {
  LightScreenBackground,
  LightCard,
  BlackButton,
  FadeInView,
  SlideUpView,
  LIGHT,
  SPACING,
  RADIUS,
  TYPE,
  SEMANTIC,
} from '../components/ui';
import { useCartStore } from '../store';

export default function CartScreen({ navigation }: any) {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear All', style: 'destructive', onPress: clearCart },
    ]);
  };

  const handleRemoveItem = (id: string, name: string) => {
    Alert.alert('Remove Item', `Remove "${name}" from cart?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeFromCart(id) },
    ]);
  };

  if (items.length === 0) {
    return (
      <LightScreenBackground>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ paddingHorizontal: SPACING.base, paddingTop: SPACING.base }}>
            <Text style={[TYPE.h2, { color: LIGHT.text, letterSpacing: -0.3 }]}>
              Shopping Cart
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: SPACING.xl,
            }}
          >
            <View
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: LIGHT.accentSoft,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: SPACING.lg,
              }}
            >
              <ShoppingCart size={40} color={LIGHT.accent} strokeWidth={1.5} />
            </View>
            <Text style={[TYPE.h3, { color: LIGHT.text, marginBottom: SPACING.xs }]}>
              Your cart is empty
            </Text>
            <Text
              style={[
                TYPE.body,
                {
                  color: LIGHT.textTertiary,
                  textAlign: 'center',
                  marginBottom: SPACING.lg,
                },
              ]}
            >
              Browse equipment and add items to get started
            </Text>
            <BlackButton
              title="BROWSE EQUIPMENT"
              onPress={() => navigation.navigate('Home')}
              fullWidth={false}
              size="md"
            />
          </View>
        </SafeAreaView>
      </LightScreenBackground>
    );
  }

  return (
    <LightScreenBackground>
      <SafeAreaView style={{ flex: 1 }}>
        <FadeInView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: SPACING.base,
              paddingTop: SPACING.base,
              paddingBottom: SPACING.sm,
            }}
          >
            <View>
              <Text style={[TYPE.h2, { color: LIGHT.text, letterSpacing: -0.3 }]}>
                Shopping Cart
              </Text>
              <Text
                style={[TYPE.caption, { color: LIGHT.textTertiary, marginTop: 2 }]}
              >
                {items.length} item{items.length !== 1 ? 's' : ''}
              </Text>
            </View>
            <TouchableOpacity onPress={handleClearCart}>
              <Text
                style={[
                  TYPE.caption,
                  { color: SEMANTIC.error, fontWeight: '600' },
                ]}
              >
                Clear All
              </Text>
            </TouchableOpacity>
          </View>
        </FadeInView>

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: SPACING.base,
            paddingBottom: SPACING.base,
          }}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item, index) => (
            <SlideUpView key={item.id} delay={index * 60}>
              <LightCard
                style={{ marginBottom: SPACING.sm }}
                padding={SPACING.sm}
              >
                <View style={{ flexDirection: 'row' }}>
                  <Image
                    source={item.image}
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: RADIUS.md,
                      marginRight: SPACING.md,
                      backgroundColor: LIGHT.cardSoft,
                    }}
                    resizeMode="cover"
                  />
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Text
                        style={[
                          TYPE.body,
                          {
                            flex: 1,
                            color: LIGHT.text,
                            fontWeight: '700',
                          },
                        ]}
                        numberOfLines={2}
                      >
                        {item.name}
                      </Text>
                      <TouchableOpacity
                        onPress={() => handleRemoveItem(item.id, item.name)}
                        style={{ marginLeft: SPACING.sm }}
                      >
                        <Trash2 size={18} color={SEMANTIC.error} />
                      </TouchableOpacity>
                    </View>

                    <Text
                      style={[
                        TYPE.caption,
                        {
                          color: LIGHT.accent,
                          marginTop: 2,
                          marginBottom: SPACING.sm,
                          fontWeight: '600',
                        },
                      ]}
                    >
                      Contact for price · {item.rentalDays} day
                      {item.rentalDays > 1 ? 's' : ''}
                    </Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TouchableOpacity
                        onPress={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: LIGHT.cardSoft,
                          borderWidth: 1,
                          borderColor: LIGHT.border,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Minus size={14} color={LIGHT.text} />
                      </TouchableOpacity>

                      <Text
                        style={[
                          TYPE.label,
                          {
                            marginHorizontal: SPACING.md,
                            color: LIGHT.text,
                            fontWeight: '700',
                          },
                        ]}
                      >
                        {item.quantity}
                      </Text>

                      <TouchableOpacity
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: LIGHT.accent,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Plus size={14} color="#FFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </LightCard>
            </SlideUpView>
          ))}
        </ScrollView>

        <SlideUpView delay={200}>
          <View
            style={{
              paddingHorizontal: SPACING.base,
              paddingBottom: SPACING.base,
            }}
          >
            <LightCard>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: SPACING.sm,
                }}
              >
                <Text style={[TYPE.body, { color: LIGHT.textSecondary }]}>
                  Subtotal
                </Text>
                <Text
                  style={[
                    TYPE.body,
                    { color: LIGHT.text, fontWeight: '600' },
                  ]}
                >
                  Contact for pricing
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: SPACING.sm,
                }}
              >
                <Text style={[TYPE.body, { color: LIGHT.textSecondary }]}>
                  Service fee (5%)
                </Text>
                <Text style={[TYPE.body, { color: LIGHT.text }]}>On quote</Text>
              </View>

              <View
                style={{
                  height: 1,
                  backgroundColor: LIGHT.divider,
                  marginVertical: SPACING.sm,
                }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: SPACING.sm,
                  marginBottom: SPACING.base,
                }}
              >
                <Text style={[TYPE.h4, { color: LIGHT.text }]}>Total</Text>
                <Text
                  style={[
                    TYPE.h4,
                    { color: LIGHT.accent, fontWeight: '700' },
                  ]}
                >
                  On confirmed quote
                </Text>
              </View>

              <BlackButton
                title="PROCEED TO CHECKOUT"
                onPress={() => navigation.navigate('Checkout')}
                rightIcon={<ArrowRight size={18} color="#FFF" />}
              />
            </LightCard>
          </View>
        </SlideUpView>
      </SafeAreaView>
    </LightScreenBackground>
  );
}
