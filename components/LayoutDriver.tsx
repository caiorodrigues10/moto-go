import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { useEffect, useRef, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import AcceptedRacesHistory from "./pages/driver/races/historyRace";
import RacesByDriver from "./pages/driver/races/racesByDriver";
import { Profile } from "./pages/profile";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Alert, Platform } from "react-native";
import { setValueLocal } from "@/providers/setValueLocal";
import { updateFCMTokenDriver } from "@/services/drivers";

const Tab = createBottomTabNavigator();

function MapScreen() {
  return <RacesByDriver />;
}

function LocationsScreen() {
  return <AcceptedRacesHistory />;
}

function ProfileScreen() {
  return <Profile />;
}

export function DriverLayout() {
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
      console.log("Token de Push Notification: ", token);
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
        await updateFCMTokenDriver({ fcmToken: token });
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
            route.name === "Corridas"
              ? "motorcycle"
              : route.name === "Minhas corridas"
              ? "history"
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
      <Tab.Screen name="Corridas" component={MapScreen} />
      <Tab.Screen name="Minhas corridas" component={LocationsScreen} />
      <Tab.Screen name="Meu perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
