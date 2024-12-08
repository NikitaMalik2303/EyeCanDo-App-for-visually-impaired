import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { Provider as PaperProvider } from "react-native-paper";
import { ThemeProvider } from "styled-components/native";
import { theme } from "@/constants/theme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import store from "@/store";
import { RootSiblingParent } from "react-native-root-siblings";
import FallDetection from "@/components/constants/FallDetection";

SplashScreen.preventAutoHideAsync();

const persistor = persistStore(store);

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require("@/assets/fonts/Inter/Inter.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootSiblingParent>
          <PaperProvider>
            <ThemeProvider theme={theme}>
              <GestureHandlerRootView style={{ flex: 1 }}>
                <FallDetection />
                <Stack>
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen name="login" options={{ headerShown: false }} />
                  <Stack.Screen
                    name="register"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="volunteer-login"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="volunteer-register"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="volunteer-dashboard"
                    options={{ headerShown: false }}
                  />

                  <Stack.Screen
                    name="directory"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="settings"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen
                    name="(tabs)"
                    options={{ headerShown: false }}
                  />
                  <Stack.Screen name="+not-found" />
                </Stack>
              </GestureHandlerRootView>
            </ThemeProvider>
          </PaperProvider>
        </RootSiblingParent>
      </PersistGate>
    </Provider>
  );
}
