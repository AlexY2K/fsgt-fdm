import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useWindowDimensions } from 'react-native';
import { Tabs } from 'expo-router';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
        headerShown: useClientOnlyValue(false, true),
        headerStyle: { backgroundColor: Colors[colorScheme ?? 'light'].tint },
        headerTintColor: '#fff',
        tabBarStyle: { backgroundColor: Colors[colorScheme ?? 'light'].card },
      }}
    >
      <Tabs.Screen
        name="(feuilles)"
        options={{
          title: 'Feuilles de match',
          tabBarIcon: ({ color }) => <TabBarIcon name="file-text-o" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="score-direct"
        options={{
          title: 'Score en direct',
          tabBarIcon: ({ color }) => <TabBarIcon name="trophy" color={color} />,
          headerTitle: 'Score en direct',
          headerShown: !isLandscape,
        }}
      />
    </Tabs>
  );
}
