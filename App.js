import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { MainNavigator } from './src/navigation/AppNavigator';
import { COLORS } from './src/theme/theme';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      <MainNavigator />
    </NavigationContainer>
  );
}