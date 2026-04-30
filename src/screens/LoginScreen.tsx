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
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { ScreenBackground, SEMANTIC, SPACING, RADIUS, NEON, NeuCard, NeuInput, NeuButton, NEU, Toast } from '../components/ui';
import { useAuthStore } from '../store';

const LOGO = require('../../assets/logo.jpg');

// ── Glass tokens ────────────────────────────────────────────────────────
const GLASS_BG   = 'rgba(247, 217, 255, 0.06)';
const GLASS_BG2  = 'rgba(247, 217, 255, 0.04)';
const GLASS_BORDER = 'rgba(247, 217, 255, 0.12)';
const GLASS_BORDER_H = 'rgba(123, 37, 244, 0.5)';

// ── Login Screen ────────────────────────────────────────────────────────
function LoginContent({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  const { login, isLoading } = useAuthStore();

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      showToast('Please enter your email and password.', 'error');
      return;
    }
    try {
      await login(email.trim().toLowerCase(), password);
      showToast('Login successful! Welcome back.', 'success');
    } catch {
      showToast('Invalid email or password. Please try again.', 'error');
    }
  };

  return (
    <>
      {/* Heading */}
      <Text style={styles.headingBold}>Welcome</Text>
      <Text style={[styles.headingBold, styles.headingLight, { marginBottom: SPACING['2xl'] }]}>back</Text>

      {/* Neumorphic form card */}
      <NeuCard style={styles.neuCard} padding={SPACING.xl}>
        <NeuInput
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          containerStyle={{ marginBottom: SPACING.md }}
        />
        <NeuInput
          label="Password"
          placeholder="Your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPw}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPw(!showPw)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              {showPw
                ? <EyeOff size={20} color="rgba(247,217,255,0.6)" />
                : <Eye size={20} color="rgba(247,217,255,0.6)" />}
            </TouchableOpacity>
          }
          containerStyle={{ marginBottom: SPACING.lg }}
        />

        {error ? (
          <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>
        ) : null}

        {/* Neumorphic sign in button */}
        <NeuButton
          title={isLoading ? 'SIGNING IN...' : 'SIGN IN'}
          onPress={handleLogin}
          disabled={isLoading}
          fullWidth
        />

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>NEW TO URBANAV?</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Neumorphic outline button */}
        <NeuButton
          title="CREATE ACCOUNT"
          onPress={() => navigation.navigate('Register')}
          variant="ghost"
          fullWidth
        />
      </NeuCard>
      
      {/* Toast notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </>
  );
}

// ── Register Screen ─────────────────────────────────────────────────────
function RegisterContent({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  const { register, isLoading } = useAuthStore();

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const handleRegister = async () => {
    setError('');
    if (!name || !email || !phone || !password) {
      showToast('Please fill in all fields.', 'error');
      return;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    try {
      await register({ name: name.trim(), email: email.trim().toLowerCase(), phone: phone.trim(), password, role: 'buyer', userType: 'buyer' });
      showToast('Account created successfully!', 'success');
    } catch (e: any) {
      showToast(e?.response?.data?.message || 'Registration failed. Please try again.', 'error');
    }
  };

  return (
    <>
      {/* Back */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backRow} activeOpacity={0.7}>
        <ArrowLeft size={20} color="rgba(247, 217, 255, 0.5)" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Glass logo circle */}
      <View style={styles.logoWrap}>
        <View style={styles.glassCircle}>
          <Image source={LOGO} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        </View>
      </View>

      {/* Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>AV EQUIPMENT RENTAL</Text>
      </View>

      {/* Heading */}
      <Text style={styles.headingBold}>Create your</Text>
      <Text style={[styles.headingBold, styles.headingLight, { marginBottom: SPACING['2xl'] }]}>account</Text>

      {/* Neumorphic form card */}
      <NeuCard style={styles.neuCard} padding={SPACING.xl}>
        <NeuInput label="Full Name" placeholder="Your full name" value={name} onChangeText={setName} autoCapitalize="words" containerStyle={{ marginBottom: SPACING.md }} />
        <NeuInput label="Email" placeholder="you@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" containerStyle={{ marginBottom: SPACING.md }} />
        <NeuInput label="Phone" placeholder="+91 9876543210" value={phone} onChangeText={setPhone} keyboardType="phone-pad" containerStyle={{ marginBottom: SPACING.lg }} />
        <NeuInput
          label="Password"
          placeholder="Min 6 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPw}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPw(!showPw)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              {showPw
                ? <EyeOff size={20} color="rgba(247,217,255,0.6)" />
                : <Eye size={20} color="rgba(247,217,255,0.6)" />}
            </TouchableOpacity>
          }
          containerStyle={{ marginBottom: SPACING.lg }}
        />

        {error ? (
          <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>
        ) : null}

        <NeuButton
          title={isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          onPress={handleRegister}
          disabled={isLoading}
          fullWidth
        />

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ALREADY HAVE AN ACCOUNT?</Text>
          <View style={styles.dividerLine} />
        </View>

        <NeuButton
          title="SIGN IN"
          onPress={() => navigation.navigate('Login')}
          variant="ghost"
          fullWidth
        />
      </NeuCard>
      
      {/* Toast notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </>
  );
}

// ── Shared Layout ───────────────────────────────────────────────────────
function AuthLayout({ children }: { children?: React.ReactNode }) {
  return (
    <ScreenBackground>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.rootWrap}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.kbdWrap}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            centerContent
          >
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenBackground>
  );
}

export default function LoginScreen({ navigation }: any) {
  return (
    <AuthLayout>
      <LoginContent navigation={navigation} />
    </AuthLayout>
  );
}

export function RegisterScreen({ navigation }: any) {
  return (
    <AuthLayout>
      <RegisterContent navigation={navigation} />
    </AuthLayout>
  );
}

// ── Shared Styles ───────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING['2xl'],
    paddingVertical: SPACING.xl,
  },

  // Root wrapper
  rootWrap: { flex: 1 },

  // Keyboard avoiding
  kbdWrap: { flex: 1 },

  // Glass circle logo
  logoWrap: { alignItems: 'center', marginBottom: SPACING.md },
  glassCircle: {
    width: 80, height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: GLASS_BORDER,
    backgroundColor: GLASS_BG,
    overflow: 'hidden',
    shadowColor: NEON.purple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },

  // Badge
  badge: {
    alignSelf: 'center',
    backgroundColor: `${NEON.purple}18`,
    borderWidth: 1, borderColor: `${NEON.purple}40`,
    borderRadius: RADIUS.full,
    paddingHorizontal: 14, paddingVertical: 5,
    marginBottom: SPACING.sm,
  },
  badgeText: { fontSize: 9, fontWeight: '700', letterSpacing: 2.5, color: NEON.purple },

  // Heading
  headingBold: {
    fontSize: 34, fontWeight: '800', color: '#FFFFFF',
    letterSpacing: -0.5, lineHeight: 42, textAlign: 'center',
  },
  headingLight: { fontWeight: '300' },

  // Back
  backRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginBottom: SPACING.lg, paddingVertical: 4,
  },
  backText: { fontSize: 13, color: 'rgba(247, 217, 255, 0.5)', fontWeight: '500' },

  // Neumorphic card
  neuCard: {
    padding: SPACING.xl,
    marginTop: SPACING.base,
  },

  // Label (used for neu input)
  label: {
    fontSize: 10, fontWeight: '700', letterSpacing: 2.5,
    color: 'rgba(247, 217, 255, 0.35)', marginBottom: SPACING.xs,
  },
  labelFocused: { color: NEON.purple },

  // Eye icon
  eyeWrap: {
    width: 36, height: 36,
    alignItems: 'center', justifyContent: 'center',
  },

  // Error
  errorBox: {
    backgroundColor: `${SEMANTIC.error}18`, borderRadius: 10,
    borderWidth: 1, borderColor: `${SEMANTIC.error}35`,
    padding: 12, marginBottom: SPACING.base,
  },
  errorText: { fontSize: 12.5, color: SEMANTIC.error, textAlign: 'center', fontWeight: '600' },

  // Divider
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.base, marginBottom: SPACING.base },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(247, 217, 255, 0.1)' },
  dividerText: { fontSize: 11, color: 'rgba(247, 217, 255, 0.25)', fontWeight: '600', letterSpacing: 0.8 },
});