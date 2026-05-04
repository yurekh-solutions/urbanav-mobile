import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Platform, StatusBar } from 'react-native';
import { Check, AlertCircle, Info } from 'lucide-react-native';
import { SPACING, RADIUS } from '../../theme/spacing';
import { TYPE } from '../../theme/typography';
import { SEMANTIC, TEXT } from '../../theme/colors';

type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onHide: () => void;
  duration?: number;
}

const { width } = Dimensions.get('window');

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  visible,
  onHide,
  duration = 3000,
}) => {
  const [slideAnim] = useState(new Animated.Value(-100));
  const [opacityAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    if (visible) {
      // Show toast
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideToast();
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'rgba(34, 224, 130, 0.15)',
          border: 'rgba(34, 224, 130, 0.4)',
          icon: <Check size={20} color={SEMANTIC.success} />,
          textColor: SEMANTIC.success,
        };
      case 'error':
        return {
          bg: 'rgba(255, 91, 110, 0.15)',
          border: 'rgba(255, 91, 110, 0.4)',
          icon: <AlertCircle size={20} color={SEMANTIC.error} />,
          textColor: SEMANTIC.error,
        };
      case 'info':
      default:
        return {
          bg: 'rgba(94, 184, 255, 0.15)',
          border: 'rgba(94, 184, 255, 0.4)',
          icon: <Info size={20} color={SEMANTIC.info} />,
          textColor: SEMANTIC.info,
        };
    }
  };

  if (!visible) return null;

  const config = getTypeConfig();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View
        style={[
          styles.toast,
          {
            backgroundColor: config.bg,
            borderColor: config.border,
          },
        ]}
      >
        <View style={styles.iconContainer}>{config.icon}</View>
        <Text style={[TYPE.body, styles.message, { color: config.textColor }]}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 44) + 8 : 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    paddingHorizontal: SPACING.base,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1.5,
    maxWidth: width - SPACING['2xl'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginRight: SPACING.sm,
  },
  message: {
    flex: 1,
    fontWeight: '600',
  },
});
