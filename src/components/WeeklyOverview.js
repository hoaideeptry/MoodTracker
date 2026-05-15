import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES, MOOD_EMOJI_MAP, MOOD_COLOR_MAP } from '../theme/theme';

const WeeklyOverview = ({ weekData }) => (
  <View>
    <View style={styles.header}>
      <Text style={styles.title}>Tuần này</Text>
      <Text style={styles.dots}>•••</Text>
    </View>
    <View style={styles.card}>
      {weekData.map((item, index) => (
        <View key={index} style={styles.dayCol}>
          <View
            style={[
              styles.emojiCircle,
              { backgroundColor: MOOD_COLOR_MAP[item.moodId] || COLORS.secondary },
            ]}
          >
            <Text style={styles.emoji}>
              {MOOD_EMOJI_MAP[item.moodId] || '😐'}
            </Text>
          </View>
          <Text style={styles.dayLabel}>{item.day}</Text>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: SIZES.fontBody,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  dots: {
    fontSize: 16,
    color: COLORS.textSub,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.secondary,
    borderRadius: 30,
    paddingVertical: 20,
    paddingHorizontal: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  dayCol: {
    alignItems: 'center',
    gap: 8,
  },
  emojiCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 18,
  },
  dayLabel: {
    fontSize: SIZES.fontSmall,
    color: COLORS.textMain,
    fontWeight: '500',
  },
});

export default WeeklyOverview;
