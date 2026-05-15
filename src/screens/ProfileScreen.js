import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <Text style={{fontSize: 50}}>👦🏻</Text>
        </View>
        <Text style={styles.name}>Dương Duy Khánh</Text>
        <Text style={styles.email}>khanh.duong@student.edu.vn</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>14</Text>
          <Text style={styles.statLabel}>Ngày liên tục</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>42</Text>
          <Text style={styles.statLabel}>Lượt ghi chép</Text>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Đăng xuất 👋</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: SIZES.padding },
  header: { alignItems: 'center', marginTop: 40, marginBottom: 30 },
  avatarPlaceholder: {
    width: 120, height: 120,
    backgroundColor: COLORS.white,
    borderRadius: 60,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 20,
    shadowColor: COLORS.textMain, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20, elevation: 3,
  },
  name: { fontSize: 24, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 5 },
  email: { fontSize: 16, color: COLORS.textSub },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  statCard: {
    flex: 1, backgroundColor: COLORS.secondary, // Màu Sage Green
    borderRadius: SIZES.radius, padding: 20, alignItems: 'center', marginHorizontal: 10,
  },
  statNumber: { fontSize: 28, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 5 },
  statLabel: { fontSize: 14, color: COLORS.textMain },
  actionContainer: { paddingHorizontal: 10 },
  logoutBtn: {
    backgroundColor: COLORS.white,
    padding: 20, borderRadius: SIZES.radius, alignItems: 'center',
    borderWidth: 1, borderColor: '#FFE5E5',
  },
  logoutText: { color: '#FF6B6B', fontSize: 16, fontWeight: 'bold' }
});

export default ProfileScreen;