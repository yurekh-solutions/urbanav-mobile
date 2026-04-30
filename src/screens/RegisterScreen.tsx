import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  TextInput,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, ArrowLeft, User, Mail, Phone, MapPin, Lock, Check, ArrowRight, ShoppingBag } from 'lucide-react-native';
import { ScreenBackground, SPACING, RADIUS, NeuCard, NeuInput, NeuButton, NEU, Toast } from '../components/ui';
import { useAuthStore } from '../store';

const LOGO = require('../../assets/logo.jpg');

const PURPLE = '#7B25F4';
const PINK = '#E14D8A';

const STEPS = [
  { id: 1, label: 'Profile' },
  { id: 2, label: 'Security' },
];

// Animated Progress Bar
function ProgressBar({ currentStep }: { currentStep: number }) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(animatedWidth, {
      toValue: currentStep === 1 ? 50 : 100,
      useNativeDriver: false,
      tension: 50,
      friction: 12,
    }).start();
  }, [currentStep]);

  const width = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={progStyles.container}>
      <View style={progStyles.track}>
        <Animated.View style={[progStyles.fill, { width }]} />
      </View>
      <View style={progStyles.steps}>
        {STEPS.map((step, index) => {
          const isActive = index + 1 === currentStep;
          const isDone = index + 1 < currentStep;
          return (
            <View key={step.id} style={progStyles.stepWrap}>
              <View style={[
                progStyles.circle,
                isActive && progStyles.circleActive,
                isDone && progStyles.circleDone,
              ]}>
                {isDone ? (
                  <Check size={16} color="#FFF" strokeWidth={3} />
                ) : (
                  <Text style={[
                    progStyles.stepNum,
                    isActive && progStyles.stepNumActive,
                  ]}>{step.id}</Text>
                )}
              </View>
              <Text style={[
                progStyles.label,
                isActive && progStyles.labelActive,
              ]}>{step.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const progStyles = StyleSheet.create({
  container: { marginBottom: SPACING.xl },
  track: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: PURPLE,
    borderRadius: 2,
  },
  steps: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    paddingHorizontal: 4,
  },
  stepWrap: { alignItems: 'center' },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleActive: { backgroundColor: PURPLE, borderColor: PURPLE },
  circleDone: { backgroundColor: '#0E7A3C', borderColor: '#0E7A3C' },
  stepNum: { color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: '700' },
  stepNumActive: { color: '#FFF' },
  label: {
    marginTop: 6,
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    fontWeight: '500',
  },
  labelActive: { color: PURPLE, fontWeight: '600' },
});

// Input
function Input({
  label,
  placeholder,
  value,
  onChangeText,
  icon: Icon,
  keyboardType,
  secureTextEntry,
  showPasswordToggle,
  showPassword,
  onTogglePassword,
  autoCapitalize,
  error,
  prefix,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  icon?: React.ComponentType<any>;
  keyboardType?: any;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  autoCapitalize?: any;
  error?: string;
  prefix?: string;
}) {
  const [focused, setFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focused]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,255,255,0.1)', PURPLE],
  });

  return (
    <View style={inp.container}>
      <Text style={inp.label}>{label}</Text>
      <Animated.View style={[inp.inputWrap, { borderColor }]}>
        {Icon && (
          <View style={inp.iconWrap}>
            <Icon size={18} color={focused ? PURPLE : 'rgba(255,255,255,0.3)'} />
          </View>
        )}
        {prefix && <Text style={inp.prefix}>{prefix}</Text>}
        <TextInput
          style={[inp.input, prefix && inp.inputWithPrefix]}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.25)"
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !showPassword}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCapitalize={autoCapitalize}
        />
        {showPasswordToggle && (
          <TouchableOpacity onPress={onTogglePassword} style={inp.eyeBtn}>
            {showPassword ? (
              <EyeOff size={18} color="rgba(255,255,255,0.4)" />
            ) : (
              <Eye size={18} color="rgba(255,255,255,0.4)" />
            )}
          </TouchableOpacity>
        )}
      </Animated.View>
      {error && <Text style={inp.error}>{error}</Text>}
    </View>
  );
}

