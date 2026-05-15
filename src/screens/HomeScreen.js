import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';

const HomeScreen = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const moods = [
    { id: 1, emoji: '😢', label: 'Buồn' },
    { id: 2, emoji: '😐', label: 'Ổn' },
    { id: 3, emoji: '😊', label: 'Vui' },
    { id: 4, emoji: '🤩', label: 'Tuyệt' }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Chào hoàng tử, hôm nay bạn thấy thế nào?</Text>
      
      <View style={styles.moodContainer}>
        {moods.map((m) => (
          <TouchableOpacity 
            key={m.id} 
            style={[styles.moodCard, selectedMood === m.id && styles.selectedCard]}
            onPress={() => setSelectedMood(m.id)}
          >
            <Text style={{fontSize: 40}}>{m.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput 
        style={styles.noteInput}
        placeholder="Ghi chú ngắn về ngày hôm nay..."
        multiline
      />

      <TouchableOpacity style={styles.btnSubmit}>
        <Text style={styles.btnText}>Lưu cảm xúc</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SIZES.padding },
  greeting: { fontSize: SIZES.fontTitle, color: COLORS.textMain, fontWeight: '700', marginTop: 40 },
  moodContainer: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 30 },
  moodCard: { 
    backgroundColor: COLORS.white, 
    padding: 15, 
    borderRadius: 20, 
    elevation: 3, 
    shadowColor: COLORS.shadow 
  },
  selectedCard: { borderWidth: 2, borderColor: COLORS.primary },
  noteInput: { 
    backgroundColor: COLORS.white, 
    borderRadius: SIZES.radius, 
    padding: 15, 
    height: 120, 
    textAlignVertical: 'top' 
  },
  btnSubmit: { 
    backgroundColor: COLORS.primary, 
    marginTop: 30, 
    padding: 18, 
    borderRadius: SIZES.radius,
alignItems: 'center' 
  },
  btnText: { color: COLORS.textMain, fontWeight: 'bold', fontSize: 18 }
});

export default HomeScreen;
