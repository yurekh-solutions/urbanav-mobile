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
import { UserCircle, Truck, Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
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

type Role = 'buyer' | 'supplier';

const ROLES: { key: Role; label: string; desc: string }[] = [
  { key: 'buyer', label: 'Buyer', desc: 'Rent AV equipment' },
  { key: 'supplier', label: 'Supplier', desc: 'List your inventory' },
];

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState<Role>('buyer');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuthStore();

  const handleRegister = async () => {
    setError('');
    if (!name || !email || !phone || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        role,
      });
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Registration failed.');
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
              paddingTop: SPACING.xl,
              paddingBottom: SPACING['3xl'],
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Back */}
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                alignSelf: 'flex-start',
                flexDirection: 'row',
                alignItems: 'center',
                gap: SPACING.xs,
                marginBottom: SPACING.xl,
                paddingVertical: SPACING.xs,
              }}
            >
              <ArrowLeft size={20} color="rgba(247, 217, 255, 0.65)" />
              <Text style={[TYPE.bodySm, { color: 'rgba(247, 217, 255, 0.65)' }]}>Back</Text>
            </TouchableOpacity>

            {/* App logo */}
            <View style={{ alignItems: 'center', marginBottom: SPACING.xl }}>
              <View
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: 22,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: `${NEON.purple}55`,
                  shadowColor: NEON.purple,
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.35,
                  shadowRadius: 16,
                  elevation: 8,
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
              Join UrbanAV
            </Text>
            <Text
              style={[
                TYPE.display,
                { color: '#FFFFFF', fontWeight: '300', marginBottom: 2 },
              ]}
            >
              Create
            </Text>
            <Text
              style={[
                TYPE.display,
                { color: '#FFFFFF', fontWeight: '300', marginBottom: SPACING.xl },
              ]}
            >
              your account
            </Text>

            {/* Role selector — pill chips */}
            <Text
              style={[
                TYPE.tiny,
                {
                  color: 'rgba(247, 217, 255, 0.55)',
                  letterSpacing: 1.5,
                  textTransform: 'uppercase',
                  marginBottom: SPACING.sm,
                  fontWeight: '600',
                },
              ]}
            >
              I am a
            </Text>
            <View style={{ flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl }}>
              {ROLES.map((r) => {
                const active = role === r.key;
                return (
                  <TouchableOpacity
                    key={r.key}
                    onPress={() => setRole(r.key)}
                    style={{ flex: 1 }}
                    activeOpacity={0.85}
                  >
                    <View
                      style={{
                        borderRadius: RADIUS.lg,
                        backgroundColor: active
                          ? 'rgba(247, 217, 255, 0.12)'
                          : 'rgba(247, 217, 255, 0.04)',
                        borderWidth: 1,
                        borderColor: active
                          ? 'rgba(247, 217, 255, 0.45)'
                          : 'rgba(247, 217, 255, 0.15)',
                        padding: SPACING.base,
                        alignItems: 'center',
                      }}
                    >
                      {r.key === 'buyer' ? (
                        <UserCircle size={22} color="#FFF" strokeWidth={1.5} />
                      ) : (
                        <Truck size={22} color="#FFF" strokeWidth={1.5} />
                      )}
                      <Text
                        style={[
                          TYPE.bodySm,
                          {
                            color: '#FFF',
                            fontWeight: active ? '700' : '500',
                            marginTop: SPACING.xs,
                          },
                        ]}
                      >
                        {r.label}
                      </Text>
                      <Text
                        style={[
                          TYPE.tiny,
                          { color: 'rgba(247, 217, 255, 0.55)', marginTop: 2 },
                        ]}
                      >
                        {r.desc}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Inputs */}
            <UnderlineInput
              label="Full Name"
              placeholder="Your full name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              dark
            />
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
              label="Phone"
              placeholder="+91 9876543210"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              dark
            />
            <UnderlineInput
              label="Password"
              placeholder="Min 6 characters"
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

            {error ? (
              <View
                style={{
                  backgroundColor: `${SEMANTIC.error}22`,
                  borderRadius: RADIUS.md,
                  padding: SPACING.md,
                  marginBottom: SPACING.base,
                }}
              >
                <Text style={[TYPE.bodySm, { color: SEMANTIC.error, textAlign: 'center' }]}>
                  {error}
                </Text>
              </View>
            ) : null}

            <BlackButton
              title="CREATE ACCOUNT"
              onPress={handleRegister}
              loading={isLoading}
              fullWidth
              style={{ marginTop: SPACING.md, marginBottom: SPACING['2xl'] }}
            />

            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={[TYPE.body, { color: 'rgba(247, 217, 255, 0.75)' }]}>
                  Already have an account?{' '}
                  <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  );
}
