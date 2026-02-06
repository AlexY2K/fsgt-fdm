import React, { useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useMatch } from '@/context/MatchContext';
import { useMatchSheets } from '@/hooks/useMatchSheets';
import { FeuilleSectionInfo } from '@/components/feuille/FeuilleSectionInfo';
import { FeuilleSectionEquipes } from '@/components/feuille/FeuilleSectionEquipes';
import { FeuilleSectionScores } from '@/components/feuille/FeuilleSectionScores';
import { FeuilleSectionSignatures } from '@/components/feuille/FeuilleSectionSignatures';
import { FeuilleSectionReclamations } from '@/components/feuille/FeuilleSectionReclamations';
import Colors from '@/constants/Colors';

export default function FeuilleEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const {
    match,
    updateInfo,
    updateEquipeA,
    updateEquipeB,
    updateJoueurA,
    updateJoueurB,
    addJoueurA,
    addJoueurB,
    removeJoueurA,
    removeJoueurB,
    updateScores,
    updateReclamations,
    updateSignatures,
    setMatchFromData,
    getMatch,
    resetMatch,
  } = useMatch();

  const { getSheet, saveSheet, deleteSheet, loading } = useMatchSheets();
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const isNew = id === 'nouveau';

  useEffect(() => {
    if (isNew) {
      resetMatch();
    } else {
      const sheet = getSheet(id ?? '');
      if (sheet?.data) {
        setMatchFromData(sheet.data, sheet.id);
      }
    }
  }, [id, isNew, getSheet, setMatchFromData, resetMatch]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const data = getMatch();
      const sheet = await saveSheet(isNew ? null : id ?? null, data);
      if (isNew) {
        router.replace(`/(tabs)/(feuilles)/feuille/${sheet.id}`);
      }
    } catch (e) {
      console.error('Save failed:', e);
      Alert.alert('Erreur', 'Impossible de sauvegarder la feuille.');
    } finally {
      setSaving(false);
    }
  }, [id, isNew, getMatch, saveSheet]);

  const handleDelete = useCallback(() => {
    const sheet = getSheet(id ?? '');
    const title =
      sheet?.data.equipeA.nom || sheet?.data.equipeB.nom
        ? `${sheet?.data.equipeA.nom || 'Équipe A'} vs ${sheet?.data.equipeB.nom || 'Équipe B'}`
        : 'cette feuille';
    Alert.alert('Supprimer', `Supprimer la feuille « ${title} » ?`, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);
          try {
            await deleteSheet(id ?? '');
            router.back();
          } catch (e) {
            console.error('Delete failed:', e);
            Alert.alert('Erreur', 'Impossible de supprimer la feuille.');
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  }, [id, getSheet, deleteSheet]);

  if (loading && !isNew) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FeuilleSectionInfo info={match.info} onInfo={updateInfo} />
        <FeuilleSectionEquipes
          equipeA={match.equipeA}
          equipeB={match.equipeB}
          onEquipeA={updateEquipeA}
          onEquipeB={updateEquipeB}
          onJoueurA={updateJoueurA}
          onJoueurB={updateJoueurB}
          onAddJoueurA={addJoueurA}
          onAddJoueurB={addJoueurB}
          onRemoveJoueurA={removeJoueurA}
          onRemoveJoueurB={removeJoueurB}
        />
        <FeuilleSectionScores scores={match.scores} onScores={updateScores} />
        <FeuilleSectionSignatures
          signatures={match.signatures}
          onSignatures={updateSignatures}
          autoArbitrage={match.info.autoArbitrage}
        />
        <FeuilleSectionReclamations value={match.reclamations} onChange={updateReclamations} />
        <View style={styles.spacer} />
        <View style={[styles.footer, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.saveBtn, { backgroundColor: colors.tint }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <FontAwesome name="save" size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Enregistrer</Text>
              </>
            )}
          </TouchableOpacity>
          {!isNew && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <>
                  <FontAwesome name="trash-o" size={18} color="#fff" />
                  <Text style={styles.deleteBtnText}>Supprimer la feuille</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: Platform.OS === 'ios' ? 50 : 24 },
  spacer: { height: 20 },
  footer: {
    padding: 16,
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 12,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#dc2626',
    marginTop: 12,
  },
  deleteBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
