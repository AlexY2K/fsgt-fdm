import React from 'react';
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
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useFeuilleEdit, KEYBOARD_VERTICAL_OFFSET_IOS } from '@/hooks/useFeuilleEdit';
import { SCROLL_PADDING_BOTTOM } from '@/constants/Layout';
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
  } = useFeuilleEdit(id);

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
      keyboardVerticalOffset={Platform.OS === 'ios' ? KEYBOARD_VERTICAL_OFFSET_IOS : 0}
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
  scrollContent: { padding: 16, paddingBottom: SCROLL_PADDING_BOTTOM },
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
