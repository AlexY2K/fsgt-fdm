import { useCallback } from 'react';
import { Alert } from 'react-native';
import { log } from '@/lib/logger';

/**
 * Retourne une fonction qui affiche une alerte de confirmation avant suppression.
 * Gère l'await et les erreurs.
 */
export function useConfirmDelete(deleteSheet: (id: string) => Promise<void>) {
  return useCallback(
    (id: string, title: string) => {
      Alert.alert('Supprimer', `Supprimer la feuille « ${title} » ?`, [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteSheet(id);
            } catch (e) {
              log.error('Delete failed', e);
              Alert.alert('Erreur', 'Impossible de supprimer la feuille.');
            }
          },
        },
      ]);
    },
    [deleteSheet]
  );
}
