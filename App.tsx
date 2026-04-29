import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, ActivityIndicator, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Home, Grid3x3, ShoppingCart, Package, User, Plus } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import HomeScreen from './src/screens/HomeScreen';
import CategoriesScreen from './src/screens/CategoriesScreen';
import CartScreen from './src/screens/CartScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import EquipmentDetailScreen from './src/screens/EquipmentDetailScreen';
import ChatScreen from './src/screens/ChatScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrderDetailScreen from './src/screens/OrderDetailScreen';
import RequirementScreen from './src/screens/RequirementScreen';
import MatchResultsScreen from './src/screens/MatchResultsScreen';
import InquiryScreen from './src/screens/InquiryScreen';
import BookingConfirmScreen from './src/screens/BookingConfirmScreen';
import AddressesScreen from './src/screens/AddressesScreen';
import PaymentMethodsScreen from './src/screens/PaymentMethodsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import TermsScreen from './src/screens/TermsScreen';
import PrivacyScreen from './src/screens/PrivacyScreen';
import { BRAND, NEON, SURFACE, TEXT, GLASS } from './src/theme/colors';
import { LAYOUT } from './src/theme/spacing';
import { TabBounce } from './src/components/ui';
import { useAuthStore } from './src/store';

// BackHandler only on Android
const BackHandler = Platform.OS === 'android' ? require('react-native').BackHandler : null;

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function BuyerTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'rgba(20, 8, 33, 0.92)',
          borderTopColor: GLASS.tier2Border,
          borderTopWidth: 1,
          height: LAYOUT.tabBarHeight,
          paddingBottom: 10,
          paddingTop: 10,
          position: 'absolute',
          shadowColor: NEON.purple,
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.4,
          shadowRadius: 20,
          elevation: 16,
        },
        tabBarActiveTintColor: NEON.glow,
        tabBarInactiveTintColor: TEXT.muted,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', letterSpacing: 0.3 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused, color }: any) => (
            <TabBounce focused={focused}>
              <Home size={22} color={color} strokeWidth={focused ? 2.4 : 1.8} />
            </TabBounce>
          ),
        }}
      />
      <Tab.Screen
        name="Categories"
        component={CategoriesScreen}
        options={{
          tabBarIcon: ({ focused, color }: any) => (
            <TabBounce focused={focused}>
              <Grid3x3 size={22} color={color} strokeWidth={focused ? 2.4 : 1.8} />
            </TabBounce>
          ),
        }}
      />
      <Tab.Screen
        name="Requirement"
        component={RequirementScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }: any) => (
            <View
              style={{
                width: 56,
                height: 56,
                marginTop: -22,
                borderRadius: 28,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: NEON.glow,
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.55,
                shadowRadius: 14,
                elevation: 10,
              }}
            >
              <LinearGradient
                colors={focused ? ['#B06BFF', '#7A3DFF'] : ['#8A45E8', '#5B1FC9']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 3,
                  borderColor: 'rgba(20, 8, 33, 0.95)',
                }}
              >
                <Plus size={26} color="#FFFFFF" strokeWidth={3} />
              </LinearGradient>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{
          tabBarIcon: ({ focused, color }: any) => (
            <TabBounce focused={focused}>
              <Package size={22} color={color} strokeWidth={focused ? 2.4 : 1.8} />
            </TabBounce>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }: any) => (
            <TabBounce focused={focused}>
              <User size={22} color={color} strokeWidth={focused ? 2.4 : 1.8} />
            </TabBounce>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  const { isAuthenticated, isLoading, isGuest, hasOnboarded, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'android' || !BackHandler) return;
    const backAction = () => false;
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: SURFACE.base }}>
        <ActivityIndicator size="large" color={NEON.glow} />
        <Text style={{ color: TEXT.secondary, marginTop: 16, fontSize: 16, fontWeight: '600' }}>Loading UrbanAV...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: SURFACE.base }}>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
            contentStyle: { backgroundColor: SURFACE.base },
          }}
        >
          {!hasOnboarded ? (
            <>
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : !isAuthenticated && !isGuest ? (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Main" component={BuyerTabs} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
              <Stack.Screen name="EquipmentDetail" component={EquipmentDetailScreen} />
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="OrderDetail" component={OrderDetailScreen} />
              <Stack.Screen name="Checkout" component={CheckoutScreen} />
              <Stack.Screen name="CategoryDetail" component={CategoriesScreen} />
              <Stack.Screen name="Cart" component={CartScreen} />
              <Stack.Screen name="MatchResults" component={MatchResultsScreen} />
              <Stack.Screen name="Inquiry" component={InquiryScreen} />
              <Stack.Screen name="BookingConfirm" component={BookingConfirmScreen} options={{ animation: 'slide_from_bottom' }} />
              <Stack.Screen name="Addresses" component={AddressesScreen} />
              <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
              <Stack.Screen name="Notifications" component={NotificationsScreen} />
              <Stack.Screen name="Terms" component={TermsScreen} />
              <Stack.Screen name="Privacy" component={PrivacyScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
