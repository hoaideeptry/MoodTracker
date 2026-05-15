import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';

const BAR_COLORS = [
  COLORS.secondary,
  COLORS.accent,
  COLORS.secondary,
  COLORS.primary,
  COLORS.accent,
  COLORS.secondary,
  COLORS.primary,
];

const MonthlyChart = ({ data, cardBg }) => {
  const barHeights = data || [0.6, 0.8, 0.45, 0.9, 0.7, 0.55, 0.85];

  return (
    <View style={[styles.card, cardBg && { backgroundColor: cardBg }]}>
      <Text style={styles.title}>Tổng quan tháng</Text>
      <View style={styles.barsRow}>
        {barHeights.map((h, i) => (
          <View key={i} style={styles.barCol}>
            <View
              style={[
                styles.bar,
                {
                  height: h * 70,
                  backgroundColor: BAR_COLORS[i % BAR_COLORS.length],
                },
              ]}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.warmYellow,
    borderRadius: 30,
    padding: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  title: {
    fontSize: SIZES.fontBody,
    fontWeight: '700',
    color: '#333',
    marginBottom: 18,
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 80,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: 20,
    borderRadius: 10,
  },
});

export default MonthlyChart;
