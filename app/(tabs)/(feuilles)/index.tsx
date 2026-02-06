import React from 'react';
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { useMatchSheets } from '@/hooks/useMatchSheets';
import Colors from '@/constants/Colors';
import type { MatchSheet } from '@/types/match';

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function getMatchTitle(sheet: MatchSheet) {
  const a = sheet.data.equipeA.nom || 'Équipe A';
  const b = sheet.data.equipeB.nom || 'Équipe B';
  if (a || b) return `${a} vs ${b}`;
  return `Match du ${formatDate(sheet.createdAt)}`;
}

export default function FeuillesListScreen() {
  const { sheets, loading, loadSheets, deleteSheet } = useMatchSheets();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [refreshing, setRefreshing] = React.useState(false);

  const handleNew = () => {
    router.push('/(tabs)/(feuilles)/feuille/nouveau');
  };

  const handleOpen = (id: string) => {
    router.push(`/(tabs)/(feuilles)/feuille/${id}`);
  };

  const handleDelete = (id: string, title: string) => {
    Alert.alert('Supprimer', `Supprimer la feuille « ${title} » ?`, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: () => deleteSheet(id) },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSheets();
    setRefreshing(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadSheets();
    }, [loadSheets])
  );

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.tint} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.tint }]}
        onPress={handleNew}
        activeOpacity={0.8}
      >
        <FontAwesome name="plus" size={24} color="#fff" />
        <Text style={styles.fabText}>Nouvelle feuille</Text>
      </TouchableOpacity>

      {sheets.length === 0 ? (
        <View style={styles.empty}>
          <FontAwesome name="file-text-o" size={64} color={colors.tabIconDefault} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Aucune feuille de match
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.tabIconDefault }]}>
            Appuyez sur « Nouvelle feuille » pour créer votre première feuille
          </Text>
        </View>
      ) : (
        <FlatList
          data={sheets}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          contentInsetAdjustmentBehavior="automatic"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.tint]} />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => handleOpen(item.id)}
              onLongPress={() => handleDelete(item.id, getMatchTitle(item))}
              activeOpacity={0.7}
            >
              <Text style={[styles.cardTitle, { color: colors.text }]}>
                {getMatchTitle(item)}
              </Text>
              <Text style={[styles.cardDate, { color: colors.tabIconDefault }]}>
                {formatDate(item.updatedAt)}
              </Text>
              {(item.data.info.championnat || item.data.info.salle) ? (
                <Text style={[styles.cardMeta, { color: colors.tabIconDefault }]}>
                  {[item.data.info.championnat, item.data.info.salle].filter(Boolean).join(' • ')}
                </Text>
              ) : null}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  fabText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDate: {
    fontSize: 13,
    marginBottom: 2,
  },
  cardMeta: {
    fontSize: 12,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});
