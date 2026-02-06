import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, useColorScheme } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '@/constants/Colors';

interface Props {
  value: string;
  onChange: (iso: string) => void;
}

export function DateTimePickerField({ value, onChange }: Props) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [show, setShow] = useState(false);
  const date = value ? new Date(value) : new Date();

  const handleChange = (_: unknown, d?: Date) => {
    setShow(Platform.OS === 'ios');
    if (d) onChange(d.toISOString());
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

  return (
    <>
      <Pressable
        style={[styles.trigger, { borderColor: colors.border, backgroundColor: colors.background }]}
        onPress={() => setShow(true)}
      >
        <Text style={[styles.triggerText, { color: value ? colors.text : colors.tabIconDefault }]}>
          {label}
        </Text>
      </Pressable>
      {show && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
        />
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
});
