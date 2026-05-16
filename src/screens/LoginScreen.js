import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, KeyboardAvoidingView, Platform,
  ActivityIndicator, ScrollView,
  Keyboard, TouchableWithoutFeedback,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { COLORS, SIZES } from '../theme/theme';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    Keyboard.dismiss(); // Ẩn bàn phím ngay khi nhấn nút
    if (!email.trim() || !password.trim()) {
      alert('Vui lòng nhập đầy đủ Email và Mật khẩu!');
      return;
    }
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // onAuthStateChanged trong AppNavigator sẽ tự chuyển sang MainTabs
    } catch (error) {
      let msg = error.message;
      if (error.code === 'auth/user-not-found') msg = 'Tài khoản không tồn tại!';
      else if (error.code === 'auth/wrong-password') msg = 'Sai mật khẩu!';
      else if (error.code === 'auth/invalid-email') msg = 'Email không hợp lệ!';
      else if (error.code === 'auth/invalid-credential') msg = 'Email hoặc mật khẩu không đúng!';
      alert(msg);
      setIsLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <SafeAreaView style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chào mừng trở lại! 👋</Text>
            <Text style={styles.subTitle}>Hãy đăng nhập để tiếp tục hành trình chăm sóc tâm hồn nhé.</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="your email@gmail.com"
                placeholderTextColor={COLORS.textSub}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
                value={email}
                onChangeText={setEmail}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mật khẩu</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={COLORS.textSub}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleLogin}
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.primaryBtn, isLoading && { opacity: 0.7 }]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading
                ? <ActivityIndicator color={COLORS.textMain} />
                : <Text style={styles.btnText}>Đăng Nhập</Text>}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              style={styles.linkBtn}
            >
              <Text style={styles.linkText}>
                Chưa có tài khoản?{' '}
                <Text style={styles.linkTextBold}>Đăng ký ngay</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flexGrow: 1, padding: SIZES.padding, justifyContent: 'center' },
  header: { marginBottom: 40 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: COLORS.textMain, marginBottom: 12 },
  subTitle: { fontSize: 16, color: COLORS.textSub, lineHeight: 24 },
  form: { marginBottom: 20 },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textMain, marginBottom: 8, marginLeft: 5 },
  input: {
    backgroundColor: COLORS.white, borderRadius: SIZES.radius, padding: 20, fontSize: 16, color: COLORS.textMain,
    shadowColor: COLORS.textMain, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10, elevation: 2,
  },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -5 },
  forgotText: { color: COLORS.textSub, fontSize: 14, fontWeight: '500' },
  footer: { marginTop: 20 },
  primaryBtn: {
    backgroundColor: COLORS.primary, borderRadius: SIZES.radius, padding: 20, alignItems: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 8,
  },
  btnText: { fontSize: 18, fontWeight: 'bold', color: COLORS.textMain },
  linkBtn: { marginTop: 25, alignItems: 'center' },
  linkText: { fontSize: 15, color: COLORS.textSub },
  linkTextBold: { color: COLORS.primary, fontWeight: 'bold' },
});

export default LoginScreen;