import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';

const ProgressCard = () => (
  <View style={styles.card}>
    <View style={styles.left}>
      <Text style={styles.title}>Tiến trình tuần</Text>
      <Text style={styles.percent}>89%</Text>
      <Text style={styles.sub}>Kế hoạch tuần hoàn thành</Text>
    </View>
    <View style={styles.dotsWrap}>
      {[COLORS.secondary, COLORS.softBlue, COLORS.accent, COLORS.warmYellow].map((c, i) => (
        <View key={i} style={[styles.dot, { backgroundColor: c }]} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.secondary,
    borderRadius: 30,
    padding: 24,
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: { flex: 1 },
  title: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textMain,
    fontWeight: '500',
    marginBottom: 4,
  },
  percent: {
    fontSize: 38,
    fontWeight: '800',
    color: COLORS.textMain,
  },
  sub: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSub,
    marginTop: 2,
  },
  dotsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 62,
    gap: 6,
    justifyContent: 'center',
  },
  dot: {
    width: 26,
    height: 26,
    borderRadius: 13,
  },
});

export default ProgressCard;
