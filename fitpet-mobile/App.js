import React, { useState } from 'react';
import { View, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/theme';
import Header from './src/components/Header';
import TabBar from './src/components/TabBar';
import DiarioScreen from './src/screens/DiarioScreen';
import EntrenoScreen from './src/screens/EntrenoScreen';
import ComunidadScreen from './src/screens/ComunidadScreen';
import MascotaScreen from './src/screens/MascotaScreen';
import PerfilScreen from './src/screens/PerfilScreen';
import { useStore } from './src/store/useStore';

const topInset = Platform.OS === 'android' ? (RNStatusBar.currentHeight || 24) + 8 : 56;
const bottomInset = Platform.OS === 'ios' ? 24 : 8;

const SCREENS = {
  diario: DiarioScreen,
  entreno: EntrenoScreen,
  comunidad: ComunidadScreen,
  mascota: MascotaScreen,
  perfil: PerfilScreen,
};

export default function App() {
  const [tab, setTab] = useState('diario');
  const streak = useStore((s) => s.pet.streak);
  const Screen = SCREENS[tab];

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <View style={{ height: topInset }} />
      <Header streak={streak} />
      <View style={{ flex: 1 }}>
        <Screen />
      </View>
      <TabBar active={tab} onChange={setTab} bottomInset={bottomInset} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
});