const inp = StyleSheet.create({
  container: { marginBottom: SPACING.base },
  label: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1.5,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  iconWrap: { paddingLeft: 14 },
  prefix: { paddingLeft: 6, color: 'rgba(255,255,255,0.5)', fontSize: 16 },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    color: '#FFF',
    fontSize: 15,
  },
  inputWithPrefix: { paddingLeft: 4 },
  eyeBtn: { padding: 14 },
  error: { marginTop: 6, fontSize: 12, color: '#FF6B6B' },
});

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [globalError, setGlobalError] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');
  const { register, isLoading } = useAuthStore();

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    password: '',
    confirmPassword: '',
  });

  const updateForm = (key: string, value: string) => {
    setForm((prev: typeof form) => ({ ...prev, [key]: value }));
    setGlobalError('');
  };

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
  const validPhone = /^\+?[0-9]{10,13}$/.test(form.phone.replace(/[\s-]/g, ''));

  const canProceed = () => {
    if (currentStep === 1) {
      return (
        form.name.trim().length >= 2 &&
        validEmail &&
        validPhone &&
        form.address.trim().length >= 5 &&
        form.city.trim().length >= 2 &&
        form.state.trim().length >= 2
      );
    }
    return form.password.length >= 6 && form.password === form.confirmPassword;
  };

  const handleNext = () => currentStep === 1 && setCurrentStep(2);
  const handleBack = () => currentStep > 1 && setCurrentStep(1);

  const handleSubmit = async () => {
    setGlobalError('');
    if (form.password.length < 6) {
      showToast('Password must be at least 6 characters.', 'error');
      return;
    }
    if (form.password !== form.confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim(),
        password: form.password,
        role: 'buyer',
        userType: 'buyer',
        address: form.address.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
      });
      showToast('Account created successfully!', 'success');
    } catch (e: any) {
      showToast(e?.response?.data?.message || 'Registration failed. Please try again.', 'error');
    }
  };

  const renderStep1 = () => (
    <>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <NeuInput
        label="Full Name"
        placeholder="Enter your name"
        value={form.name}
        onChangeText={(v) => updateForm('name', v)}
        leftIcon={<User size={18} color="rgba(255,255,255,0.5)" />}
        autoCapitalize="words"
        containerStyle={{ marginBottom: SPACING.md }}
      />
      <NeuInput
        label="Email"
        placeholder="you@example.com"
        value={form.email}
        onChangeText={(v) => updateForm('email', v)}
        leftIcon={<Mail size={18} color="rgba(255,255,255,0.5)" />}
        keyboardType="email-address"
        autoCapitalize="none"
        errorText={form.email.length > 0 && !validEmail ? 'Invalid email' : undefined}
        containerStyle={{ marginBottom: SPACING.md }}
      />
      <NeuInput
        label="Phone"
        placeholder="9876543210"
        value={form.phone}
        onChangeText={(v) => updateForm('phone', v)}
        leftIcon={<Phone size={18} color="rgba(255,255,255,0.5)" />}
        keyboardType="phone-pad"
        errorText={form.phone.length >= 10 && !validPhone ? 'Invalid phone' : undefined}
        containerStyle={{ marginBottom: SPACING.md }}
      />
      <View style={styles.row}>
        <View style={styles.half}>
          <NeuInput
            label="City"
            placeholder="Mumbai"
            value={form.city}
            onChangeText={(v) => updateForm('city', v)}
            leftIcon={<MapPin size={18} color="rgba(255,255,255,0.5)" />}
            autoCapitalize="words"
          />
        </View>
        <View style={styles.half}>
          <NeuInput
            label="State"
            placeholder="Mahar..."
            value={form.state}
            onChangeText={(v) => updateForm('state', v)}
            leftIcon={<MapPin size={18} color="rgba(255,255,255,0.5)" />}
            autoCapitalize="words"
          />
        </View>
      </View>
      <NeuInput
        label="Address"
        placeholder="Street address, area"
        value={form.address}
        onChangeText={(v) => updateForm('address', v)}
        leftIcon={<MapPin size={18} color="rgba(255,255,255,0.5)" />}
        autoCapitalize="words"
        containerStyle={{ marginTop: SPACING.md }}
      />
    </>
  );

  const renderStep2 = () => (
    <>
      <Text style={styles.sectionTitle}>Secure Your Account</Text>
      <NeuInput
        label="Password"
        placeholder="Min 6 characters"
        value={form.password}
        onChangeText={(v) => updateForm('password', v)}
        leftIcon={<Lock size={18} color="rgba(255,255,255,0.5)" />}
        secureTextEntry={!showPassword}
        rightIcon={
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            {showPassword ? (
              <EyeOff size={20} color="rgba(255,255,255,0.5)" />
            ) : (
              <Eye size={20} color="rgba(255,255,255,0.5)" />
            )}
          </TouchableOpacity>
        }
        containerStyle={{ marginBottom: SPACING.md }}
      />
      <NeuInput
        label="Confirm Password"
        placeholder="Re-enter password"
        value={form.confirmPassword}
        onChangeText={(v) => updateForm('confirmPassword', v)}
        leftIcon={<Lock size={18} color="rgba(255,255,255,0.5)" />}
        secureTextEntry={!showConfirm}
        rightIcon={
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            {showConfirm ? (
              <EyeOff size={20} color="rgba(255,255,255,0.5)" />
            ) : (
              <Eye size={20} color="rgba(255,255,255,0.5)" />
            )}
          </TouchableOpacity>
        }
        errorText={form.confirmPassword.length > 0 && form.password !== form.confirmPassword ? 'Passwords do not match' : undefined}
        containerStyle={{ marginBottom: SPACING.base }}
      />

      <View style={styles.strengthBar}>
        <View style={[
          styles.strengthFill,
          {
            width: `${Math.min((form.password.length / 8) * 100, 100)}%`,
            backgroundColor: form.password.length < 4 ? '#FF6B6B' : form.password.length < 6 ? '#FFB84D' : '#0E7A3C',
          },
        ]} />
      </View>
      <Text style={styles.strengthText}>
        {form.password.length < 4 ? 'Weak' : form.password.length < 6 ? 'Fair' : 'Strong'} password
      </Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Name:</Text>
          <Text style={styles.summaryValue}>{form.name}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Email:</Text>
          <Text style={styles.summaryValue}>{form.email}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Phone:</Text>
          <Text style={styles.summaryValue}>{form.phone}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Address:</Text>
          <Text style={styles.summaryValue}>{form.address}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Location:</Text>
          <Text style={styles.summaryValue}>{form.city}, {form.state}</Text>
        </View>
      </View>
    </>
  );

  return (
    <ScreenBackground>
      <StatusBar barStyle="light-content" backgroundColor="#130824" />
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => currentStep > 1 ? handleBack() : navigation.goBack()}
                style={styles.backBtn}
              >
                <ArrowLeft size={20} color="rgba(255,255,255,0.6)" />
              </TouchableOpacity>
            </View>

            <View style={styles.logoWrap}>
              <View style={styles.logoCircle}>
                <Image source={LOGO} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              </View>
            </View>

            <View style={styles.badge}>
              <ShoppingBag size={14} color={PINK} />
              <Text style={styles.badgeText}>BUYER</Text>
            </View>

            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Rent premium AV equipment</Text>

            <ProgressBar currentStep={currentStep} />

            <View style={styles.formCard}>
              {currentStep === 1 ? renderStep1() : renderStep2()}

              {globalError ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{globalError}</Text>
                </View>
              ) : null}

              {currentStep === 2 ? (
                <View style={{ marginTop: SPACING.lg }}>
                  <NeuButton
                    title={isLoading ? 'Creating...' : 'Create Account'}
                    onPress={handleSubmit}
                    disabled={!canProceed() || isLoading}
                    rightIcon={<ArrowRight size={18} color="#FFF" />}
                  />
                </View>
              ) : (
                <NeuButton
                  title="Continue"
                  onPress={handleNext}
                  disabled={!canProceed()}
                  rightIcon={<ArrowRight size={18} color="#FFF" />}
                />
              )}
            </View>

            <View style={styles.signInRow}>
              <Text style={styles.signInText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.signInLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      
      {/* Toast notification */}
      <Toast
        message={toastMessage}
        type={toastType}
        visible={toastVisible}
        onHide={() => setToastVisible(false)}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.xl,
    paddingBottom: SPACING['2xl'],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: { alignItems: 'center', marginBottom: SPACING.md },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(123, 37, 244, 0.3)',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: `${PINK}15`,
    borderWidth: 1,
    borderColor: `${PINK}35`,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: SPACING.base,
  },
  badgeText: {
    color: PINK,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  formCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: PURPLE,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: SPACING.base,
  },
  row: { flexDirection: 'row', gap: SPACING.base },
  half: { flex: 1 },
  strengthBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginTop: SPACING.sm,
    overflow: 'hidden',
  },
  strengthFill: { height: '100%', borderRadius: 2 },
  strengthText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 6,
    marginBottom: SPACING.base,
  },
  summaryCard: {
    backgroundColor: 'rgba(14, 122, 60, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(14, 122, 60, 0.3)',
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    marginTop: SPACING.base,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0E7A3C',
    marginBottom: SPACING.sm,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: { fontSize: 13, color: 'rgba(255,255,255,0.5)' },
  summaryValue: { fontSize: 13, color: '#FFF', fontWeight: '500' },
  errorBox: {
    backgroundColor: 'rgba(255, 107, 107, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 107, 107, 0.3)',
    borderRadius: RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.base,
  },
  errorText: { color: '#FF6B6B', fontSize: 13, textAlign: 'center' },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PURPLE,
    paddingVertical: 16,
    borderRadius: RADIUS.lg,
    marginTop: SPACING.base,
  },
  btnDisabled: { backgroundColor: 'rgba(123, 37, 244, 0.3)' },
  btnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  signInRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    marginTop: SPACING.xl,
  },
  signInText: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
  signInLink: { color: PURPLE, fontSize: 14, fontWeight: '600' },
});
