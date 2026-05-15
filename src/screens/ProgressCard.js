import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';

const ProgressCard = ({ percentage }) => {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.title}>Your progress</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>
      <View style={styles.iconWrapper}>
        {/* Chỗ này sau này mình nhét icon hình tròn lồng nhau vào */}
        <Text style={{fontSize: 24, color: COLORS.textMain}}>🌱</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 30, // Bo góc cực sâu như ảnh
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    // Đổ bóng nổi Card
    shadowColor: COLORS.textMain,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  title: { fontSize: 16, color: COLORS.textMain, fontWeight: '600' },
  percentage: { fontSize: 60, color: COLORS.textMain, fontWeight: 'bold', marginTop: 5 },
  iconWrapper: {
    width: 60, height: 60,
    backgroundColor: COLORS.primary, // Cam đào pastel
    borderRadius: 20,
    justifyContent: 'center', alignItems: 'center'
  }
});

export default ProgressCard;