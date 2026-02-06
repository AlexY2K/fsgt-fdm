import FontAwesome from '@expo/vector-icons/FontAwesome';
import { router, Stack } from 'expo-router';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

const headerRightStyles = StyleSheet.create({
  wrapper: {
    width: 36,
    minWidth: 36,
    maxWidth: 36,
    flexShrink: 0,
    flexGrow: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function FeuillesLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1a5f7a' },
        headerTintColor: '#fff',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Feuilles de match',
          headerLargeTitle: false,
          headerTitleStyle: { fontSize: 18 },
          headerTransparent: Platform.OS === 'ios',
          headerBlurEffect: Platform.OS === 'ios' ? 'regular' : undefined,
          headerRight: () => (
            <View style={headerRightStyles.wrapper}>
              <Pressable
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                style={({ pressed }) => [
                  headerRightStyles.button,
                  { opacity: pressed ? 0.6 : 1 },
                ]}
                onPress={() => router.push('/(tabs)/(feuilles)/feuille/nouveau')}
              >
                <FontAwesome name="plus" size={18} color="#fff" />
              </Pressable>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="feuille/[id]"
        options={{
          title: 'Feuille de match',
          headerBackTitle: 'Retour',
        }}
      />
    </Stack>
  );
}
