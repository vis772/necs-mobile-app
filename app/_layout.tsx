import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform } from "react-native";
import { AppProvider } from "@/contexts/AppContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync();
}

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="game-stats" options={{ headerShown: false }} />
      <Stack.Screen name="game-preview" options={{ headerShown: false }} />
      <Stack.Screen name="live-video" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="replay-video" options={{ headerShown: false, presentation: 'modal' }} />
      <Stack.Screen name="leaderboard" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log('[RootLayout] Initializing app...');
    const init = async () => {
      try {
        if (Platform.OS === 'web') {
          console.log('[RootLayout] Web platform detected, skipping splash screen');
          setIsReady(true);
        } else {
          await new Promise(resolve => setTimeout(resolve, 100));
          console.log('[RootLayout] Ready to show app');
          setIsReady(true);
          await SplashScreen.hideAsync();
          console.log('[RootLayout] Splash screen hidden');
        }
      } catch (error) {
        console.error('[RootLayout] Initialization error:', error);
        setIsReady(true);
      }
    };
    
    init();
  }, []);

  console.log('[RootLayout] Rendering, isReady:', isReady);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AppProvider>
            <RootLayoutNav />
          </AppProvider>
        </GestureHandlerRootView>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
