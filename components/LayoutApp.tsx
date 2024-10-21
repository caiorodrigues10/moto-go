import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useRef } from "react";
import { Alert, Platform, View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MapTeste from "./pages/map";
import { Profile } from "./pages/profile";
import AddressList from "@/app/(root)/address";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { setValueLocal } from "@/providers/setValueLocal";
import { updateFCMTokenUser } from "@/services/users";

const Tab = createBottomTabNavigator();

function MapScreen() {
  return <MapTeste />;
}

function LocationsScreen() {
  return <AddressList />;
}

function ProfileScreen() {
  return <Profile />;
}

export default function App() {
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert("Falha ao obter a permissão de notificação push!");
        return;
      }

      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      Alert.alert(
        "Atenção",
        "Deve usar um dispositivo físico para notificações push!"
      );
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then(async (token) => {
      if (token) {
        setValueLocal({ key: "fcm_token", value: token });
        await updateFCMTokenUser({ fcmToken: token });
      }
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notificação recebida: ", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Resposta para notificação: ", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          const iconName =
            route.name === "Mapa"
              ? "map"
              : route.name === "Endereços"
              ? "map-marker"
              : route.name === "Meu perfil"
              ? "user"
              : "question";

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#FFD700",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "#1C1C1E",
        },
      })}
    >
      <Tab.Screen name="Mapa" component={MapScreen} />
      <Tab.Screen name="Endereços" component={LocationsScreen} />
      <Tab.Screen name="Meu perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
