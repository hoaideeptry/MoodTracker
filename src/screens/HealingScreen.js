import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, SafeAreaView,
  ActivityIndicator, TouchableOpacity, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db, auth } from '../services/firebaseConfig';
import { MOOD_EMOJI_MAP } from '../theme/theme';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────
const POSITIVE_MOODS = [3, 4, 5]; // Vui, Hạnh phúc, Tuyệt vời

const NEGATIVE_CONTENT = {
  quotes: [
    '\"Sau mỗi cơn mưa, trời lại sáng. Bạn sẽ ổn thôi.\"',
    '\"Cảm xúc là khách thăm, không phải chủ nhà. Hãy để nó đi qua.\"',
    '\"Mạnh mẽ không có nghĩa là không cảm thấy đau — mà là vẫn tiếp tục dù đau.\"',
    '\"Hôm nay khó khăn, nhưng bạn đã vượt qua những ngày như vậy trước đây rồi.\"',
  ],
  suggestions: [
    {
      icon: '🎵',
      label: 'Nghe nhạc Lofi',
      desc: '🎵 Có Hẹn Với Thanh Xuân (Lofi Ver)\n🎵 Bước Qua Mùa Cô Đơn (Lofi Ver)\n🎵 Lofi Girl - beats to relax/study to',
    },
    { icon: '🧘', label: 'Thiền định 5 phút', desc: 'Nhắm mắt, tập trung vào từng hơi thở' },
    { icon: '📝', label: 'Viết nhật ký', desc: 'Ghi lại cảm xúc để nhẹ lòng và giải phóng tâm trí' },
  ],
};

const POSITIVE_CONTENT = {
  quotes: [
    '\"Hạnh phúc không phải là điểm đến — đó là cách bạn đang sống.\"',
    '\"Mỗi ngày vui là một món quà — hãy trân trọng khoảnh khắc này.\"',
    '\"Tiếp tục tỏa sáng — thế giới cần ánh sáng của bạn!\"',
    '\"Năng lượng tích cực của bạn có thể thay đổi ngày của người khác.\"',
  ],
  suggestions: [
    { icon: '📞', label: 'Gọi cho người thân / bạn cũ', desc: 'Chia sẻ niềm vui hôm nay — hạnh phúc nhân đôi!' },
    { icon: '🌿', label: 'Ra ngoài đi dạo', desc: 'Tận hưởng không khí tươi mát trong ngày tuyệt vời này' },
    { icon: '🎯', label: 'Bắt đầu điều gì đó mới', desc: 'Tâm trạng tốt là lúc hoàn hảo để chinh phục thử thách' },
  ],
};

// ─────────────────────────────────────────────
// Breathing Circle Component
// ─────────────────────────────────────────────
const BREATH_PHASES = [
  { label: 'Hít vào...', toValue: 1.45, duration: 4000 },
  { label: 'Giữ...', toValue: 1.45, duration: 2000 },
  { label: 'Thở ra...', toValue: 1.0, duration: 4000 },
  { label: 'Nghỉ...', toValue: 1.0, duration: 1000 },
];

