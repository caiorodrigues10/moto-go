import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Image } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import { TextInputCustom } from "@/components/TextInputCustom";
import { GilroyText } from "@/components/GilroyText";
import { Button, TextInput } from "react-native-paper";
import { SelectPoints } from "@/components/SelectPoints";
import { useAppContext } from "@/context/AppContext";
import { Coordinate } from "@/services/Coordinate";
import ConfirmService from "./ConfirmService";

const locationIcon = require("../../../assets/images/location-icon.png");
// const motoIcon = require("../../../assets/images/moto-icon.png");
const flagRacing = require("../../../assets/images/racing-flag.png");

export default function MapTeste() {
  const {
    setFocusSearch,
    focusSearch,
    destination,
    initial,
    setInitial,
    route,
  } = useAppContext();
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null
  );
  // const [motoLocation, setMotoLocation] = useState<Coordinate | null>(null);
  const mapRef = useRef<MapView | null>(null);
  // const routeIndex = useRef(0);
  // const intervalId = useRef<number | NodeJS.Timeout | null>(null);

  // useEffect(() => {
  //   if (route.length > 0 && motoLocation) {
  //     moveMotoAlongRoute();
  //   }
  // }, [route, motoLocation]);

  // const moveMotoAlongRoute = () => {
  //   if (!motoLocation || route.length === 0) return;

  //   if (intervalId.current) {
  //     clearInterval(intervalId.current as NodeJS.Timeout);
  //   }

  //   intervalId.current = setInterval(() => {
  //     if (routeIndex.current < route.length) {
  //       const nextLocation = route[routeIndex.current];
  //       setMotoLocation(nextLocation);
  //       mapRef.current?.animateToRegion(
  //         {
  //           ...nextLocation,
  //           latitudeDelta: 0.01,
  //           longitudeDelta: 0.01,
  //         },
  //         1000
  //       );
  //       routeIndex.current++;
  //     } else {
  //       if (intervalId.current) {
  //         clearInterval(intervalId.current as NodeJS.Timeout);
  //       }
  //     }
  //   }, 2000);
  // };

  // useEffect(() => {
  //   return () => {
  //     if (intervalId.current) {
  //       clearInterval(intervalId.current as NodeJS.Timeout);
  //     }
  //   };
  // }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          const { latitude, longitude } = location.coords;
          const newLocation = { latitude, longitude };

          if (
            !currentLocation ||
            Math.abs(currentLocation.latitude - newLocation.latitude) >
              0.0001 ||
            Math.abs(currentLocation.longitude - newLocation.longitude) > 0.0001
          ) {
            setCurrentLocation(newLocation);
          }
        }
      );
    })();
  }, [currentLocation]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: destination.latitude,
          longitude: destination.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        region={
          initial
            ? {
                latitude: initial.latitude,
                longitude: initial.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : currentLocation
            ? {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : undefined
        }
      >
        {(initial || currentLocation) && (
          <Marker
            coordinate={initial || currentLocation || ({} as Coordinate)}
            title={initial ? "Ponto inicial" : "Minha localização"}
          >
            <Image source={locationIcon} style={{ width: 30, height: 30 }} />
          </Marker>
        )}
        <Marker coordinate={destination} title="Destino">
          <Image source={flagRacing} style={{ width: 30, height: 30 }} />
        </Marker>
        {/* {motoLocation && (
          <Marker coordinate={motoLocation}>
            <Image
              source={motoIcon}
              style={{
                width: 30,
                height: 30,
              }}
            />
          </Marker>
        )} */}
        {route.length > 0 && (
          <Polyline coordinates={route} strokeColor="hotpink" strokeWidth={3} />
        )}
      </MapView>
      <View style={styles.dialogContainer}>
        <View style={styles.dialog}>
          <GilroyText style={styles.label}>Escolha um serviço</GilroyText>
          <View style={styles.contentButtons}>
            <Button
              mode="contained-tonal"
              buttonColor="#FFE924"
              onPress={() => setFocusSearch(true)}
              style={{ width: "48%" }}
            >
              <GilroyText style={{ color: "#000" }}>Entrega</GilroyText>
            </Button>
            <Button
              mode="contained-tonal"
              buttonColor="#FFE924"
              onPress={() => setFocusSearch(true)}
              style={{ width: "50%" }}
            >
              <GilroyText style={{ color: "#000" }}>Transporte</GilroyText>
            </Button>
          </View>
        </View>
      </View>
      {focusSearch && <SelectPoints />}
      <ConfirmService />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  dialogContainer: {
    position: "absolute",
    bottom: 8,
    left: 20,
    right: 20,
    marginBottom: 12,
  },
  dialog: {
    backgroundColor: "#1C1C1E",
    padding: 12,
    paddingBottom: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
  label: {
    color: "#FFF",
    marginBottom: 5,
  },
  contentButtons: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    paddingVertical: 4,
  },
});
