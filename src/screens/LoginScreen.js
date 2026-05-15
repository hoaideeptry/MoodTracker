import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';

const LoginScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Welcome Back! 👋</Text>
        <Text style={styles.subTitle}>Hãy đăng nhập để tiếp tục ghi chép cảm xúc nhé.</Text>

        <View style={styles.formGroup}>
          <TextInput 
            style={styles.input} 
            placeholder="Email của bạn" 
            placeholderTextColor={COLORS.textSub}
            keyboardType="email-address"
          />
          <TextInput 
            style={styles.input} 
            placeholder="Mật khẩu" 
            placeholderTextColor={COLORS.textSub}
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={styles.btnText}>Đăng Nhập</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkBtn}>
          <Text style={styles.linkText}>Chưa có tài khoản? <Text style={{color: COLORS.primary, fontWeight: 'bold'}}>Đăng ký ngay</Text></Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center' },
  content: { padding: SIZES.padding },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 10 },
  subTitle: { fontSize: 16, color: COLORS.textSub, marginBottom: 40, lineHeight: 24 },
  formGroup: { marginBottom: 30 },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 20,
    marginBottom: 15,
    fontSize: 16,
    color: COLORS.textMain,
    shadowColor: COLORS.textMain,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: 20,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  btnText: { fontSize: 18, fontWeight: 'bold', color: COLORS.white },
  linkBtn: { marginTop: 25, alignItems: 'center' },
  linkText: { fontSize: 15, color: COLORS.textSub }
});

export default LoginScreen;