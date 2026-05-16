import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../services/firebaseConfig';
import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HistoryScreen from '../screens/HistoryScreen';
import HealingScreen from '../screens/HealingScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import { COLORS } from '../theme/theme';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TAB_ICONS = {
  Home:    ['home',     'home-outline'],
  Stats:   ['bar-chart','bar-chart-outline'],
  History: ['calendar', 'calendar-outline'],
  Healing: ['leaf',     'leaf-outline'],
  Profile: ['person',   'person-outline'],
};

const TAB_LABELS = {
  Home:    'Trang chủ',
  Stats:   'Thống kê',
  History: 'Lịch sử',
  Healing: 'Chữa lành',
  Profile: 'Hồ sơ',
};

// Luồng Tab chính (sau khi đăng nhập)
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => (
        <Ionicons name={TAB_ICONS[route.name][focused ? 0 : 1]} size={size} color={color} />
      ),
      tabBarLabel: TAB_LABELS[route.name] || route.name,
      tabBarStyle: {
        height: 72,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: COLORS.white,
        position: 'absolute',
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: -5 },
        shadowRadius: 12,
        paddingBottom: 10,
        paddingTop: 6,
      },
      tabBarActiveTintColor: COLORS.textMain,
      tabBarInactiveTintColor: COLORS.textSub,
      tabBarLabelStyle: { fontSize: 10, fontWeight: '600' },
    })}
  >
    <Tab.Screen name="Home"    component={HomeScreen} />
    <Tab.Screen name="Stats"   component={StatsScreen} />
    <Tab.Screen name="History" component={HistoryScreen} />
    <Tab.Screen name="Healing" component={HealingScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// Luồng Auth (chưa đăng nhập)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login"    component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
  </Stack.Navigator>
);

// Navigator gốc - tự động chuyển luồng theo trạng thái Auth
export const MainNavigator = () => {
  const [user, setUser] = useState(undefined); // undefined = đang kiểm tra

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u ?? null));
    return unsub;
  }, []);

  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return user ? <MainTabs /> : <AuthStack />;
};