import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import RacesByDriver from "./pages/driver/races/racesByDriver";
import { Profile } from "./pages/profile";
import AcceptedRacesHistory from "./pages/driver/races/historyRace";

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
