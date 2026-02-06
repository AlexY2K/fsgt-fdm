import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { ScoreDirectView } from '@/components/feuille/ScoreDirectView';
import { ScoreDirectProvider } from '@/context/ScoreDirectContext';
import Colors from '@/constants/Colors';

export default function ScoreDirectScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <ScoreDirectProvider>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScoreDirectView source="scoreDirect" />
      </View>
    </ScoreDirectProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
