import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { COLORS, SIZES } from '../theme/theme';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      alert('Vui lòng điền đầy đủ tất cả các trường!');
      return;
    }
    if (password.length < 6) { alert('Mật khẩu phải có ít nhất 6 ký tự!'); return; }
    if (password !== confirmPassword) { alert('Mật khẩu xác nhận không khớp!'); return; }

    setIsLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName: name.trim() });
      // onAuthStateChanged trong AppNavigator sẽ tự chuyển sang MainTabs
    } catch (error) {
      console.error('Register error:', error.code, error.message);
      let msg;
      if (error.code === 'auth/email-already-in-use') msg = 'Email này đã được sử dụng!';
      else if (error.code === 'auth/invalid-email') msg = 'Email không hợp lệ!';
      else if (error.code === 'auth/weak-password') msg = 'Mật khẩu quá yếu!';
      else msg = error.message || 'Đăng ký thất bại.';
      alert(msg);
      setIsLoading(false);
    }
  };

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
              <TextInput style={styles.input} placeholder="Tên của bạn" placeholderTextColor={COLORS.textSub}
                value={name} onChangeText={setName} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput style={styles.input} placeholder="example@gmail.com" placeholderTextColor={COLORS.textSub}
                keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mật khẩu</Text>
              <TextInput style={styles.input} placeholder="Ít nhất 6 ký tự" placeholderTextColor={COLORS.textSub}
                secureTextEntry value={password} onChangeText={setPassword} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Xác nhận mật khẩu</Text>
              <TextInput style={styles.input} placeholder="Nhập lại mật khẩu" placeholderTextColor={COLORS.textSub}
                secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={[styles.primaryBtn, isLoading && { opacity: 0.7 }]} onPress={handleRegister} disabled={isLoading}>
              {isLoading ? <ActivityIndicator color={COLORS.textMain} /> : <Text style={styles.btnText}>Đăng Ký Ngay</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.linkBtn}>
              <Text style={styles.linkText}>Đã có tài khoản? <Text style={styles.linkTextBold}>Đăng nhập</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
    backgroundColor: COLORS.secondary, borderRadius: SIZES.radius, padding: 20, alignItems: 'center',
    shadowColor: COLORS.textMain, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5,
  },
  btnText: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
  linkBtn: { marginTop: 25, alignItems: 'center' },
  linkText: { fontSize: 15, color: COLORS.textSub },
  linkTextBold: { fontWeight: 'bold', color: COLORS.secondary },
});

export default RegisterScreen;