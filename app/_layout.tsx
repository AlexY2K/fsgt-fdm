import 'react-native-get-random-values';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { MatchProvider } from '@/context/MatchContext';
import { useColorScheme } from '@/components/useColorScheme';

const SPLASH_BG = '#1a5f7a';
const SPLASH_MIN_MS = 2000;
const FADE_DURATION = 400;

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [splashVisible, setSplashVisible] = useState(true);
  const opacity = useSharedValue(0);

  const [fontsLoaded, fontsError] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  const hideSplash = useCallback(() => setSplashVisible(false), []);

  useEffect(() => {
    if (fontsError) throw fontsError;
  }, [fontsError]);

  // Masquer le splash natif dès le montage pour afficher notre splash FSGT
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  // FadeIn au montage
  useEffect(() => {
    opacity.value = withTiming(1, { duration: FADE_DURATION });
  }, [opacity]);

  // Timer puis FadeOut
  useEffect(() => {
    if (!fontsLoaded) return;
    const timer = setTimeout(() => {
      setAppReady(true);
      opacity.value = withTiming(0, { duration: FADE_DURATION }, () => {
        runOnJS(hideSplash)();
      });
    }, SPLASH_MIN_MS);
    return () => clearTimeout(timer);
  }, [fontsLoaded, opacity, hideSplash]);

  const splashAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!splashVisible && appReady) {
    return <RootLayoutNav />;
  }

  return (
    <View style={styles.container}>
      {appReady && <RootLayoutNav />}
      {splashVisible && (
        <Animated.View
          style={[styles.splash, { backgroundColor: SPLASH_BG }, splashAnimatedStyle]}
          pointerEvents={appReady ? 'none' : 'auto'}
        >
          <Image
            source={require('../assets/images/fsgt-logo.png')}
            style={styles.splashLogo}
            resizeMode="contain"
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  splash: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashLogo: {
    width: 140,
    height: 140,
  },
});

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <MatchProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
      </ThemeProvider>
    </MatchProvider>
  );
}
