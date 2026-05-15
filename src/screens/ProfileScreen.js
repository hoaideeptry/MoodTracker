import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Modal, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebaseConfig';

const ProfileScreen = () => {
  const user = auth.currentUser;
  const [profile, setProfile] = useState({ name: '', email: '', birthday: '', hobbies: '' });
  const [edit, setEdit] = useState({ name: '', birthday: '', hobbies: '' });
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const snap = await getDoc(doc(db, 'Users', user.uid));
      if (snap.exists()) {
        const d = snap.data();
        setProfile({ name: d.name || user.displayName || '', email: user.email, birthday: d.birthday || '', hobbies: d.hobbies || '' });
      } else {
        setProfile({ name: user.displayName || '', email: user.email, birthday: '', hobbies: '' });
      }
    } catch (e) { console.error('Load profile:', e); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadProfile(); }, []);

  const openEdit = () => {
    setEdit({ name: profile.name, birthday: profile.birthday, hobbies: profile.hobbies });
    setModal(true);
  };

  const handleSave = async () => {
    try {
      await setDoc(doc(db, 'Users', user.uid), {
        name: edit.name, email: user.email, birthday: edit.birthday, hobbies: edit.hobbies,
      }, { merge: true });
      setModal(false);
      setLoading(true);
      await loadProfile();
    } catch (e) { alert('Lỗi lưu: ' + e.message); }
  };

  const handleLogout = async () => {
    try { await signOut(auth); } catch (e) { alert('Lỗi đăng xuất: ' + e.message); }
  };

  if (loading) return <View style={s.ctr}><ActivityIndicator size="large" color="#FF5722" /></View>;

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>
        {/* Avatar + Tên */}
        <View style={{ alignItems: 'center', marginTop: 30, marginBottom: 24 }}>
          <View style={s.avatar}><Text style={{ fontSize: 50 }}>👦🏻</Text></View>
          <Text style={s.name}>{profile.name || 'Chưa đặt tên'}</Text>
          <Text style={s.email}>{profile.email}</Text>
        </View>

        {/* Thông tin cá nhân */}
        <View style={s.card}>
          <InfoRow label="Họ và Tên" value={profile.name || '—'} />
          <InfoRow label="Email" value={profile.email} />
          <InfoRow label="Ngày sinh" value={profile.birthday || '—'} />
          <InfoRow label="Sở thích" value={profile.hobbies || '—'} last />
        </View>

        <TouchableOpacity style={s.editBtn} onPress={openEdit}>
          <Text style={s.editTxt}>✏️ Chỉnh sửa thông tin</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout}>
          <Text style={s.logoutTxt}>Đăng xuất 👋</Text>
        </TouchableOpacity>

        {/* Edit Modal */}
        <Modal visible={modal} transparent animationType="slide">
          <View style={s.overlay}>
            <View style={s.modalBox}>
              <Text style={s.modalTitle}>Chỉnh sửa thông tin</Text>
              <Text style={s.lbl}>Họ và Tên</Text>
              <TextInput style={s.input} value={edit.name} onChangeText={(t) => setEdit({ ...edit, name: t })} />
              <Text style={s.lbl}>Email</Text>
              <TextInput style={[s.input, { backgroundColor: '#EEE', color: '#999' }]} value={user.email} editable={false} />
              <Text style={s.lbl}>Ngày sinh</Text>
              <TextInput style={s.input} value={edit.birthday} onChangeText={(t) => setEdit({ ...edit, birthday: t })} placeholder="DD/MM/YYYY" />
              <Text style={s.lbl}>Sở thích</Text>
              <TextInput style={s.input} value={edit.hobbies} onChangeText={(t) => setEdit({ ...edit, hobbies: t })} placeholder="Đọc sách, du lịch..." />
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                <TouchableOpacity style={[s.mBtn, { backgroundColor: '#EEE', flex: 1 }]} onPress={() => setModal(false)}>
                  <Text style={{ color: '#666', fontWeight: '600' }}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.mBtn, { backgroundColor: '#FDD5BD', flex: 1 }]} onPress={handleSave}>
                  <Text style={{ color: '#333', fontWeight: 'bold' }}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ label, value, last }) => (
  <View style={[{ paddingVertical: 14 }, !last && { borderBottomWidth: 1, borderBottomColor: '#F0E8EB' }]}>
    <Text style={{ fontSize: 12, color: '#999', marginBottom: 2 }}>{label}</Text>
    <Text style={{ fontSize: 16, color: '#333', fontWeight: '500' }}>{value}</Text>
  </View>
);

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF5F7' },
  ctr: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF5F7' },
  scroll: { padding: 20, paddingBottom: 40 },
  avatar: {
    width: 110, height: 110, borderRadius: 55, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  name: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  email: { fontSize: 14, color: '#888' },
  card: {
    backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  editBtn: {
    backgroundColor: '#EAE4FF', borderRadius: 24, padding: 18, alignItems: 'center', marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  editTxt: { fontSize: 16, fontWeight: '600', color: '#333' },
  logoutBtn: {
    backgroundColor: '#FFF', borderRadius: 24, padding: 18, alignItems: 'center',
    borderWidth: 1, borderColor: '#FFE5E5',
  },
  logoutTxt: { color: '#FF6B6B', fontSize: 16, fontWeight: 'bold' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: '#FFF', borderRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  lbl: { fontSize: 13, color: '#888', marginBottom: 4, marginTop: 10, marginLeft: 4 },
  input: {
    backgroundColor: '#FAFAFA', borderRadius: 16, padding: 14, fontSize: 15, color: '#333',
    borderWidth: 1, borderColor: '#F0E8EB',
  },
  mBtn: { borderRadius: 16, padding: 14, alignItems: 'center' },
});

export default ProfileScreen;