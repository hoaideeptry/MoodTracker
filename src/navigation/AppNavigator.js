import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';
import { COLORS } from '../theme/theme';

const Tab = createBottomTabNavigator();

export const MainNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        const iconName =
          route.name === 'Trang chủ'
            ? focused ? 'home' : 'home-outline'
            : focused ? 'bar-chart' : 'bar-chart-outline';
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: COLORS.textMain,
      tabBarInactiveTintColor: COLORS.textSub,
      tabBarStyle: {
        height: 70,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        position: 'absolute',
        overflow: 'hidden',
        paddingBottom: 8,
        paddingTop: 8,
        backgroundColor: COLORS.white,
        borderTopWidth: 0,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
      },
    })}
  >
    <Tab.Screen name="Trang chủ" component={HomeScreen} />
    <Tab.Screen name="Thống kê" component={StatsScreen} />
  </Tab.Navigator>
);