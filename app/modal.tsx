import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, TouchableOpacity, Text, View, useColorScheme } from 'react-native';

import Colors from '@/constants/Colors';

export default function ModalScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const handleNouveauMatch = () => {
    router.back();
    router.push('/(tabs)/(feuilles)/feuille/nouveau' as never);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Feuille de Match FSGT</Text>
      <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
        Remplace les feuilles papier pour le volley-ball 4x4
      </Text>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.tint }]}
        onPress={handleNouveauMatch}
      >
        <Text style={styles.buttonText}>Nouveau match</Text>
      </TouchableOpacity>

      <View style={[styles.footer, { borderColor: colors.border }]}>
        <Text style={[styles.footerText, { color: colors.tabIconDefault }]}>
          FSGT - Fédération Sportive et Gymnique du Travail
        </Text>
        <Text style={[styles.footerText, { color: colors.tabIconDefault }]}>
          Comité de Paris
        </Text>
      </View>

      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    alignItems: 'center',
    borderTopWidth: 1,
    paddingTop: 24,
  },
  footerText: {
    fontSize: 12,
    marginTop: 4,
  },
});
