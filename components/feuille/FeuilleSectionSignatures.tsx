import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  Image,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { SignaturePadModal } from '@/components/feuille/SignaturePadModal';
import type { Signatures } from '@/types/match';

interface Props {
  signatures: Signatures;
  onSignatures: (s: Partial<Signatures>) => void;
  autoArbitrage?: boolean;
}

type SignatureKey = keyof Signatures;

const LABELS: Record<SignatureKey, string> = {
  capitaineA: 'Capitaine équipe A',
  capitaineB: 'Capitaine équipe B',
  arbitre: 'Arbitre',
};

export function FeuilleSectionSignatures({ signatures, onSignatures, autoArbitrage }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [activeModal, setActiveModal] = useState<SignatureKey | null>(null);

  const sigs = signatures ?? { capitaineA: null, capitaineB: null, arbitre: null };
  const keys = (Object.keys(LABELS) as SignatureKey[]).filter(
    (k) => !(autoArbitrage && k === 'arbitre')
  );

  const signatureItems = keys.map((key) => {
    const value = sigs[key];
    const hasSignature = !!value && typeof value === 'string' && value.startsWith('data:image');

    return (
      <View key={key}>
            <Text style={[styles.label, { color: colors.text }]}>{LABELS[key]}</Text>
            <TouchableOpacity
              style={[
                styles.signatureBtn,
                { backgroundColor: colors.background, borderColor: colors.border },
              ]}
              onPress={() => setActiveModal(key)}
            >
              {hasSignature ? (
                <Image
                  source={{ uri: value }}
                  style={styles.signaturePreview}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.placeholder}>
                  <FontAwesome name="pencil" size={24} color={colors.tabIconDefault} />
                  <Text style={[styles.placeholderText, { color: colors.tabIconDefault, marginTop: 8 }]}>
                    Signer du doigt
                  </Text>
                </View>
              )}
            </TouchableOpacity>
      </View>
    );
  });

  return (
    <>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.tint }]}>Signatures</Text>
        <View>{signatureItems}</View>
      </View>
      {activeModal ? (
        <SignaturePadModal
          visible
          title={LABELS[activeModal]}
          initialDataUrl={sigs[activeModal]}
          onSave={(dataUrl) => {
            onSignatures({ [activeModal]: dataUrl });
            setActiveModal(null);
          }}
          onClose={() => setActiveModal(null)}
        />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, marginTop: 10 },
  signatureBtn: {
    borderWidth: 1,
    borderRadius: 8,
    minHeight: 80,
    overflow: 'hidden',
  },
  signaturePreview: {
    width: '100%',
    height: 80,
  },
  placeholder: {
    flex: 1,
    minHeight: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: { fontSize: 14 },
});
