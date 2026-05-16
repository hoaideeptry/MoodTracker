import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, SafeAreaView, Animated,
  Keyboard, InputAccessoryView, Platform,
} from 'react-native';
import DismissKeyboard from '../components/DismissKeyboard';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from '../services/firebaseConfig';
import MoodSelector from '../components/MoodSelector';
import AestheticToast from '../components/AestheticToast';
import { saveMoodLog } from '../services/moodService';

// ID liên kết InputAccessoryView với TextInput (chỉ dùng trên iOS)
const NOTE_INPUT_ACCESSORY_ID = 'note-done-bar';

// ── Floating Done Bar (Android / cross-platform fallback) ──
// Hiện một thanh nổi ngay trên bàn phím khi bàn phím mở
const KeyboardDoneBar = () => {
  const translateY = useRef(new Animated.Value(60)).current;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => {
      setVisible(true);
      Animated.spring(translateY, {
        toValue: 0, useNativeDriver: true,
        tension: 80, friction: 12,
      }).start();
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(translateY, {
        toValue: 60, duration: 180, useNativeDriver: true,
      }).start(() => setVisible(false));
    });
    return () => { show.remove(); hide.remove(); };
  }, [translateY]);

  if (!visible) return null;

  return (
    <Animated.View style={[doneBarStyles.bar, { transform: [{ translateY }] }]}>
      <TouchableOpacity onPress={Keyboard.dismiss} style={doneBarStyles.btn} activeOpacity={0.7}>
        <Text style={doneBarStyles.txt}>Xong</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const doneBarStyles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#F4F0FA',
    borderTopWidth: 1,
    borderTopColor: '#E0D8EC',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    zIndex: 99,
  },
  btn: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#E0DBEF',
  },
  txt: { fontSize: 15, fontWeight: '700', color: '#4A4E69', letterSpacing: 0.2 },
});

// 7 ô vuông nhỏ - mỗi ô là 1 ngày trong tuần
const WeekDots = ({ loggedDays }) => {
  const today = new Date();
  return (
    <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
      {Array.from({ length: 7 }, (_, i) => {
        const d = new Date(today);
        d.setDate(today.getDate() - (6 - i));
        d.setHours(0, 0, 0, 0);
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        const hasLog = loggedDays.has(key);
        return (
          <View
            key={i}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: hasLog ? '#7EC8A4' : '#E8E5E0',
            }}
          />
        );
      })}
    </View>
  );
};

