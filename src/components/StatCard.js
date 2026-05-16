import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';

const StatCard = ({ value, label, cardBg }) => (
  <View style={[styles.card, { backgroundColor: cardBg || COLORS.white }]}>
    <Text style={styles.value}>{value}</Text>
    <Text style={styles.label}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 30,
    paddingVertical: 26,
    paddingHorizontal: 18,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  value: {
    fontSize: 32,
    fontWeight: '800',
    color: '#333',
  },
  label: {
    fontSize: SIZES.fontSmall,
    color: '#333',
    marginTop: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default StatCard;
