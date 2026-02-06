import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  CHAMPIONNATS_4X4_MIXTE,
  CHAMPIONNATS_6X6_MIXTE,
  CHAMPIONNATS_VB_FEMININ,
} from '@/constants/Championnats';
import Colors from '@/constants/Colors';

const SUPPORTED_ORIENTATIONS: Array<'portrait' | 'portrait-upside-down' | 'landscape' | 'landscape-left' | 'landscape-right'> = [
  'portrait',
  'portrait-upside-down',
  'landscape',
  'landscape-left',
  'landscape-right',
];

const SECTIONS = [
  { title: 'Volley 4x4 mixte', data: CHAMPIONNATS_4X4_MIXTE },
  { title: 'Volley 6x6 mixte', data: CHAMPIONNATS_6X6_MIXTE },
  { title: 'VB féminin', data: CHAMPIONNATS_VB_FEMININ },
] as const;

interface Props {
  value: string;
  onChange: (v: string) => void;
}

export function ChampionnatSelect({ value, onChange }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable
        style={[styles.trigger, { borderColor: colors.border, backgroundColor: colors.background }]}
        onPress={() => setVisible(true)}
      >
        <Text style={[styles.triggerText, { color: value ? colors.text : colors.tabIconDefault }]}>
          {value || 'Sélectionner un championnat'}
        </Text>
      </Pressable>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        supportedOrientations={SUPPORTED_ORIENTATIONS}
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setVisible(false)} />
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Championnat</Text>
            </View>
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator
              keyboardShouldPersistTaps="handled"
            >
              {SECTIONS.map(({ title, data }) => (
                <View key={title} style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.tint }]}>{title}</Text>
                  {data.map((c) => (
                    <Pressable
                      key={c}
                      style={[styles.option, { borderColor: colors.border }]}
                      onPress={() => {
                        onChange(c);
                        setVisible(false);
                      }}
                    >
                      <Text style={[styles.optionText, { color: colors.text }]}>{c}</Text>
                    </Pressable>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  triggerText: { fontSize: 16 },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    borderRadius: 12,
    padding: 16,
    maxHeight: '80%',
    width: '100%',
  },
  modalHeader: { borderBottomWidth: 1, paddingBottom: 12, marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: '600' },
  scrollView: { maxHeight: 360 },
  scrollContent: { paddingBottom: 16 },
  section: { marginBottom: 16 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  option: { padding: 14, borderBottomWidth: 1 },
  optionText: { fontSize: 16 },
});
