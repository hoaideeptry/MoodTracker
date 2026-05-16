import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SIZES, MOODS } from '../theme/theme';

const MoodSelector = ({ selectedMood, onSelectMood }) => (
  <View>
    <View style={styles.header}>
      <Text style={styles.title}>Tâm trạng hôm nay</Text>
      <Text style={styles.dots}>•••</Text>
    </View>
    <View style={styles.row}>
      {MOODS.map((m) => (
        <View key={m.id} style={styles.itemWrapper}>
          <TouchableOpacity
            style={[
              styles.circle,
              { backgroundColor: selectedMood === m.id ? m.bg : COLORS.white },
              selectedMood === m.id && styles.selected,
            ]}
            onPress={() => onSelectMood(m.id)}
            activeOpacity={0.7}
            accessibilityLabel={`Chọn cảm xúc ${m.label}`}
          >
            <Text style={styles.emoji}>{m.emoji}</Text>
          </TouchableOpacity>
          <Text style={[
            styles.label,
            selectedMood === m.id && styles.labelActive,
          ]}>{m.label}</Text>
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
    marginBottom: 16,
  },
  title: {
    fontSize: SIZES.fontBody,
    color: COLORS.textMain,
    fontWeight: '700',
  },
  dots: {
    fontSize: 16,
    color: COLORS.textSub,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  itemWrapper: {
    alignItems: 'center',
    gap: 6,
  },
  circle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  selected: {
    borderWidth: 2.5,
    borderColor: COLORS.textMain,
    transform: [{ scale: 1.12 }],
  },
  emoji: {
    fontSize: 28,
  },
  label: {
    textAlign: 'center',
    fontSize: SIZES.fontSmall,
    color: COLORS.textSub,
    fontWeight: '500',
  },
  labelActive: {
    color: COLORS.textMain,
    fontWeight: '700',
  },
});

export default MoodSelector;
