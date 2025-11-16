import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { CountdownProvider } from './src/contexts/CountdownContext';
import Home from './src/screens/Home';
import GenerateQrScreen from './src/screens/GenerateQrScreen';
import ScanQrScreen from './src/screens/ScanQrScreen';
import AttendanceListScreen from './src/screens/AttendanceListScreen';
import Sessions from './src/screens/Sessions';
import Profile from './src/screens/Profile';
import QrButton from './src/components/QrButton';

const Stack = createStackNavigator();

export default function App() {
  return (
    <CountdownProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="GenerateQr" component={GenerateQrScreen} options={{ title: 'Générer QR' }} />
          <Stack.Screen name="ScanQr" component={ScanQrScreen} options={{ title: 'Scanner QR' }} />
          <Stack.Screen name="AttendanceList" component={AttendanceListScreen} options={{ title: 'Liste de Présence' }} />
          <Stack.Screen name="Sessions" component={Sessions} />
          <Stack.Screen name="Profile" component={Profile} />
        </Stack.Navigator>
        <QrButton onPress={() => {/* Navigate to scan or generate based on user role */}} />
      </NavigationContainer>
    </CountdownProvider>
  );
}
