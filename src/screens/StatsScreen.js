import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';

const StatsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thống kê Tâm trạng 📊</Text>
      <Text style={{color: COLORS.textSub}}>Biểu đồ sẽ được hiển thị ở đây!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: COLORS.background, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  title: { 
    fontSize: SIZES.fontTitle, 
    color: COLORS.textMain, 
    fontWeight: 'bold',
    marginBottom: 10
  }
});

export default StatsScreen;