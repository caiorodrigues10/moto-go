import { SelectPoints } from "@/components/SelectPoints";
import { useAppContext } from "@/context/AppContext";
import { useApi } from "@/providers/useApi";
import { Coordinate } from "@/services/Coordinate";
import {
  IListServiceOrders,
  IResponseListServiceOrderByUser,
} from "@/services/serviceOrder/types";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { ConfirmService } from "./confirmService";
import { SelectDriver } from "./selectDriver";
import SelectTypeService from "./selectTypeService";
import { ServiceOrderActive } from "./serviceOrderActive";
import { Observations } from "./observations";

const locationIcon = require("../../../assets/images/location-icon.png");
const flagRacing = require("../../../assets/images/racing-flag.png");

export function Map() {
  const [raceActive, setRaceActive] = useState({} as IListServiceOrders);
  const mapRef = useRef<MapView | null>(null);

  const {
    focusSearch,
    destination,
    initial,
    route,
    isOpenSelectDriver,
    currentLocation,
    setCurrentLocation,
    clearService,
    isOpenObservations,
  } = useAppContext();

  const { data, mutate } = useApi<IResponseListServiceOrderByUser>(
    "/serviceOrders/byUser"
  );

  const fetchServiceOrderActive = useCallback(async () => {
    if (raceActive && !data?.data) {
      clearService();
      setRaceActive({} as IListServiceOrders);
      return;
    }

    if (data) {
      if (data?.data) {
        setRaceActive(data.data);
      } else {
        setRaceActive({} as IListServiceOrders);
      }
    }
  }, [data, clearService]);

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

  useEffect(() => {
    fetchServiceOrderActive();
  }, [data]);

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
        {route.length > 0 && (
          <Polyline coordinates={route} strokeColor="hotpink" strokeWidth={3} />
        )}
      </MapView>
      {(!raceActive?.id || !raceActive?.active) && (
        <SelectTypeService currentLocation={currentLocation} />
      )}
      {focusSearch && <SelectPoints />}
      <ConfirmService
        currentLocation={currentLocation}
        fetchServiceOrderActive={mutate}
      />
      {isOpenSelectDriver && <SelectDriver />}
      {raceActive?.id && (
        <ServiceOrderActive
          raceActive={raceActive}
          fetchServiceOrderActive={mutate}
        />
      )}
      {isOpenObservations && <Observations />}
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
