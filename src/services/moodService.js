import { db } from './firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Hàm gửi dữ liệu cảm xúc lên Firebase
export const saveMoodLog = async (moodScore, note) => {
  try {
    // Tạo một Collection tên là "MoodLogs" và lưu dữ liệu vào
    const docRef = await addDoc(collection(db, "MoodLogs"), {
      moodScore: moodScore,
      note: note,
      timestamp: serverTimestamp(),
    });
    console.log("Đã lưu thành công với ID: ", docRef.id);
    return { success: true };
  } catch (error) {
    console.error("Lỗi khi lưu dữ liệu: ", error);
    return { success: false, error: error.message };
  }
};