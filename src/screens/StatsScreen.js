import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../theme/theme';
import StatCard from '../components/StatCard';
import FrequentMood from '../components/FrequentMood';
import WeeklyOverview from '../components/WeeklyOverview';
import MonthlyChart from '../components/MonthlyChart';

// TODO: [BACKEND] Thay mock data bằng Firebase query
const MOCK_STATS = {
  totalEntries: 42,
  mostFrequentMood: { emoji: '😊', label: 'Vui' },
  currentStreak: 7,
  weekSummary: [
    { day: 'T2', moodId: 3 },
    { day: 'T3', moodId: 4 },
    { day: 'T4', moodId: 2 },
    { day: 'T5', moodId: 3 },
    { day: 'T6', moodId: 5 },
    { day: 'T7', moodId: 4 },
    { day: 'CN', moodId: 1 },
  ],
};

const StatsScreen = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        // TODO: [BACKEND] Thay bằng Firebase call
        // const snap = await firestore().collection('stats').doc(userId).get();
        await new Promise((r) => setTimeout(r, 600));
        if (mounted) { setStats(MOCK_STATS); setErrorMsg(null); }
      } catch (e) {
        if (mounted) setErrorMsg('Không thể tải dữ liệu.');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Đang tải thống kê...</Text>
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errEmoji}>😥</Text>
        <Text style={styles.errText}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Thống kê 📊</Text>

        {stats && (
          <>
            <View style={styles.row}>
              <StatCard value={stats.totalEntries} label="Tổng ghi chép" cardBg={COLORS.primary} />
              <StatCard value={`${stats.currentStreak} ngày`} label="Chuỗi liên tục" cardBg={COLORS.softBlue} />
            </View>

            <FrequentMood
              emoji={stats.mostFrequentMood.emoji}
              label={stats.mostFrequentMood.label}
            />

            <View style={styles.spacer} />
            <WeeklyOverview weekData={stats.weekSummary} />

            <View style={styles.spacer} />
            <MonthlyChart />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  content: { padding: SIZES.padding, paddingBottom: 110 },
  title: { fontSize: SIZES.fontTitle, color: COLORS.textMain, fontWeight: 'bold', marginTop: 8, marginBottom: 28 },
  row: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  spacer: { height: 20 },
  loadingText: { fontSize: SIZES.fontBody, color: COLORS.textSub, marginTop: 12 },
  errEmoji: { fontSize: 48, marginBottom: 12 },
  errText: { fontSize: SIZES.fontBody, color: COLORS.textSub, textAlign: 'center' },
});

export default StatsScreen;