import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, View } from 'react-native';

/**
 * AestheticToast — hiện thông báo nhỏ pink pastel, tự biến mất sau `duration` ms.
 *
 * Props:
 *   visible   {boolean}  — khi true, toast xuất hiện
 *   message   {string}   — nội dung hiển thị
 *   icon      {string}   — emoji icon (mặc định 🎉)
 *   type      {string}   — 'success' | 'error'  (mặc định 'success')
 *   duration  {number}   — thời gian hiển thị (ms, mặc định 2000)
 *   onHide    {function} — callback sau khi toast ẩn xong
 */
const AestheticToast = ({
  visible,
  message = 'Đã lưu thành công!',
  icon,
  type = 'success',
  duration = 2000,
  onHide,
}) => {
  const opacity  = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    if (!visible) return;

    // Fade + slide in
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 10 }),
      Animated.timing(opacity, { toValue: 1, duration: 280, useNativeDriver: true }),
    ]).start();

    // Fade + slide out sau `duration`
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 350, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 20, duration: 350, useNativeDriver: true }),
      ]).start(() => {
        translateY.setValue(30);
        onHide?.();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, duration, opacity, translateY, onHide]);

  if (!visible) return null;

  const isError = type === 'error';
  const defaultIcon = isError ? '😔' : '🎉';
  const bgColor    = isError ? '#F9E4E4' : '#FFE0EC';
  const borderColor = isError ? '#F5B8B8' : '#F5B8D0';
  const textColor  = isError ? '#C0392B' : '#B5507A';

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity, transform: [{ translateY }], backgroundColor: bgColor, borderColor },
      ]}
    >
      <Text style={styles.icon}>{icon || defaultIcon}</Text>
      <Text style={[styles.message, { color: textColor }]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 120,           // Nằm trên tab bar
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 50,
    borderWidth: 1.2,
    gap: 10,
    // Shadow
    shadowColor: '#E75480',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 9999,
    minWidth: 180,
    maxWidth: 320,
  },
  icon: { fontSize: 22 },
  message: {
    fontSize: 15,
    fontWeight: '700',
    flexShrink: 1,
    letterSpacing: 0.2,
  },
});

export default AestheticToast;
