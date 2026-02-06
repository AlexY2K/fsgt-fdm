import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  Modal,
  View,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '@/constants/Colors';

const SUPPORTED_ORIENTATIONS: Array<'portrait' | 'portrait-upside-down' | 'landscape' | 'landscape-left' | 'landscape-right'> = [
  'portrait',
  'portrait-upside-down',
  'landscape',
  'landscape-left',
  'landscape-right',
];

interface Props {
  value: string;
  onChange: (iso: string) => void;
}

export function DateTimePickerField({ value, onChange }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(() => (value ? new Date(value) : new Date()));

  const openPicker = () => {
    setTempDate(value ? new Date(value) : new Date());
    setShow(true);
  };

  const handleChange = (_: unknown, d?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (d) onChange(d.toISOString());
    } else if (d) {
      setTempDate(d);
    }
  };

  const handleClose = () => {
    onChange(tempDate.toISOString());
    setShow(false);
  };

  const label = value
    ? new Date(value).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Date et heure';

  if (Platform.OS === 'android') {
    return (
      <>
        <Pressable
          style={[styles.trigger, { borderColor: colors.border, backgroundColor: colors.background }]}
          onPress={openPicker}
        >
          <Text style={[styles.triggerText, { color: value ? colors.text : colors.tabIconDefault }]}>
            {label}
          </Text>
        </Pressable>
          {show && (
          <DateTimePicker
            value={tempDate}
            mode="datetime"
            display="default"
            onChange={handleChange}
          />
        )}
      </>
    );
  }

  return (
    <>
      <Pressable
        style={[styles.trigger, { borderColor: colors.border, backgroundColor: colors.background }]}
        onPress={openPicker}
      >
        <Text style={[styles.triggerText, { color: value ? colors.text : colors.tabIconDefault }]}>
          {label}
        </Text>
      </Pressable>
      {show && (
        <Modal
          visible
          transparent
          animationType="slide"
          supportedOrientations={SUPPORTED_ORIENTATIONS}
          onRequestClose={handleClose}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity
              style={StyleSheet.absoluteFill}
              activeOpacity={1}
              onPress={handleClose}
            />
            <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
              <View style={[styles.modalHeader, { borderColor: colors.border }]}>
                <TouchableOpacity onPress={handleClose}>
                  <Text style={[styles.modalDone, { color: colors.tint }]}>OK</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="datetime"
                display="spinner"
                onChange={handleChange}
                style={styles.picker}
              />
            </View>
          </View>
        </Modal>
      )}
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'relative',
  },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 34,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
  },
  modalDone: { fontSize: 17, fontWeight: '600' },
  picker: { height: 200 },
});
