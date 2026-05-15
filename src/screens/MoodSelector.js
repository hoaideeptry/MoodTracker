import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';

const MoodSelector = ({ selectedMood, onSelectMood }) => {
  const moods = [
    { id: 1, emoji: '😢', label: 'Tệ' },
    { id: 2, emoji: '😐', label: 'Ổn' },
    { id: 3, emoji: '🙂', label: 'Bình thường' },
    { id: 4, emoji: '😊', label: 'Tốt' },
    { id: 5, emoji: '🤩', label: 'Tuyệt' }
  ];

  return (
    <View style={styles.container}>
      {moods.map((m) => (
        <TouchableOpacity 
          key={m.id} 
          activeOpacity={0.7}
          style={[styles.moodBtn, selectedMood === m.id && styles.selectedBtn]}
          onPress={() => onSelectMood(m.id)}
        >
          <Text style={styles.emoji}>{m.emoji}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginVertical: 25 
  },
  moodBtn: {
    width: 60, height: 60,
    backgroundColor: COLORS.white,
    borderRadius: 30, // Tròn vo
    justifyContent: 'center', alignItems: 'center',
    // Hiệu ứng đổ bóng siêu mịn
    shadowColor: COLORS.textMain,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 15,
    elevation: 3,
  },
  selectedBtn: {
    backgroundColor: COLORS.secondary, // Đổi nền xanh sage khi chọn
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  emoji: { fontSize: 32 }
});

export default MoodSelector;