import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';

const LoginScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Chào mừng trở lại! 👋</Text>
          <Text style={styles.subTitle}>Hãy đăng nhập để tiếp tục hành trình chăm sóc tâm hồn nhé.</Text>
        </View>

        {/* Form Section */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput 
              style={styles.input} 
              placeholder="nhap-email-cua-ban@gmail.com" 
              placeholderTextColor={COLORS.textSub}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mật khẩu</Text>
            <TextInput 
              style={styles.input} 
              placeholder="••••••••" 
              placeholderTextColor={COLORS.textSub}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>

        {/* Buttons Section */}
        <View style={styles.footer}>
          
          {/* Đã chèn sự kiện chuyển sang MainTabs vào đây */}
          <TouchableOpacity 
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('MainTabs')} 
          >
            <Text style={styles.btnText}>Đăng Nhập</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Register')} 
            style={styles.linkBtn}
          >
            <Text style={styles.linkText}>
              Chưa có tài khoản? <Text style={styles.linkTextBold}>Đăng ký ngay</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, padding: SIZES.padding, justifyContent: 'center' },
  header: { marginBottom: 40 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 12 },
  subTitle: { fontSize: 16, color: COLORS.textSub, lineHeight: 24 },
  form: { marginBottom: 20 },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textMain, marginBottom: 8, marginLeft: 5 },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: SIZES.radius,
    padding: 20,
    fontSize: 16,
    color: COLORS.textMain,
    shadowColor: COLORS.textMain, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2,
  },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -5 },
  forgotText: { color: COLORS.textSub, fontSize: 14, fontWeight: '500' },
  footer: { marginTop: 20 },
  primaryBtn: {
    backgroundColor: COLORS.primary, // Màu Cam Đào Pastel
    borderRadius: SIZES.radius,
    padding: 20,
    alignItems: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 8,
  },
  btnText: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
  linkBtn: { marginTop: 25, alignItems: 'center' },
  linkText: { fontSize: 15, color: COLORS.textSub },
  linkTextBold: { color: COLORS.primary, fontWeight: 'bold' }
});

export default LoginScreen;