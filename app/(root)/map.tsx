import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

type Coordinate = {
  latitude: number;
  longitude: number;
};

const destination: Coordinate = {
  latitude: -20.945383605875406,
  longitude: -48.46375931569908,
};

export default function Map() {
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null
  );
  const [route, setRoute] = useState<Coordinate[]>([]);

  const fetchRoute = async (origin: Coordinate) => {
    console.log({ origin });

    try {
      const response = await axios.get(
        `https://router.project-osrm.org/route/v1/driving/${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}?geometries=geojson`
      );
      console.log({ response }, "012030120301203120301203012");

      const coordinates: Coordinate[] =
        response.data.routes[0].geometry.coordinates.map(
          ([longitude, latitude]: [number, number]) => ({ latitude, longitude })
        );
      setRoute(coordinates);
    } catch (error) {
      console.error({ error });
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
            console.log({ newLocation });

            fetchRoute(newLocation);
          }
        }
      );
    })();
  }, [currentLocation]);

  return (
    <View style={styles.container}>
      <MapView
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
          <Marker coordinate={currentLocation} title="Current Location" />
        )}
        <Marker coordinate={destination} title="Destination" />
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
