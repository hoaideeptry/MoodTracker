import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';

// Nhúng 2 component con mà ông đã tách ra
import MoodSelector from '../components/MoodSelector';
import ProgressCard from '../components/ProgressCard';

const HomeScreen = () => {
  // Quản lý state cảm xúc đang được chọn
  const [selectedMood, setSelectedMood] = useState(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Lời chào */}
        <Text style={styles.greeting}>Hello, Dương Duy Khánh 🌸</Text>
        <Text style={styles.subtitle}>Hôm nay tâm trạng của bạn thế nào?</Text>

        {/* Khung nhập ghi chú */}
        <TextInput
          style={styles.noteInput}
          placeholder="Viết một chút về ngày hôm nay của bạn..."
          placeholderTextColor={COLORS.textSub}
          multiline
        />

        {/* Gọi Component Chọn Cảm Xúc */}
        <Text style={styles.sectionTitle}>Daily Mood Log</Text>
        <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />

        {/* Gọi Component Thẻ Tiến Độ */}
        <ProgressCard percentage={89} />

        {/* Nút Submit lưu dữ liệu */}
        <TouchableOpacity style={styles.btnSubmit}>
          <Text style={styles.btnText}>Lưu Nhật Ký</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: SIZES.padding, paddingBottom: 40 },
  greeting: { fontSize: SIZES.fontTitle, color: COLORS.textMain, fontWeight: '700', marginTop: 20 },
  subtitle: { fontSize: 16, color: COLORS.textSub, marginTop: 5, marginBottom: 25 },
  noteInput: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 20,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    color: COLORS.textMain,
    marginBottom: 20,
    shadowColor: COLORS.textMain, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: COLORS.textMain, marginTop: 10 },
  btnSubmit: {
    backgroundColor: COLORS.primary, // Nút màu cam đào Pastel
    marginTop: 30,
    padding: 20,
    borderRadius: SIZES.radius,
    alignItems: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 15, elevation: 5,
  },
  btnText: { color: COLORS.textMain, fontWeight: 'bold', fontSize: 18 }
});

export default HomeScreen;