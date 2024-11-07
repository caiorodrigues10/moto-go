import { useAppDriverContext } from "@/context/AppDriverContext";
import { Coordinate } from "@/services/Coordinate";
import axios from "axios";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useToast } from "react-native-toast-notifications";
import { AcceptRace } from "./acceptRace";

const motoIcon = require("../../../../../assets/images/moto-icon.png");
const flagRacing = require("../../../../../assets/images/racing-flag.png");

export function ConfirmRace() {
  const {
    destination,
    route,
    setRoute,
    setIsInvalidRace,
    currentLocation,
    setCurrentLocation,
  } = useAppDriverContext();
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef<MapView | null>(null);
  const toast = useToast();

  const searchRoute = useCallback(async () => {
    setIsLoading(true);
    if (currentLocation) {
      try {
        const response = await axios.get(
          `https://router.project-osrm.org/route/v1/driving/${currentLocation.longitude},${currentLocation.latitude};${destination.longitude},${destination.latitude}?geometries=geojson`
        );
        const coordinates: Coordinate[] =
          response.data.routes[0].geometry.coordinates.map(
            ([longitude, latitude]: [number, number]) => ({
              latitude,
              longitude,
            })
          );
        setRoute(coordinates);
        if (mapRef.current) {
          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }
      } catch (error) {
        toast.show(
          "Não foi possível traçar a rota! Verifique os endereços ou tente novamente mais tarde",
          {
            type: "danger",
            placement: "top",
          }
        );
        setIsInvalidRace(true);
      }
    }
    setIsLoading(false);
  }, [currentLocation, destination]);

  useFocusEffect(
    useCallback(() => {
      const fetchRoute = async () => {
        await searchRoute();
      };

      fetchRoute();
    }, [searchRoute])
  );

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
          currentLocation
            ? {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }
            : undefined
        }
      >
        {(currentLocation || currentLocation) && (
          <Marker
            coordinate={currentLocation || ({} as Coordinate)}
            title={currentLocation ? "Ponto inicial" : "Minha localização"}
          >
            <Image source={motoIcon} style={{ width: 40, height: 40 }} />
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
      <AcceptRace currentLocation={currentLocation} isLoading={isLoading} />
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
});
