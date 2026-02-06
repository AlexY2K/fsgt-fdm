import React, { useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SignatureCanvas from 'react-native-signature-canvas';
import Colors from '@/constants/Colors';

interface Props {
  visible: boolean;
  title: string;
  initialDataUrl?: string | null;
  onSave: (dataUrl: string) => void;
  onClose: () => void;
}

export function SignaturePadModal({
  visible,
  title,
  initialDataUrl,
  onSave,
  onClose,
}: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const ref = useRef<React.ComponentRef<typeof SignatureCanvas> | null>(null);

  const handleOK = (signature: string) => {
    onSave(signature);
    onClose();
  };

  const handleEmpty = () => {
    onClose();
  };

  const handleClose = () => {
    ref.current?.readSignature();
  };

  const handleClear = () => {
    ref.current?.clearSignature();
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <FontAwesome name="times" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        <View style={[styles.canvasWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <SignatureCanvas
            ref={ref}
            onOK={handleOK}
            onEmpty={handleEmpty}
            dataURL={initialDataUrl ?? ''}
            descriptionText="Signez du doigt ci-dessous"
            clearText="Effacer"
            confirmText="Enregistrer"
            penColor="#000000"
            backgroundColor="rgba(255,255,255,0)"
            style={styles.canvas}
            webStyle={webStyle}
          />
        </View>

        <View style={[styles.footer, { borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.secondaryBtn, { borderColor: colors.border }]}
            onPress={handleClear}
          >
            <Text style={[styles.secondaryBtnText, { color: colors.text }]}>Effacer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const webStyle = `
  .m-signature-pad { box-shadow: none; border: none; }
  .m-signature-pad--body { border: 1px solid #e0e0e0; border-radius: 8px; }
  .m-signature-pad--footer { margin-top: 8px; }
  body, html { background: transparent; }
`;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: '700' },
  closeBtn: { padding: 8 },
  canvasWrapper: {
    height: 300,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  canvas: { height: 300 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
  },
  secondaryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  secondaryBtnText: { fontSize: 16 },
});
