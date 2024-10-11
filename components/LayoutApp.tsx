import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import MapTeste from "./pages/map";
import { Profile } from "./pages/profile";
import AddressList from "@/app/(root)/address";

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
