import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from '../services/firebaseConfig';
import MoodSelector from '../components/MoodSelector';
import { saveMoodLog } from '../services/moodService';

const HomeScreen = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [weekPercent, setWeekPercent] = useState(0);

  const user = auth.currentUser;
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Bạn';

  // Tính tiến trình tuần: số ngày có log / 7
  useEffect(() => {
    const load = async () => {
      try {
        const uid = user?.uid;
        if (!uid) return;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        const q = query(collection(db, 'MoodLogs'), where('userId', '==', uid), orderBy('timestamp', 'asc'));
        const snap = await getDocs(q);
        const uniqueDays = new Set();
        snap.docs.forEach((d) => {
          const ts = d.data().timestamp?.toDate?.();
          if (ts && ts >= sevenDaysAgo) {
            const key = `${ts.getFullYear()}-${ts.getMonth()}-${ts.getDate()}`;
            uniqueDays.add(key);
          }
        });
        setWeekPercent(Math.round((uniqueDays.size / 7) * 100));
      } catch (e) { console.error('Week progress error:', e); }
    };
    load();
  }, [selectedMood]); // Re-fetch khi lưu xong (selectedMood reset về null)

  const handleSave = async () => {
    if (!selectedMood) { alert("Hoàng tử ơi, hãy chọn một cảm xúc đã nhé!"); return; }
    const result = await saveMoodLog(selectedMood, note);
    if (result.success) {
      alert("Dữ liệu đã được bay thẳng lên Firebase!");
      setNote(""); setSelectedMood(null);
    } else { alert("Lỗi rồi hoàng tử: " + result.error); }
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll} showsVerticalScrollIndicator={false}>
        <Text style={s.greeting}>Hello, {displayName} 🌸</Text>
        <Text style={s.subtitle}>Hôm nay tâm trạng của bạn thế nào?</Text>

        <TextInput style={s.noteInput} placeholder="Viết một chút về ngày hôm nay của bạn..."
          placeholderTextColor="#AAA" multiline value={note} onChangeText={setNote} />

        <Text style={s.section}>Daily Mood Log</Text>
        <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />

        {/* Tiến trình tuần - dữ liệu thật từ Firebase */}
        <View style={[s.card, { backgroundColor: '#DCF2E0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <View>
            <Text style={{ fontSize: 13, color: '#666', fontWeight: '500' }}>Tiến trình tuần</Text>
            <Text style={{ fontSize: 38, fontWeight: '800', color: '#333' }}>{weekPercent}%</Text>
            <Text style={{ fontSize: 12, color: '#888' }}>Kế hoạch tuần hoàn thành</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 62, gap: 6, justifyContent: 'center' }}>
            {['#D0E1D4', '#C8DDF0', '#E0DBEF', '#F9E4B7'].map((c, i) => (
              <View key={i} style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: c }} />
            ))}
          </View>
        </View>

        <TouchableOpacity style={s.btn} onPress={handleSave}>
          <Text style={s.btnTxt}>Lưu Nhật Ký</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF5F7' },
  scroll: { padding: 20, paddingBottom: 100 },
  greeting: { fontSize: 26, color: '#333', fontWeight: '700', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#888', marginTop: 5, marginBottom: 25 },
  noteInput: {
    backgroundColor: '#FFF', borderRadius: 24, padding: 20, height: 100,
    textAlignVertical: 'top', fontSize: 16, color: '#333', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  section: { fontSize: 18, fontWeight: '600', color: '#333', marginTop: 10 },
  card: {
    borderRadius: 24, padding: 22, marginTop: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  btn: {
    backgroundColor: '#FDD5BD', marginTop: 24, padding: 20, borderRadius: 24, alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  btnTxt: { color: '#333', fontWeight: 'bold', fontSize: 18 },
});

export default HomeScreen;