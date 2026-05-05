import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import { Anton_400Regular } from '@expo-google-fonts/anton';
import { TitilliumWeb_400Regular, TitilliumWeb_700Bold } from '@expo-google-fonts/titillium-web';
import { COLORS, FONT } from './style/theme';

export default function App() {
  const [fontsLoaded] = useFonts({
    Anton_400Regular,
    TitilliumWeb_400Regular,
    TitilliumWeb_700Bold
  });

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TÍTULO</Text>
      <Text style={styles.subtitle}>Experience the magic of hands-free highway driving on 97% of controlled access highways in the U.S. and Canada.</Text>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: FONT.title,
    fontSize: 32,
    color: COLORS.lightNeutral,
  },
  subtitle: {
    fontFamily: FONT.body,
    fontSize: 16,
    color: COLORS.lightNeutral,
  },
});