import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { ScoreDirectModal } from '@/components/feuille/ScoreDirectModal';
import { VOLLEY_RULES } from '@/constants/VolleyRules';
import type { SetScore } from '@/types/match';

interface Props {
  scores: SetScore;
  onScores: (scores: Partial<SetScore>) => void;
}

const SETS = ['set1', 'set2', 'set3', 'set4', 'set5'] as const;

export function FeuilleSectionScores({ scores, onScores }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [scoreModalVisible, setScoreModalVisible] = useState(false);

  const updateSet = (key: (typeof SETS)[number], side: 'a' | 'b', value: number | null) => {
    const v = value === null ? null : Math.max(0, Math.min(99, value));
    onScores({
      [key]: { ...scores[key], [side]: v },
    });
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: colors.tint }]}>Scores</Text>
        <TouchableOpacity
          style={[styles.scoreDirectBtn, { backgroundColor: colors.tint }]}
          onPress={() => setScoreModalVisible(true)}
        >
          <FontAwesome name="trophy" size={14} color="#fff" />
          <Text style={styles.scoreDirectBtnText}>Score en direct</Text>
        </TouchableOpacity>
      </View>
      <Text style={[styles.hint, { color: colors.tabIconDefault }]}>
        {VOLLEY_RULES.POINTS_TO_WIN_SET} pts/set, {VOLLEY_RULES.POINTS_TO_WIN_TIEBREAK} au tie-break
      </Text>
      {SETS.map((key, i) => (
        <View key={key} style={[styles.row, { borderColor: colors.border }]}>
          <Text style={[styles.setLabel, { color: colors.text }]}>Set {i + 1}</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            value={scores[key].a === null ? '' : String(scores[key].a)}
            onChangeText={(t) => updateSet(key, 'a', t === '' ? null : parseInt(t, 10) || 0)}
            keyboardType="number-pad"
            placeholder="-"
            placeholderTextColor="#94a3b8"
          />
          <Text style={[styles.vs, { color: colors.tabIconDefault }]}>-</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            value={scores[key].b === null ? '' : String(scores[key].b)}
            onChangeText={(t) => updateSet(key, 'b', t === '' ? null : parseInt(t, 10) || 0)}
            keyboardType="number-pad"
            placeholder="-"
            placeholderTextColor="#94a3b8"
          />
        </View>
      ))}
      <ScoreDirectModal
        visible={scoreModalVisible}
        onClose={() => setScoreModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  title: { fontSize: 16, fontWeight: '700' },
  scoreDirectBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  scoreDirectBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  hint: { fontSize: 12, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1 },
  setLabel: { width: 50, fontSize: 14, fontWeight: '600' },
  input: { width: 56, borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 16, textAlign: 'center' },
  vs: { fontSize: 16 },
});
