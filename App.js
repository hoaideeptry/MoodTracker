import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { MainNavigator } from './src/navigation/AppNavigator';
import { COLORS } from './src/theme/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
        <MainNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}