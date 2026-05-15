import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback,
  TextInput, Alert, ActivityIndicator, ScrollView, Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, MOODS } from '../theme/theme';
import MoodSelector from '../components/MoodSelector';
import ProgressCard from '../components/ProgressCard';

const HomeScreen = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isReady = selectedMood !== null && note.trim().length > 0;

  const handleSubmitMood = useCallback(async () => {
    if (!isReady) return;
    const moodData = MOODS.find((m) => m.id === selectedMood);
    const entry = {
      moodId: selectedMood,
      moodLabel: moodData?.label,
      moodEmoji: moodData?.emoji,
      note: note.trim(),
      timestamp: new Date().toISOString(),
    };

    setIsLoading(true);
    try {
      // TODO: [BACKEND] await firestore().collection('moods').add(entry);
      await new Promise((r) => setTimeout(r, 800));
      Alert.alert('Thành công ✨', 'Đã lưu cảm xúc của bạn!');
      setSelectedMood(null);
      setNote('');
    } catch (e) {
      Alert.alert('Lỗi', 'Không thể lưu. Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
  }, [isReady, selectedMood, note]);

  return (
    <SafeAreaView style={styles.safe}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView style={styles.sv} contentContainerStyle={styles.sc}
          keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.hdr}>
            <Text style={styles.hdrLbl}>Nhật ký cảm xúc</Text>
            <View style={styles.avatar}><Text style={styles.avTxt}>🌸</Text></View>
          </View>

          <Text style={styles.greet}>Xin chào! 👋</Text>
          <Text style={styles.sub}>
            Hôm nay bạn cảm thấy <Text style={styles.bold}>thế nào?</Text>
          </Text>

          <View style={styles.inputCard}>
            <TextInput style={styles.input} placeholder="Ghi lại cảm xúc của bạn..."
              placeholderTextColor={COLORS.textSub} multiline value={note}
              onChangeText={setNote} maxLength={500} returnKeyType="done"
              blurOnSubmit={true} autoCapitalize="sentences" />
            <Text style={styles.cc}>{note.length}/500</Text>
          </View>

          <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />

          <TouchableOpacity style={[styles.btn, !isReady && styles.btnDis]}
            onPress={handleSubmitMood} disabled={!isReady || isLoading} activeOpacity={0.7}>
            {isLoading ? <ActivityIndicator color={COLORS.white} size="small" />
              : <Text style={[styles.btnTxt, !isReady && styles.btnTxtDis]}>Lưu cảm xúc</Text>}
          </TouchableOpacity>

          <ProgressCard />
        </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  sv: { flex: 1 },
  sc: { padding: SIZES.padding, paddingBottom: 110 },
  hdr: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 4 },
  hdrLbl: { fontSize: 14, color: COLORS.textSub, fontWeight: '600', letterSpacing: 0.5 },
  avatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  avTxt: { fontSize: 18 },
  greet: { fontSize: SIZES.fontTitle, color: COLORS.textMain, fontWeight: '700' },
  sub: { fontSize: SIZES.fontBody, color: COLORS.textSub, marginTop: 4, marginBottom: 22, lineHeight: 22 },
  bold: { fontWeight: '700', color: COLORS.textMain },
  inputCard: {
    backgroundColor: COLORS.white, borderRadius: 30, padding: 18, marginBottom: 30,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 5,
  },
  input: { height: 80, textAlignVertical: 'top', fontSize: SIZES.fontBody, color: COLORS.textMain, lineHeight: 22 },
  cc: { fontSize: SIZES.fontSmall, color: COLORS.textSub, textAlign: 'right', marginTop: 4 },
  btn: {
    backgroundColor: COLORS.primary, marginTop: 30, paddingVertical: 18, borderRadius: 30, alignItems: 'center',
    elevation: 4, shadowColor: '#F0B89A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6,
  },
  btnDis: { backgroundColor: COLORS.disabled, elevation: 0, shadowOpacity: 0 },
  btnTxt: { color: COLORS.white, fontWeight: 'bold', fontSize: 17 },
  btnTxtDis: { color: COLORS.disabledText },
});

export default HomeScreen;
