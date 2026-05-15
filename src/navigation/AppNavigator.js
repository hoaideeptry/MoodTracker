import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen'; // Hoàng tử sẽ tạo sau

const Tab = createBottomTabNavigator();

export const MainNavigator = () => (
  <Tab.Navigator screenOptions={{
    headerShown: false,
    tabBarStyle: { height: 70, borderTopLeftRadius: 30, borderTopRightRadius: 30 }
  }}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Thống kê" component={StatsScreen} />
  </Tab.Navigator>
);