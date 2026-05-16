import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db, auth } from '../services/firebaseConfig';
import { MOOD_EMOJI_MAP, MOOD_COLOR_MAP } from '../theme/theme';

const pad = (n) => String(n).padStart(2, '0');

const formatDateTime = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const toYMD = (date) => {
  const d = date instanceof Date ? date : new Date(date);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// Màu chấm trên lịch theo cảm xúc - dùng hex tối hơn để thấy rõ
const MOOD_DOT_COLOR = {
  1: '#B8B0E0', // Buồn - tím nhạt
  2: '#8ABDE0', // Ổn - xanh dương nhạt
  3: '#7EC8A4', // Vui - xanh lá nhạt
  4: '#F5A878', // Hạnh phúc - cam nhạt
  5: '#F0C842', // Tuyệt vời - vàng
};

const HistoryScreen = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null); // 'YYYY-MM-DD' hoặc null
  const [markedDates, setMarkedDates] = useState({});

  useFocusEffect(
    useCallback(() => {
      let ok = true;
      setLoading(true);
      (async () => {
        try {
          const uid = auth.currentUser?.uid;
          if (!uid) return;
          const q = query(
            collection(db, 'MoodLogs'),
            where('userId', '==', uid),
            orderBy('timestamp', 'desc'),
          );
          const snap = await getDocs(q);
          const data = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
            timestamp: d.data().timestamp?.toDate?.() || new Date(),
          }));
          if (!ok) return;
          setLogs(data);

          // Xây dựng markedDates cho Calendar
          const marks = {};
          data.forEach((item) => {
            const key = toYMD(item.timestamp);
            // Lấy moodScore cuối cùng trong ngày (data sort desc → item đầu tiên gặp là mới nhất)
            if (!marks[key]) {
              marks[key] = {
                marked: true,
                dotColor: MOOD_DOT_COLOR[item.moodScore] || '#CCC',
                customStyles: {
                  container: { backgroundColor: MOOD_COLOR_MAP[item.moodScore] || '#EEE', borderRadius: 10 },
                  text: { color: '#333', fontWeight: '600' },
                },
              };
            }
          });
          setMarkedDates(marks);
        } catch (e) {
          console.error('HistoryScreen fetch error:', e);
        } finally {
          if (ok) setLoading(false);
        }
      })();
      return () => { ok = false; };
    }, [])
  );

  const filteredLogs = selectedDay
    ? logs.filter((item) => toYMD(item.timestamp) === selectedDay)
    : logs;

  const onDayPress = (day) => {
    if (selectedDay === day.dateString) {
      setSelectedDay(null); // Bấm lại để bỏ chọn
    } else {
      setSelectedDay(day.dateString);
    }
  };

  // Cập nhật markedDates khi chọn ngày - dùng markingType='dot' để tránh conflict
  const displayMarked = (() => {
    const base = {};
    Object.entries(markedDates).forEach(([dateStr, val]) => {
      base[dateStr] = {
        marked: true,
        dotColor: val.dotColor,
        selected: dateStr === selectedDay,
        selectedColor: '#F0A0B8',
      };
    });
    // Nếu ngày chọn chưa có log (không có trong markedDates), vẫn phải highlight
    if (selectedDay && !base[selectedDay]) {
      base[selectedDay] = { selected: true, selectedColor: '#F0A0B8' };
    }
    return base;
  })();

  const renderItem = ({ item }) => (
    <View style={s.card}>
      <View style={[s.moodBadge, { backgroundColor: MOOD_COLOR_MAP[item.moodScore] || '#EEE' }]}>
        <Text style={s.moodEmoji}>{MOOD_EMOJI_MAP[item.moodScore] || '😐'}</Text>
      </View>
      <View style={s.cardContent}>
        <Text style={s.dateText}>{formatDateTime(item.timestamp)}</Text>
        <Text style={s.noteText} numberOfLines={3}>
          {item.note || '(Không có ghi chú)'}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={s.safe}>
      {/* Tiêu đề */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Lịch sử 🗓️</Text>
        {selectedDay && (
          <TouchableOpacity onPress={() => setSelectedDay(null)} style={s.clearBtn}>
            <Text style={s.clearTxt}>Xem tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color="#F0A0B8" />
        </View>
      ) : (
        <FlatList
          data={filteredLogs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.listContent}
          ListEmptyComponent={
            <View style={s.emptyBox}>
              <Text style={s.emptyEmoji}>📭</Text>
              <Text style={s.emptyText}>
                {selectedDay ? 'Không có nhật ký ngày này' : 'Chưa có nhật ký nào'}
              </Text>
            </View>
          }
          ListHeaderComponent={
            <View style={s.calendarWrapper}>
              <Calendar
                markingType="dot"
                markedDates={displayMarked}
                onDayPress={onDayPress}
                theme={{
                  backgroundColor: 'transparent',
                  calendarBackground: '#FFFFFF',
                  textSectionTitleColor: '#9A8C98',
                  selectedDayBackgroundColor: '#F0A0B8',
                  selectedDayTextColor: '#FFFFFF',
                  todayTextColor: '#E75480',
                  todayBackgroundColor: '#FFF0F5',
                  dayTextColor: '#4A4E69',
                  textDisabledColor: '#D5D3D0',
                  dotColor: '#F0A0B8',
                  selectedDotColor: '#FFFFFF',
                  arrowColor: '#9A8C98',
                  monthTextColor: '#4A4E69',
                  textMonthFontWeight: '700',
                  textMonthFontSize: 16,
                  textDayFontSize: 14,
                  textDayHeaderFontSize: 12,
                }}
                style={s.calendar}
              />
              <Text style={s.sectionTitle}>
                {selectedDay
                  ? `Nhật ký ngày ${selectedDay.split('-').reverse().join('/')}`
                  : `Tất cả nhật ký (${logs.length})`}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF5F7' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#4A4E69' },
  clearBtn: {
    backgroundColor: '#FDD5BD',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  clearTxt: { fontSize: 13, color: '#4A4E69', fontWeight: '600' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  calendarWrapper: { paddingHorizontal: 12 },
  calendar: {
    borderRadius: 24,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A4E69',
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  listContent: { paddingHorizontal: 12, paddingBottom: 110 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  moodBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    flexShrink: 0,
  },
  moodEmoji: { fontSize: 26 },
  cardContent: { flex: 1 },
  dateText: { fontSize: 12, color: '#9A8C98', fontWeight: '500', marginBottom: 4 },
  noteText: { fontSize: 15, color: '#4A4E69', lineHeight: 21 },
  emptyBox: { alignItems: 'center', paddingTop: 40 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 15, color: '#9A8C98', fontWeight: '500' },
});

export default HistoryScreen;
