import { AppProvider } from "@/context/AppContext";
import { getValueLocal } from "@/providers/getValueLocal";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, router } from "expo-router";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { ClickOutsideProvider } from "react-native-click-outside";
import { PaperProvider } from "react-native-paper";
import { ToastProvider } from "react-native-toast-notifications";
export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Gilroy: require("../assets/fonts/Gilroy-Regular.ttf"),
    ...FontAwesome.font,
    GilroyBold: require("../assets/fonts/Gilroy-Bold.ttf"),
    ...FontAwesome.font,
    GilroyLight: require("../assets/fonts/Gilroy-Light.ttf"),
    ...FontAwesome.font,
    GilroyMedium: require("../assets/fonts/Gilroy-Medium.ttf"),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  async function checkTokenAndRedirect() {
    try {
      const token = await getValueLocal("token");

      if (token) {
        // router.replace("/(root)/teste");
        router.replace("/(rootDriver)/races");
      } else {
        router.replace("/(welcome)");
      }
    } catch (error) {
      console.error("Erro ao recuperar o token:", error);
    }
  }

  useEffect(() => {
    checkTokenAndRedirect();
  }, []);

  return (
    <ToastProvider>
      <AppProvider>
        <PaperProvider>
          <ClickOutsideProvider>
            <ThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <Stack
                initialRouteName="(auth)/login"
                screenOptions={{
                  headerTintColor: "white",
                  headerTitle: "",
                  headerStyle: {
                    backgroundColor: "#1C2129",
                  },
                  headerBackTitle: "Voltar",
                }}
              >
                <Stack.Screen name="(auth)/login" />
                <Stack.Screen name="(auth)/signIn" />
                <Stack.Screen
                  name="(welcome)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="(auth)/auth"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="(root)/activeLocale"
                />
                <Stack.Screen
                  name="(root)/map"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="(root)/teste"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="(rootDriver)/races"
                  options={{ headerShown: false }}
                />
              </Stack>
            </ThemeProvider>
          </ClickOutsideProvider>
        </PaperProvider>
      </AppProvider>
    </ToastProvider>
  );
}
