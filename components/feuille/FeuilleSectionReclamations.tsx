import React from 'react';
import { View, Text, TextInput, StyleSheet, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';

interface Props {
  value: string;
  onChange: (s: string) => void;
}

export function FeuilleSectionReclamations({ value, onChange }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.tint }]}>Réclamations</Text>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        value={value}
        onChangeText={onChange}
        placeholder="Réclamations éventuelles..."
        placeholderTextColor="#94a3b8"
        multiline
        numberOfLines={4}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, minHeight: 100, textAlignVertical: 'top' },
});
