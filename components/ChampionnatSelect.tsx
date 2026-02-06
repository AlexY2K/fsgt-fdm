import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { CHAMPIONNATS } from '@/constants/Championnats';
import Colors from '@/constants/Colors';

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
      <Modal visible={visible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHeader, { borderColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Championnat</Text>
            </View>
            {CHAMPIONNATS.map((c) => (
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
        </Pressable>
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
  modalContent: { borderRadius: 12, padding: 16 },
  modalHeader: { borderBottomWidth: 1, paddingBottom: 12, marginBottom: 12 },
  modalTitle: { fontSize: 18, fontWeight: '600' },
  option: { padding: 14, borderBottomWidth: 1 },
  optionText: { fontSize: 16 },
});
