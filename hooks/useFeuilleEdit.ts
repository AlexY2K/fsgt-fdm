import { useEffect, useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { useMatch } from '@/context/MatchContext';
import { useMatchSheets } from '@/hooks/useMatchSheets';
import { log } from '@/lib/logger';
import type { MatchData } from '@/types/match';

/** Offset du clavier pour KeyboardAvoidingView (iOS) */
export const KEYBOARD_VERTICAL_OFFSET_IOS = 90;

export function useFeuilleEdit(id: string | undefined) {
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
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
      log.error('Save failed', e);
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
            log.error('Delete failed', e);
            Alert.alert('Erreur', 'Impossible de supprimer la feuille.');
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  }, [id, getSheet, deleteSheet]);

  return {
    match,
    loading,
    isNew,
    saving,
    deleting,
    handleSave,
    handleDelete,
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
  };
}
