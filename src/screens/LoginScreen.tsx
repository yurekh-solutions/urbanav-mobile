import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff } from 'lucide-react-native';
import {
  ScreenBackground,
  UnderlineInput,
  BlackButton,
  TEXT,
  SEMANTIC,
  SPACING,
  RADIUS,
  TYPE,
  NEON,
} from '../components/ui';
import { useAuthStore } from '../store';

const LOGO = require('../../assets/logo.jpg');

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      await login(email.trim().toLowerCase(), password);
    } catch {
      setError('Invalid email or password. Try demo buttons below.');
    }
  };

  return (
    <ScreenBackground>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              paddingHorizontal: SPACING['2xl'],
              paddingTop: SPACING['3xl'],
              paddingBottom: SPACING['3xl'],
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* ── App logo (brand presence + splash parity) ── */}
            <View style={{ alignItems: 'center', marginBottom: SPACING['3xl'] }}>
              <View
                style={{
                  width: 104,
                  height: 104,
                  borderRadius: 26,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: `${NEON.purple}55`,
                  shadowColor: NEON.purple,
                  shadowOffset: { width: 0, height: 10 },
                  shadowOpacity: 0.35,
                  shadowRadius: 20,
                  elevation: 10,
                  backgroundColor: '#1D0A2E',
                }}
              >
                <Image
                  source={LOGO}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>
            </View>

            {/* ── Welcome copy (matches reference) ─────────────── */}
            <Text
              style={[
                TYPE.bodySm,
                {
                  color: 'rgba(247, 217, 255, 0.65)',
                  letterSpacing: 1,
                  marginBottom: SPACING.xs,
                  fontWeight: '500',
                },
              ]}
            >
              Hi there
            </Text>
            <Text
              style={[
                TYPE.display,
                {
                  color: '#FFFFFF',
                  marginBottom: 2,
                  fontWeight: '300',
                  letterSpacing: -0.5,
                },
              ]}
            >
              Welcome
            </Text>
            <Text
              style={[
                TYPE.display,
                {
                  color: '#FFFFFF',
                  marginBottom: SPACING['3xl'],
                  fontWeight: '300',
                  letterSpacing: -0.5,
                },
              ]}
            >
              to UrbanAV
            </Text>

            {/* ── Plain underline inputs ──────────────────────── */}
            <UnderlineInput
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              dark
            />
            <UnderlineInput
              label="Password"
              placeholder="Your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPw}
              dark
              rightIcon={
                <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                  {showPw ? (
                    <EyeOff size={18} color="rgba(247, 217, 255, 0.55)" />
                  ) : (
                    <Eye size={18} color="rgba(247, 217, 255, 0.55)" />
                  )}
                </TouchableOpacity>
              }
            />

            {/* ── Forgot password ─────────────────────────────── */}
            <TouchableOpacity
              style={{ alignSelf: 'flex-end', marginTop: -SPACING.sm, marginBottom: SPACING.xl }}
            >
              <Text
                style={[
                  TYPE.bodySm,
                  { color: 'rgba(247, 217, 255, 0.55)' },
                ]}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* ── Error ───────────────────────────────────────── */}
            {error ? (
              <View
                style={{
                  backgroundColor: `${SEMANTIC.error}22`,
                  borderRadius: RADIUS.md,
                  padding: SPACING.md,
                  marginBottom: SPACING.base,
                }}
              >
                <Text
                  style={[TYPE.bodySm, { color: SEMANTIC.error, textAlign: 'center' }]}
                >
                  {error}
                </Text>
              </View>
            ) : null}

            {/* ── Solid BLACK pill SIGN IN ────────────────────── */}
            <BlackButton
              title="SIGN IN"
              onPress={handleLogin}
              loading={isLoading}
              fullWidth
              style={{ marginBottom: SPACING.xl }}
            />

            {/* ── Demo fill (text-only, no heavy buttons) ─────── */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                gap: SPACING.lg,
                marginBottom: SPACING['2xl'],
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setEmail('buyer@test.com');
                  setPassword('password123');
                }}
              >
                <Text
                  style={[
                    TYPE.bodySm,
                    { color: 'rgba(247, 217, 255, 0.7)', textDecorationLine: 'underline' },
                  ]}
                >
                  Buyer demo
                </Text>
              </TouchableOpacity>
              <Text style={{ color: 'rgba(247, 217, 255, 0.3)' }}>·</Text>
              <TouchableOpacity
                onPress={() => {
                  setEmail('supplier@test.com');
                  setPassword('password123');
                }}
              >
                <Text
                  style={[
                    TYPE.bodySm,
                    { color: 'rgba(247, 217, 255, 0.7)', textDecorationLine: 'underline' },
                  ]}
                >
                  Supplier demo
                </Text>
              </TouchableOpacity>
            </View>

            {/* ── Register link ───────────────────────────────── */}
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={[TYPE.body, { color: 'rgba(247, 217, 255, 0.75)' }]}>
                  Don't have an account?{' '}
                  <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  );
}
