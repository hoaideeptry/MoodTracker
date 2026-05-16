import React from 'react';
import { TouchableWithoutFeedback, Keyboard, View, Platform } from 'react-native';

/**
 * DismissKeyboard
 * - Mobile (iOS/Android): bọc TouchableWithoutFeedback → chạm ngoài input = ẩn bàn phím
 * - Web: trả về View bình thường → không can thiệp sự kiện click chuột, TextInput giữ focus đúng
 */
const DismissKeyboard = ({ children, style }) => {
  if (Platform.OS === 'web') {
    return <View style={[{ flex: 1 }, style]}>{children}</View>;
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={[{ flex: 1 }, style]}>{children}</View>
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboard;
