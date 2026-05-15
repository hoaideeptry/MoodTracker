import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import các màn hình
import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';       // Import Login
import RegisterScreen from '../screens/RegisterScreen'; // Import Register
import { COLORS } from '../theme/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 1. Luồng Tab chính (Chỉ chứa các màn hình khi ĐÃ ĐĂNG NHẬP)
const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: true, 
      tabBarStyle: {
        height: 70,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: COLORS.white,
        position: 'absolute', 
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: -5 },
        shadowRadius: 10,
      },
      tabBarActiveTintColor: COLORS.textMain,
      tabBarInactiveTintColor: COLORS.textSub,
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Stats" component={StatsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// 2. Luồng Stack tổng (Bọc cả Auth và MainTab)
export const MainNavigator = () => {
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }} 
      initialRouteName="Login" // Mở App lên là vào thẳng Login
    >
      {/* Nhóm Auth (Chưa đăng nhập) */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      
      {/* Nhóm App Chính (Sau khi đăng nhập thành công) */}
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
    </Stack.Navigator>
  );
};