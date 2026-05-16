import { db, auth } from './firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Hàm gửi dữ liệu cảm xúc lên Firebase
export const saveMoodLog = async (moodScore, note) => {
  try {
    const uid = auth.currentUser?.uid || 'anonymous';
    const docRef = await addDoc(collection(db, "MoodLogs"), {
      moodScore: moodScore,
      note: note,
      userId: uid,
      timestamp: serverTimestamp(),
    });
    console.log("Đã lưu thành công với ID: ", docRef.id);
    return { success: true };
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu: ", error);
    return { success: false, error: error.message };
  }
};