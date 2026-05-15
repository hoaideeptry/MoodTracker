import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { COLORS, SIZES } from '../theme/theme';

const RegisterScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Tạo tài khoản mới 🌟</Text>
            <Text style={styles.subTitle}>Bắt đầu hành trình thấu hiểu bản thân cùng MoodTracker.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Họ và Tên</Text>
              <TextInput style={styles.input} placeholder="Dương Duy Khánh" placeholderTextColor={COLORS.textSub} />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput style={styles.input} placeholder="nhap-email-cua-ban@gmail.com" placeholderTextColor={COLORS.textSub} keyboardType="email-address" />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mật khẩu</Text>
              <TextInput style={styles.input} placeholder="Ít nhất 6 ký tự" placeholderTextColor={COLORS.textSub} secureTextEntry />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Xác nhận mật khẩu</Text>
              <TextInput style={styles.input} placeholder="Nhập lại mật khẩu" placeholderTextColor={COLORS.textSub} secureTextEntry />
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={[styles.primaryBtn, {backgroundColor: COLORS.secondary}]}>
              <Text style={styles.btnText}>Đăng Ký Ngay</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkBtn}>
              <Text style={styles.linkText}>
                Đã có tài khoản? <Text style={[styles.linkTextBold, {color: COLORS.secondary}]}>Đăng nhập</Text>
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Sử dụng lại Styles của Login và chỉnh sửa một chút cho đồng bộ
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: SIZES.padding, paddingVertical: 40 },
  header: { marginBottom: 35 },
  headerTitle: { fontSize: 30, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 10 },
  subTitle: { fontSize: 16, color: COLORS.textSub, lineHeight: 24 },
  form: { marginBottom: 10 },
  inputContainer: { marginBottom: 18 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textMain, marginBottom: 8, marginLeft: 5 },
  input: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 18, fontSize: 16, color: COLORS.textMain,
    shadowColor: COLORS.textMain, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 1,
  },
  footer: { marginTop: 10 },
  primaryBtn: {
    borderRadius: SIZES.radius, padding: 20, alignItems: 'center',
    shadowColor: COLORS.textMain, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5,
  },
  btnText: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
  linkBtn: { marginTop: 25, alignItems: 'center' },
  linkText: { fontSize: 15, color: COLORS.textSub },
  linkTextBold: { fontWeight: 'bold' }
});

export default RegisterScreen;