import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';

const FrequentMood = ({ emoji, label, cardBg }) => (
  <View style={[styles.card, cardBg && { backgroundColor: cardBg }]}>
    <View style={styles.emojiCircle}>
      <Text style={styles.emoji}>{emoji}</Text>
    </View>
    <View style={styles.info}>
      <Text style={styles.label}>Cảm xúc thường gặp nhất</Text>
      <Text style={styles.value}>{label}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.accent,
    borderRadius: 30,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  emojiCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 34,
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textSub,
  },
  value: {
    fontSize: SIZES.fontLarge,
    fontWeight: '700',
    color: '#333',
    marginTop: 4,
  },
});

export default FrequentMood;