const HomeScreen = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [weekPercent, setWeekPercent] = useState(0);
  const [loggedDays, setLoggedDays] = useState(new Set());

  // Toast state
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success', icon: '' });

  const progressAnim = useRef(new Animated.Value(0)).current;

  const user = auth.currentUser;
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Bạn';

  const showToast = (message, type = 'success', icon = '') => {
    setToast({ visible: true, message, type, icon });
  };
  const hideToast = () => setToast((t) => ({ ...t, visible: false }));

  // Fetch & tính tiến trình tuần thật từ Firebase
  const fetchWeekProgress = useCallback(async () => {
    try {
      const uid = user?.uid;
      if (!uid) return;

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const q = query(
        collection(db, 'MoodLogs'),
        where('userId', '==', uid),
        orderBy('timestamp', 'asc'),
      );
      const snap = await getDocs(q);
      const days = new Set();
      snap.docs.forEach((d) => {
        const ts = d.data().timestamp?.toDate?.();
        if (ts && ts >= sevenDaysAgo) {
          days.add(`${ts.getFullYear()}-${ts.getMonth()}-${ts.getDate()}`);
        }
      });

      const pct = Math.round((days.size / 7) * 100);
      setLoggedDays(days);
      setWeekPercent(pct);

      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: pct / 100,
        duration: 800,
        useNativeDriver: false,
      }).start();
    } catch (e) {
      console.error('Week progress error:', e);
    }
  }, [user?.uid, progressAnim]);

  // useFocusEffect để luôn cập nhật khi quay lại tab
  useFocusEffect(
    useCallback(() => {
      fetchWeekProgress();
    }, [fetchWeekProgress]),
  );

  const handleSave = async () => {
    Keyboard.dismiss(); // Ẩn bàn phím ngay lập tức
    if (!selectedMood) {
      showToast('Hãy chọn một cảm xúc đã nhé! 🌸', 'error', '💭');
      return;
    }
    const result = await saveMoodLog(selectedMood, note);
    if (result.success) {
      setNote('');
      setSelectedMood(null);
      showToast('Nhật ký đã được lưu! 🎉', 'success', '🎉');
      fetchWeekProgress();
    } else {
      showToast('Lưu thất bại, thử lại nhé!', 'error', '😔');
    }
  };

  const barWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <DismissKeyboard>
      <SafeAreaView style={s.safe}>
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Greeting */}
          <Text style={s.greeting}>Hello, {displayName} 🌸</Text>
          <Text style={s.subtitle}>Hôm nay tâm trạng của bạn thế nào?</Text>

          {/* Note Input */}
          <TextInput
            style={s.noteInput}
            placeholder="Viết một chút về ngày hôm nay của bạn..."
            placeholderTextColor="#C0B8CC"
            multiline
            value={note}
            onChangeText={setNote}
            // iOS: liên kết với InputAccessoryView bên dưới
            inputAccessoryViewID={Platform.OS === 'ios' ? NOTE_INPUT_ACCESSORY_ID : undefined}
          />

          {/* iOS: Thanh 'Xong' gắn vào bàn phím nàtive */}
          {Platform.OS === 'ios' && (
            <InputAccessoryView nativeID={NOTE_INPUT_ACCESSORY_ID}>
              <View style={ib.bar}>
                <TouchableOpacity onPress={Keyboard.dismiss} style={ib.btn} activeOpacity={0.7}>
                  <Text style={ib.txt}>Xong ✓</Text>
                </TouchableOpacity>
              </View>
            </InputAccessoryView>
          )}

          {/* Mood Selector + Nút Lưu gần nhau */}
          <View style={s.moodBlock}>
            <Text style={s.section}>Daily Mood Log</Text>
            <MoodSelector selectedMood={selectedMood} onSelectMood={setSelectedMood} />

            <TouchableOpacity style={s.btn} onPress={handleSave} activeOpacity={0.8}>
              <Text style={s.btnTxt}>💾  Lưu Nhật Ký</Text>
            </TouchableOpacity>
          </View>

          {/* Card tiến trình tuần — dữ liệu thật */}
          <View style={s.card}>
            <View style={s.progressHeader}>
              <View>
                <Text style={s.progressLabel}>Tiến trình tuần</Text>
                <Text style={s.progressPct}>{weekPercent}%</Text>
                <Text style={s.progressSub}>
                  {loggedDays.size}/7 ngày đã ghi chép
                </Text>
              </View>
              <WeekDots loggedDays={loggedDays} />
            </View>

            {/* Progress Bar */}
            <View style={s.barTrack}>
              <Animated.View style={[s.barFill, { width: barWidth }]} />
            </View>
          </View>
        </ScrollView>

        {/* Toast — render ngoài ScrollView để nổi lên trên */}
        <AestheticToast
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          icon={toast.icon}
          duration={2000}
          onHide={hideToast}
        />

        {/* Android: Floating Done Bar nổi trên bàn phím */}
        {Platform.OS !== 'ios' && <KeyboardDoneBar />}
      </SafeAreaView>
    </DismissKeyboard>
  );
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF5F7' },
  scroll: { padding: 20, paddingBottom: 120 },

  greeting: { fontSize: 26, color: '#4A4E69', fontWeight: '700', marginTop: 12 },
  subtitle: { fontSize: 15, color: '#9A8C98', marginTop: 4, marginBottom: 20 },

  noteInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 15,
    color: '#4A4E69',
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    lineHeight: 22,
  },

  // Mood block: selector + nút gần nhau trong 1 card
  moodBlock: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    marginTop: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  section: { fontSize: 16, fontWeight: '700', color: '#4A4E69', marginBottom: 16 },

  btn: {
    backgroundColor: '#FDD5BD',
    marginTop: 18,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#F0A878',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  btnTxt: { color: '#4A4E69', fontWeight: '800', fontSize: 16, letterSpacing: 0.3 },

  // Progress card
  card: {
    backgroundColor: '#DCF2E0',
    borderRadius: 24,
    padding: 20,
    marginTop: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  progressLabel: { fontSize: 13, color: '#5A7A65', fontWeight: '600' },
  progressPct: { fontSize: 40, fontWeight: '900', color: '#2D5A3D', lineHeight: 46 },
  progressSub: { fontSize: 12, color: '#7A9A82', marginTop: 2 },

  barTrack: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: 10,
    backgroundColor: '#4CAF82',
    borderRadius: 10,
  },
});

// Style cho iOS InputAccessoryView toolbar
const ib = StyleSheet.create({
  bar: {
    backgroundColor: '#F4F0FA',
    borderTopWidth: 1,
    borderTopColor: '#E0D8EC',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  btn: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#E0DBEF',
  },
  txt: { fontSize: 15, fontWeight: '700', color: '#4A4E69', letterSpacing: 0.2 },
});

export default HomeScreen;