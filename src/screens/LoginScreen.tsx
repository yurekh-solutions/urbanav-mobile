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
import { Eye, EyeOff, ArrowLeft, Mail, Lock } from 'lucide-react-native';
import { ScreenBackground, SEMANTIC, SPACING, RADIUS, NEON, NEU, NeuCard, NeuInput, NeuButton, Toast } from '../components/ui';
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
  const googleLogin = useAuthStore((s) => s.googleLogin);

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
      // Force navigation to Main screen after successful login
      setTimeout(() => {
        navigation.replace('Main');
      }, 500);
    } catch {
      showToast('Invalid email or password. Please try again.', 'error');
    }
  };

  return (
    <>
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
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to your account</Text>

      {/* Neumorphic form card */}
      <View style={styles.neuCard}>
        <NeuInput
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<Mail size={18} color="rgba(255,255,255,0.5)" />}
          containerStyle={{ marginBottom: SPACING.lg }}
        />
        <NeuInput
          label="Password"
          placeholder="Your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPw}
          leftIcon={<Lock size={18} color="rgba(255,255,255,0.5)" />}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPw(!showPw)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              {showPw
                ? <EyeOff size={20} color="rgba(247,217,255,0.6)" />
                : <Eye size={20} color="rgba(247,217,255,0.6)" />}
            </TouchableOpacity>
          }
          containerStyle={{ marginBottom: SPACING.xl }}
        />

        {error ? (
          <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View>
        ) : null}

        {/* Neumorphic sign in button */}
        <View style={styles.signInWrap}>
          <NeuButton
            title={isLoading ? 'SIGNING IN...' : 'SIGN IN'}
            onPress={handleLogin}
            disabled={isLoading}
            fullWidth
          />
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>NEW TO URBANAV?</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Neumorphic outline button */}
        <View style={styles.createAccountWrap}>
          <NeuButton
            title="CREATE ACCOUNT"
            onPress={() => navigation.navigate('Register')}
            variant="ghost"
            fullWidth
          />
        </View>
      </View>
      
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
      <TouchableOpacity onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.replace('Home')} style={styles.backRow} activeOpacity={0.7}>
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
      <Text style={styles.title}>Create your</Text>
      <Text style={[styles.title, { fontWeight: '300' as const, marginBottom: SPACING['2xl'] }]}>account</Text>

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
  logoWrap: { alignItems: 'center', marginBottom: SPACING.lg, marginTop: SPACING.sm },
  glassCircle: {
    width: 88, height: 88,
    borderRadius: 44,
    borderWidth: 1.5,
    borderColor: GLASS_BORDER,
    backgroundColor: GLASS_BG,
    overflow: 'hidden',
    shadowColor: NEON.purple,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },

  // Badge
  badge: {
    alignSelf: 'center',
    backgroundColor: `${NEON.purple}15`,
    borderWidth: 1, borderColor: `${NEON.purple}35`,
    borderRadius: RADIUS.full,
    paddingHorizontal: 16, paddingVertical: 6,
    marginBottom: SPACING.lg,
  },
  badgeText: { fontSize: 10, fontWeight: '700', letterSpacing: 3, color: NEON.purple },

  // Heading
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginBottom: SPACING.xl,
    fontWeight: '500',
  },

  // Back
  backRow: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    marginBottom: SPACING.lg, paddingVertical: 4,
  },
  backText: { fontSize: 13, color: 'rgba(247, 217, 255, 0.5)', fontWeight: '500' },

  // Neumorphic card
  neuCard: {
    width: '100%',
    maxWidth: 480,
    borderRadius: RADIUS['2xl'],
    padding: SPACING['2xl'],
    marginTop: SPACING.lg,
    // Neumorphic outer shadow (light)
    backgroundColor: NEU.bg,
    shadowColor: NEU.shadowLight,
    shadowOffset: { width: -8, height: -8 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
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

  // Sign In button wrapper
  signInWrap: {
    marginBottom: SPACING.md,
  },

  // Create Account button wrapper
  createAccountWrap: {
    marginTop: SPACING.sm,
    marginBottom: 0,
  },

  // Divider
  dividerRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.base,
    marginBottom: SPACING.base,
    marginTop: SPACING.xs,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(247, 217, 255, 0.1)' },
  dividerText: { fontSize: 11, color: 'rgba(247, 217, 255, 0.25)', fontWeight: '600', letterSpacing: 0.8 },

  // Google Sign-In
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    height: 56,
    paddingHorizontal: 16,
    borderRadius: RADIUS.xl,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  googleText: {
    color: 'rgba(0,0,0,0.85)',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});