import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { INPUT_LIMITS } from '@/constants/Validation';
import type { Team, Player } from '@/types/match';

interface Props {
  equipeA: Team;
  equipeB: Team;
  onEquipeA: (data: Partial<Team>) => void;
  onEquipeB: (data: Partial<Team>) => void;
  onJoueurA: (index: number, data: Partial<Player>) => void;
  onJoueurB: (index: number, data: Partial<Player>) => void;
  onAddJoueurA: () => void;
  onAddJoueurB: () => void;
  onRemoveJoueurA: (index: number) => void;
  onRemoveJoueurB: (index: number) => void;
}

function TeamBlock({
  label,
  team,
  onTeam,
  onJoueur,
  onAdd,
  onRemove,
  colors,
}: {
  label: string;
  team: Team;
  onTeam: (d: Partial<Team>) => void;
  onJoueur: (i: number, d: Partial<Player>) => void;
  onAdd: () => void;
  onRemove: (i: number) => void;
  colors: (typeof Colors)['light'];
}) {
  return (
    <View style={[styles.teamCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.teamTitle, { color: colors.tint }]}>{label}</Text>
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        value={team.nom}
        onChangeText={(v) => onTeam({ nom: v })}
        placeholder="Nom de l'équipe"
        placeholderTextColor="#94a3b8"
        maxLength={INPUT_LIMITS.TEAM_NAME}
      />
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        value={team.coach}
        onChangeText={(v) => onTeam({ coach: v })}
        placeholder="Coach"
        placeholderTextColor="#94a3b8"
        maxLength={INPUT_LIMITS.TEXT_SHORT}
      />
      <TextInput
        style={[styles.input, { color: colors.text, borderColor: colors.border }]}
        value={team.capitaine}
        onChangeText={(v) => onTeam({ capitaine: v })}
        placeholder="Capitaine"
        placeholderTextColor="#94a3b8"
        maxLength={INPUT_LIMITS.TEXT_SHORT}
      />
      <View style={styles.joueursHeader}>
        <Text style={[styles.subtitle, { color: colors.text }]}>Joueurs</Text>
        <TouchableOpacity
          style={[styles.addBtnCompact, { borderColor: colors.border }]}
          onPress={onAdd}
        >
          <FontAwesome name="plus" size={12} color={colors.tint} />
          <Text style={[styles.addBtnCompactText, { color: colors.tint }]}>Ajouter un joueur</Text>
        </TouchableOpacity>
      </View>
      {team.joueurs.map((j, i) => (
        <View key={j.id} style={[styles.joueurRow, { borderColor: colors.border }]}>
          <TextInput
            style={[styles.joueurInput, { color: colors.text, borderColor: colors.border }]}
            value={j.nom}
            onChangeText={(v) => onJoueur(i, { nom: v })}
            placeholder="Nom"
            placeholderTextColor="#94a3b8"
            maxLength={INPUT_LIMITS.TEXT_SHORT}
          />
          <TextInput
            style={[styles.joueurInput, { color: colors.text, borderColor: colors.border }]}
            value={j.prenom}
            onChangeText={(v) => onJoueur(i, { prenom: v })}
            placeholder="Prénom"
            placeholderTextColor="#94a3b8"
            maxLength={INPUT_LIMITS.TEXT_SHORT}
          />
          <TextInput
            style={[styles.joueurInput, { color: colors.text, borderColor: colors.border }]}
            value={j.numeroLicence}
            onChangeText={(v) => onJoueur(i, { numeroLicence: v })}
            placeholder="Licence"
            placeholderTextColor="#94a3b8"
            maxLength={INPUT_LIMITS.LICENCE}
          />
          <TouchableOpacity onPress={() => onRemove(i)} style={styles.removeBtn}>
            <FontAwesome name="trash-o" size={18} color={colors.tabIconDefault} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

export function FeuilleSectionEquipes({
  equipeA,
  equipeB,
  onEquipeA,
  onEquipeB,
  onJoueurA,
  onJoueurB,
  onAddJoueurA,
  onAddJoueurB,
  onRemoveJoueurA,
  onRemoveJoueurB,
}: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={styles.container}>
      <TeamBlock
        label="Équipe A"
        team={equipeA}
        onTeam={onEquipeA}
        onJoueur={onJoueurA}
        onAdd={onAddJoueurA}
        onRemove={onRemoveJoueurA}
        colors={colors}
      />
      <TeamBlock
        label="Équipe B"
        team={equipeB}
        onTeam={onEquipeB}
        onJoueur={onJoueurB}
        onAdd={onAddJoueurB}
        onRemove={onRemoveJoueurB}
        colors={colors}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  teamCard: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  teamTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 10 },
  joueursHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, marginBottom: 8 },
  subtitle: { fontSize: 14, fontWeight: '600' },
  addBtnCompact: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderRadius: 8 },
  addBtnCompactText: { fontSize: 12, fontWeight: '600' },
  joueurRow: { flexDirection: 'row', gap: 8, marginBottom: 8, alignItems: 'center' },
  joueurInput: { flex: 1, borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 14 },
  removeBtn: { padding: 8 },
});
