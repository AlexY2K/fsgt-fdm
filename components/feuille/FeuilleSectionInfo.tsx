import React from 'react';
import { View, Text, TextInput, StyleSheet, useColorScheme, Switch } from 'react-native';
import { ChampionnatSelect } from '@/components/ChampionnatSelect';
import { DateTimePickerField } from '@/components/DateTimePickerField';
import Colors from '@/constants/Colors';
import type { MatchInfo } from '@/types/match';

interface Props {
  info: MatchInfo;
  onInfo: (info: Partial<MatchInfo>) => void;
}

export function FeuilleSectionInfo({ info, onInfo }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.tint }]}>Informations match</Text>
      <ChampionnatSelect value={info.championnat} onChange={(v) => onInfo({ championnat: v })} />
      <Text style={[styles.label, { color: colors.text }]}>Date et heure</Text>
      <DateTimePickerField value={info.dateTime} onChange={(v) => onInfo({ dateTime: v })} />
      <Text style={[styles.label, { color: colors.text }]}>Salle</Text>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        value={info.salle}
        onChangeText={(v) => onInfo({ salle: v })}
        placeholder="Nom de la salle"
        placeholderTextColor="#94a3b8"
      />
      <View style={styles.row}>
        <Text style={[styles.label, { color: colors.text }]}>Auto-arbitrage</Text>
        <Switch
          value={info.autoArbitrage}
          onValueChange={(v) => onInfo({ autoArbitrage: v })}
          trackColor={{ false: colors.border, true: colors.tint }}
        />
      </View>
      {!info.autoArbitrage && (
        <>
          <Text style={[styles.label, { color: colors.text }]}>Arbitre</Text>
          <TextInput
            style={[styles.input, styles.inputWithMargin, { color: colors.text, borderColor: colors.border }]}
            value={info.arbitreNom}
            onChangeText={(v) => onInfo({ arbitreNom: v })}
            placeholder="Nom"
            placeholderTextColor="#94a3b8"
          />
          <TextInput
            style={[styles.input, styles.inputWithMargin, { color: colors.text, borderColor: colors.border }]}
            value={info.arbitreLicence}
            onChangeText={(v) => onInfo({ arbitreLicence: v })}
            placeholder="N° licence"
            placeholderTextColor="#94a3b8"
          />
          <TextInput
            style={[styles.input, styles.inputWithMargin, { color: colors.text, borderColor: colors.border }]}
            value={info.arbitreClub}
            onChangeText={(v) => onInfo({ arbitreClub: v })}
            placeholder="Club"
            placeholderTextColor="#94a3b8"
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, marginTop: 12 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
  inputWithMargin: { marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
});
