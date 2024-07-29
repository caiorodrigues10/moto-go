import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, View, Image } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

// Importa os ícones
const locationIcon = require("../../assets/images/location-icon.png");
const motoIcon = require("../../assets/images/moto-icon.png");
const flagRacing = require("../../assets/images/racing-flag.png");

type Coordinate = {
  latitude: number;
  longitude: number;
};

const destination: Coordinate = {
  latitude: -20.945383605875406,
  longitude: -48.46375931569908,
};

export default function Teste() {
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null
  );
  const [route, setRoute] = useState<Coordinate[]>([]);
  const [motoLocation, setMotoLocation] = useState<Coordinate | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const routeIndex = useRef(0);

  const fetchRoute = async (origin: Coordinate) => {
    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?geometries=geojson`
      );

      const coordinates: Coordinate[] =
        response.data.routes[0].geometry.coordinates.map(
          ([longitude, latitude]: [number, number]) => ({ latitude, longitude })
        );
      setRoute(coordinates);
    } catch (error) {
      console.error(error);
    }
  };

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
          timeInterval: 0,
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
            fetchRoute(newLocation);

            // Inicia a localização da moto
            if (!motoLocation) {
              setMotoLocation(newLocation);
            }
          }
        }
      );
    })();
  }, [currentLocation]);

  useEffect(() => {
    if (route.length > 0 && motoLocation) {
      moveMotoAlongRoute();
    }
  }, [route, motoLocation]);

  const moveMotoAlongRoute = () => {
    if (!motoLocation || route.length === 0) return;

    const interval = setInterval(() => {
      if (routeIndex.current < route.length) {
        const nextLocation = route[routeIndex.current];
        setMotoLocation(nextLocation);
        mapRef.current?.animateToRegion(
          {
            ...nextLocation,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
        routeIndex.current++;
      } else {
        clearInterval(interval);
      }
    }, 1000); // Atualiza a cada 1 segundo (1000 ms)
  };

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
        {currentLocation && (
          <Marker coordinate={currentLocation} title="Current Location">
            <Image source={locationIcon} style={{ width: 30, height: 30 }} />
          </Marker>
        )}
        <Marker coordinate={destination} title="Destination">
          <Image source={flagRacing} style={{ width: 30, height: 30 }} />
        </Marker>
        {motoLocation && (
          <Marker coordinate={motoLocation}>
            <Image
              source={motoIcon}
              style={{
                width: 30,
                height: 30,
              }}
            />
          </Marker>
        )}
        {route.length > 0 && (
          <Polyline coordinates={route} strokeColor="hotpink" strokeWidth={3} />
        )}
      </MapView>
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
