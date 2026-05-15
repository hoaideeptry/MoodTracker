import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';
import ProfileScreen from '../screens/ProfileScreen'; // Import thêm Profile
import { COLORS } from '../theme/theme';

const Tab = createBottomTabNavigator();

export const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarShowLabel: true, // Tạm hiện chữ để test, sau này chèn Icon sau
      tabBarStyle: {
        height: 70,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: COLORS.white,
        position: 'absolute', // Làm tab bar nổi lên khỏi viền đáy
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: -5 },
        shadowRadius: 10,
      },
      tabBarActiveTintColor: COLORS.textMain, // Màu chữ khi đang chọn Tab
      tabBarInactiveTintColor: COLORS.textSub, // Màu chữ Tab không được chọn
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Stats" component={StatsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);  