const BreathingExercise = ({ onStop }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [seconds, setSeconds] = useState(60); // 1 phút
  const mountedRef = useRef(true);

  // Fade in khi mount
  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    return () => { mountedRef.current = false; };
  }, [opacity]);

  // Đếm ngược 60 giây
  useEffect(() => {
    const timer = setInterval(() => {
      if (!mountedRef.current) return;
      setSeconds((s) => {
        if (s <= 1) { clearInterval(timer); onStop?.(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [onStop]);

  // Vòng lặp hít thở
  useEffect(() => {
    let idx = 0;
    const runPhase = () => {
      if (!mountedRef.current) return;
      const phase = BREATH_PHASES[idx % BREATH_PHASES.length];
      setPhaseIndex(idx % BREATH_PHASES.length);
      Animated.timing(scale, {
        toValue: phase.toValue,
        duration: phase.duration,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && mountedRef.current) {
          idx++;
          runPhase();
        }
      });
    };
    runPhase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentPhase = BREATH_PHASES[phaseIndex];

  return (
    <Animated.View style={[bc.wrapper, { opacity }]}>
      <Text style={bc.timer}>{seconds}s</Text>

      {/* Vòng tròn hít thở */}
      <View style={bc.circleArea}>
        {/* Outer pulse */}
        <Animated.View style={[bc.outerRing, { transform: [{ scale }] }]} />
        {/* Middle ring */}
        <Animated.View style={[bc.middleRing, { transform: [{ scale: Animated.multiply(scale, 0.88) }] }]} />
        {/* Core */}
        <Animated.View style={[bc.core, { transform: [{ scale: Animated.multiply(scale, 0.72) }] }]}>
          <Text style={bc.phaseEmoji}>
            {phaseIndex === 0 ? '🌬️' : phaseIndex === 1 ? '🤫' : phaseIndex === 2 ? '😮‍💨' : '😌'}
          </Text>
          <Text style={bc.phaseLabel}>{currentPhase.label}</Text>
        </Animated.View>
      </View>

      <Text style={bc.hint}>Hít theo nhịp vòng tròn • 4 - 2 - 4 giây</Text>
      <TouchableOpacity style={bc.stopBtn} onPress={onStop} activeOpacity={0.8}>
        <Text style={bc.stopTxt}>Dừng lại</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const bc = StyleSheet.create({
  wrapper: { alignItems: 'center', paddingVertical: 20 },
  timer: { fontSize: 14, color: '#9A8C98', fontWeight: '600', marginBottom: 16, letterSpacing: 1 },
  circleArea: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  outerRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(176,168,224,0.18)',
  },
  middleRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(176,168,224,0.28)',
  },
  core: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#E0DBEF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#9A8CE0',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  phaseEmoji: { fontSize: 32, marginBottom: 6 },
  phaseLabel: { fontSize: 14, fontWeight: '700', color: '#4A4E69', letterSpacing: 0.4 },
  hint: { fontSize: 13, color: '#9A8C98', fontStyle: 'italic', textAlign: 'center', marginBottom: 20 },
  stopBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E0DBEF',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 50,
  },
  stopTxt: { fontSize: 14, fontWeight: '600', color: '#9A8C98' },
});

// ─────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────
const HealingScreen = () => {
  const [latestMood, setLatestMood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  // Set lưu index các thử thách đã hoàn thành
  const [completedChallenges, setCompletedChallenges] = useState(new Set());

  useFocusEffect(
    useCallback(() => {
      let ok = true;
      setLoading(true);
      setIsBreathing(false);   // Reset mỗi khi vào tab
      setQuoteIndex(0);
      setCompletedChallenges(new Set()); // Reset thử thách khi chuyển tab

      (async () => {
        try {
          const uid = auth.currentUser?.uid;
          if (!uid) {
            if (ok) { setLatestMood(null); setLoading(false); }
            return;
          }

          // Query đúng: lấy 1 bản ghi mới nhất theo timestamp
          // Firestore yêu cầu composite index cho userId+timestamp
          // Nếu chưa có index, Firestore sẽ in URL tạo index vào console
          const q = query(
            collection(db, 'MoodLogs'),
            where('userId', '==', uid),
            orderBy('timestamp', 'desc'),
            limit(1),
          );

          const snap = await getDocs(q);
          if (!ok) return;

          if (snap.empty) {
            console.log('[HealingScreen] Không có nhật ký nào');
            setLatestMood(null);
          } else {
            const raw = snap.docs[0].data().moodScore;
            const score = Number(raw);
            console.log('[HealingScreen] moodScore =', score, '| isPositive =', [3,4,5].includes(score));
            setLatestMood(score);
          }
        } catch (e) {
          console.error('[HealingScreen] Lỗi query:', e.message);
          // Nếu lỗi do thiếu Firestore index — URL tạo index sẽ hiện trong log
          // Fallback: null thay vì 3 (Vui) để tránh hiển UI sai
          if (ok) setLatestMood(null);
        } finally {
          if (ok) setLoading(false);
        }
      })();

      return () => { ok = false; };
    }, []),
  );

  if (loading) {
    return (
      <SafeAreaView style={s.safe}>
        <View style={s.center}>
          <ActivityIndicator size="large" color="#E0DBEF" />
          <Text style={{ color: '#9A8C98', marginTop: 12, fontSize: 14 }}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Không có dữ liệu — chưa ghi nhật ký lần nào
  if (latestMood === null) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: '#FFF5F7' }]}>
        <View style={s.center}>
          <Text style={{ fontSize: 60, marginBottom: 16 }}>📓</Text>
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#4A4E69', textAlign: 'center' }}>
            Chưa có nhật ký nào
          </Text>
          <Text style={{ fontSize: 14, color: '#9A8C98', textAlign: 'center', marginTop: 8, paddingHorizontal: 40 }}>
            Hãy vào trang chủ và ghi lại cảm xúc hôm nay nhé 🌸
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Phân loại: Tiêu cực = 1,2 | Tích cực = 3,4,5
  // POSITIVE_MOODS = [3,4,5] — mọi giá trị khác (1,2) đều là tiêu cực
  const isPositive = POSITIVE_MOODS.includes(latestMood);
  const content = isPositive ? POSITIVE_CONTENT : NEGATIVE_CONTENT;
  const bgColor = isPositive ? '#FFFBF5' : '#F9F5FF';
  const accentColor = isPositive ? '#F0A850' : '#9A8CE0';
  const accentBg = isPositive ? '#FFF0D4' : '#EDE8FF';

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: bgColor }]}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Section ── */}
        <View style={s.hero}>
          <Text style={s.moodEmoji}>{MOOD_EMOJI_MAP[latestMood] || '😊'}</Text>
          <Text style={s.heroTitle}>
            {isPositive ? 'Bạn Đang Tỏa Sáng! ✨' : 'Hít Thở Cùng Mình Nhé 🌿'}
          </Text>
          <Text style={s.heroSub}>
            {isPositive
              ? 'Tâm trạng đang rất tốt — hãy lan toả năng lượng tuyệt vời này!'
              : 'Không sao cả. Mỗi cảm xúc đều có lý do của nó. Bạn không đơn độc.'}
          </Text>
        </View>

        {/* ── Quote ── */}
        <TouchableOpacity
          style={[s.quoteCard, { borderLeftColor: accentColor }]}
          onPress={() => setQuoteIndex((p) => (p + 1) % content.quotes.length)}
          activeOpacity={0.85}
        >
          <Text style={s.quoteText}>{content.quotes[quoteIndex]}</Text>
          <Text style={[s.quoteTap, { color: accentColor }]}>Chạm để xem câu tiếp theo →</Text>
        </TouchableOpacity>

        {/* ── Bài tập hít thở (chỉ khi tiêu cực) ── */}
        {!isPositive && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>🌬️ Bài tập hít thở</Text>
            {isBreathing ? (
              <BreathingExercise onStop={() => setIsBreathing(false)} />
            ) : (
              <View style={s.breathCard}>
                <Text style={s.breathCardTitle}>Bắt đầu 1 phút hít thở sâu</Text>
                <Text style={s.breathCardDesc}>
                  Kỹ thuật 4-2-4: hít vào 4 giây, giữ 2 giây, thở ra 4 giây.{'\n'}
                  Khoa học chứng minh giúp giảm căng thẳng chỉ sau 60 giây!
                </Text>
                <TouchableOpacity
                  style={s.breathStartBtn}
                  onPress={() => setIsBreathing(true)}
                  activeOpacity={0.85}
                >
                  <Text style={s.breathStartTxt}>▶  Bắt đầu bài tập hít thở 1 phút</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {/* ── Gợi ý hành động ── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>
            {isPositive ? '🚀 Thử thách hôm nay' : '📆 Gợi ý cho bạn'}
          </Text>

          {/* Banner tổng kết (chỉ hiện khi tích cực) */}
          {isPositive && completedChallenges.size > 0 && (
            <View style={s.progressBanner}>
              <Text style={s.progressBannerTxt}>
                ✅ Hoàn thành {completedChallenges.size}/{content.suggestions.length} thử thách hôm nay!
                {completedChallenges.size === content.suggestions.length ? '  🎉' : ''}
              </Text>
            </View>
          )}

          {content.suggestions.map((item, idx) => {
            const isDone = isPositive && completedChallenges.has(idx);

            const toggleChallenge = () => {
              if (!isPositive) return; // Chỉ cho toggle khi tích cực
              setCompletedChallenges((prev) => {
                const next = new Set(prev);
                if (next.has(idx)) {
                  next.delete(idx);
                } else {
                  next.add(idx);
                }
                return next;
              });
            };

            return (
              <TouchableOpacity
                key={idx}
                style={[
                  s.sugCard,
                  { backgroundColor: isDone ? '#DCF2E0' : accentBg },
                  isDone && s.sugCardDone,
                ]}
                onPress={toggleChallenge}
                activeOpacity={0.82}
              >
                {/* Icon cảm xúc */}
                <Text style={[s.sugIcon, isDone && { opacity: 0.5 }]}>{item.icon}</Text>

                {/* Nội dung */}
                <View style={s.sugBody}>
                  <Text style={[
                    s.sugLabel,
                    isDone && s.sugLabelDone,
                  ]}>{item.label}</Text>
                  <Text style={[
                    s.sugDesc,
                    isDone && s.sugDescDone,
                  ]}>{item.desc}</Text>
                </View>

                {/* Icon tick hoàn thành (chỉ hiện khi positive) */}
                {isPositive && (
                  <Ionicons
                    name={isDone ? 'checkmark-circle' : 'ellipse-outline'}
                    size={26}
                    color={isDone ? '#4CAF82' : '#C8C0D0'}
                    style={{ marginLeft: 8, flexShrink: 0 }}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  safe: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 20, paddingBottom: 120 },

  // Hero
  hero: { alignItems: 'center', paddingTop: 20, paddingBottom: 24 },
  moodEmoji: { fontSize: 80, marginBottom: 14 },
  heroTitle: {
    fontSize: 24, fontWeight: '800', color: '#4A4E69',
    textAlign: 'center', letterSpacing: 0.2,
  },
  heroSub: {
    fontSize: 14, color: '#9A8C98', textAlign: 'center',
    marginTop: 10, lineHeight: 22, paddingHorizontal: 16,
  },

  // Quote
  quoteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    borderLeftWidth: 4,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  quoteText: {
    fontSize: 16, fontWeight: '600', color: '#4A4E69',
    lineHeight: 26, fontStyle: 'italic',
  },
  quoteTap: { fontSize: 12, marginTop: 12, fontWeight: '600' },

  // Section
  section: { marginTop: 20 },
  sectionLabel: {
    fontSize: 15, fontWeight: '700', color: '#4A4E69',
    marginBottom: 14, letterSpacing: 0.2,
  },

  // Breathing card (trước khi bắt đầu)
  breathCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    shadowColor: '#9A8CE0',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 4,
  },
  breathCardTitle: {
    fontSize: 17, fontWeight: '800', color: '#4A4E69',
    marginBottom: 10, textAlign: 'center',
  },
  breathCardDesc: {
    fontSize: 13, color: '#9A8C98', textAlign: 'center',
    lineHeight: 20, marginBottom: 20,
  },
  breathStartBtn: {
    backgroundColor: '#E0DBEF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 50,
  },
  breathStartTxt: {
    fontSize: 14, fontWeight: '700', color: '#4A4E69', letterSpacing: 0.2,
  },

  // Suggestion cards
  sugCard: {
    borderRadius: 20, padding: 18, marginBottom: 12,
    flexDirection: 'row', alignItems: 'flex-start',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  // Style khi đã hoàn thành
  sugCardDone: {
    shadowColor: '#4CAF82',
    shadowOpacity: 0.12,
    elevation: 1,
  },
  sugIcon: { fontSize: 36, marginRight: 16, marginTop: 2 },
  sugBody: { flex: 1 },
  sugLabel: { fontSize: 15, fontWeight: '700', color: '#4A4E69', marginBottom: 5 },
  sugLabelDone: {
    textDecorationLine: 'line-through',
    opacity: 0.55,
    color: '#7A9A85',
  },
  sugDesc: { fontSize: 13, color: '#9A8C98', lineHeight: 22 },
  sugDescDone: {
    opacity: 0.45,
    textDecorationLine: 'line-through',
  },
  // Banner tiến độ thử thách
  progressBanner: {
    backgroundColor: '#DCF2E0',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  progressBannerTxt: {
    fontSize: 13, fontWeight: '700', color: '#2D6A4F',
  },
});

export default HealingScreen;
