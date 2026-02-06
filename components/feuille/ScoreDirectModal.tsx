import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Colors from '@/constants/Colors';
import { ScoreDirectView } from '@/components/feuille/ScoreDirectView';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const TINT = '#1a5f7a';

const SUPPORTED_ORIENTATIONS = [
  'portrait',
  'portrait-upside-down',
  'landscape',
  'landscape-left',
  'landscape-right',
] as const;

export function ScoreDirectModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const isLandscape = width > height;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      supportedOrientations={SUPPORTED_ORIENTATIONS}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.wrapper}>
        {isLandscape ? (
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeFloating, { top: Math.max(insets.top, 8) + 8 }]}
            hitSlop={12}
          >
            <FontAwesome name="times" size={22} color={colors.text} />
          </TouchableOpacity>
        ) : (
          <View
            style={[
              styles.header,
              { backgroundColor: TINT, paddingTop: Math.max(insets.top, 14) + 14 },
            ]}
          >
            <Text style={styles.headerTitle}>Score en direct</Text>
            <TouchableOpacity onPress={onClose} style={styles.headerClose} hitSlop={12}>
              <FontAwesome name="times" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
        <View
          style={[
            styles.content,
            { marginTop: isLandscape ? 0 : insets.top + 58 },
          ]}
        >
          <ScoreDirectView source="match" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  headerClose: { padding: 4 },
  closeFloating: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  content: { flex: 1 },
});
