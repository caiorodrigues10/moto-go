import { useAppContext } from "@/context/AppContext";
import { cepMask } from "@/providers/maskProviders";
import { Coordinate } from "@/services/Coordinate";
import { getUserAddress } from "@/services/users";
import axios from "axios";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useToast } from "react-native-toast-notifications";
import { GilroyText } from "./GilroyText";
import { TextInputCustom } from "./TextInputCustom";
import { View } from "./Themed";

interface IAddressComplete {
  formatted_address: string;
  nameShow: string;
  lat: string;
  lon: string;
  place_id: string;
}

export function SelectPoints() {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionsInitial, setSuggestionsInitial] = useState<
    IAddressComplete[]
  >([]);
  const [suggestionsFinal, setSuggestionsFinal] = useState<IAddressComplete[]>(
    []
  );
  const [isFocusInitial, setIsFocusInitial] = useState(false);
  const [isFocusFinal, setIsFocusFinal] = useState(false);
  const toast = useToast();
  const [currentAddress, setCurrentAddress] = useState<IAddressComplete | null>(
    null
  );
  const [address, setAddress] = useState([] as IAddressComplete[]);

  const {
    setRoute,
    setFocusSearch,
    destination,
    initial,
    setDestination,
    setInitial,
    queryFinal,
    queryInitial,
    setQueryFinal,
    setQueryInitial,
    setVisibleModalConfirmService,
    currentLocation,
    setCurrentLocation,
  } = useAppContext();

  const fetchCurrentAddress = async (coordinate: Coordinate) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinate.latitude},${coordinate.longitude}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`
      );
      const address = response.data.results[0]?.formatted_address;
      if (address) {
        setCurrentAddress({
          formatted_address: address,
          lat: coordinate.latitude.toString(),
          lon: coordinate.longitude.toString(),
          place_id: response?.data?.results[0]?.place_id || "",
          nameShow: "Localização atual",
        });
      } else {
        console.error("Nenhum endereço encontrado para essas coordenadas.");
      }
    } catch (error) {
      console.error("Erro ao buscar endereço da localização atual", error);
    }
  };

  const fetchSuggestions = async (
    input: string,
    setValue: (val: IAddressComplete[]) => void
  ): Promise<void> => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${input}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}&language=pt-BR&components=country:BR`
      );

      if (response.data.results && response.data.results.length > 0) {
        const suggestions = response.data.results
          .filter((e: any) => e.formatted_address !== "Brasil")
          .map((result: any) => ({
            formatted_address: result.formatted_address,
            lat: result.geometry.location.lat,
            lon: result.geometry.location.lng,
            place_id: result.place_id,
            nameShow: result.formatted_address,
          }));

        setValue(suggestions);
      } else {
        setValue([]);
      }
    } catch (error) {
      console.error("Erro ao buscar sugestões", error);
    }
  };

  const searchRoute = useCallback(async () => {
    if (initial) {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://router.project-osrm.org/route/v1/driving/${initial.longitude},${initial.latitude};${destination.longitude},${destination.latitude}?geometries=geojson`
        );
        const coordinates: Coordinate[] =
          response.data.routes[0].geometry.coordinates.map(
            ([longitude, latitude]: [number, number]) => ({
              latitude,
              longitude,
            })
          );
        setRoute(coordinates);
        setFocusSearch(false);
        setVisibleModalConfirmService(true);
      } catch (error) {
        toast.show(
          "Não foi possível traçar a rota! Verifique os endereços ou tente novamente mais tarde",
          {
            type: "danger",
            placement: "top",
          }
        );
      }
    }
    setIsLoading(false);
  }, [initial, destination]);

  useEffect(() => {
    const performSearch = async (
      input: string,
      setValue: (val: IAddressComplete[]) => void
    ) => {
      const wordCount = input.trim().split(/\s+/).length;
      if (wordCount < 2) {
        fetchSuggestions(input, setValue);
      } else {
        const debounceSearch = setTimeout(
          () => fetchSuggestions(input, setValue),
          300
        );
        return () => clearTimeout(debounceSearch);
      }
    };

    if (isFocusInitial) {
      performSearch(queryInitial, setSuggestionsInitial);
    }

    if (isFocusFinal) {
      performSearch(queryFinal, setSuggestionsFinal);
    }
  }, [queryInitial, queryFinal, isFocusInitial, isFocusFinal]);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const coordinate: Coordinate = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCurrentLocation(coordinate);
      fetchCurrentAddress(coordinate);
    } catch (error) {
      console.error("Erro ao obter localização atual", error);
    }
  };

  const fetchAddress = useCallback(async () => {
    const response = await getUserAddress({ page: 0, limit: 1000 });

    if (response?.result === "success") {
      if (response.data?.list[0]) {
        const addresses = await Promise.all(
          response.data?.list.map(async (e) => {
            const address = `${e.address} ${e.address_number}, ${e.city} - ${e.state}`;
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
              address
            )}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY}`;

            const geocodeResponse = await fetch(url)
              .then((res) => res.json())
              .catch((err) => console.log(err));

            const location = geocodeResponse?.results[0]?.geometry
              ?.location || { lat: "0", lng: "0" };

            return {
              formatted_address: `${e.address} - ${e.district}, ${
                e.address_number
              }, ${e.city} - ${e.state}, ${cepMask(e.zipcode)}, Brasil`,
              lat: location.lat,
              lon: location.lng,
              nameShow: e.name,
              place_id: String(e.id),
            };
          })
        );

        setAddress(addresses);
      }
    } else {
      toast.show(
        response?.message || "Serviço indisponível, tente novamente mais tarde",
        {
          type: "danger",
          placement: "top",
        }
      );
    }
  }, [toast]);

  useEffect(() => {
    fetchAddress();
  }, []);

  return (
    <View style={styles.overlaySearch}>
      <StatusBar style="light" />
      <View style={styles.containerInput}>
        <View style={styles.containerPoint}>
          <View style={styles.initialPoint}>
            <View style={styles.point} />
          </View>
          <View style={styles.dotsContainer}>
            {Array(8)
              .fill(0)
              .map((_, index) => (
                <View key={index} style={styles.dash} />
              ))}
          </View>
          <View style={styles.finalPoint} />
        </View>

        <View style={styles.containerInputPoints}>
          <TextInputCustom
            onChangeText={setQueryInitial}
            placeholder="Ponto inicial"
            onFocus={() => setIsFocusInitial(true)}
            value={queryInitial}
            left={
              <TextInput.Icon
                icon="map"
                color={(isTextInputFocused) =>
                  isTextInputFocused ? "#ffffff" : "#ffffff70"
                }
              />
            }
          />
          <TextInputCustom
            onChangeText={setQueryFinal}
            placeholder="Ponto Final"
            onFocus={() => setIsFocusFinal(true)}
            value={queryFinal}
            left={
              <TextInput.Icon
                icon="map"
                color={(isTextInputFocused) =>
                  isTextInputFocused ? "#ffffff" : "#ffffff70"
                }
              />
            }
          />
          <View style={styles.contentButtons}>
            <Button
              mode="outlined"
              style={styles.outlinedButton}
              disabled={isLoading}
              onPress={() => setFocusSearch(false)}
              textColor="#FFE924"
            >
              <GilroyText style={styles.outlinedButtonText}>Voltar</GilroyText>
            </Button>
            <Button
              mode="contained-tonal"
              buttonColor="#FFE924"
              disabled={!queryInitial || !queryFinal}
              loading={isLoading}
              onPress={searchRoute}
              style={{ width: "50%" }}
              textColor="#000"
            >
              <GilroyText
                style={
                  !queryInitial || !queryFinal
                    ? { color: "#c8c8c8" }
                    : styles.searchButtonText
                }
              >
                Ver rota
              </GilroyText>
            </Button>
          </View>
        </View>
      </View>
      {isFocusInitial && (
        <FlatList
          data={
            [
              ...address,
              ...(currentLocation && currentAddress
                ? [
                    {
                      ...currentAddress,
                      lat: currentLocation.latitude.toString(),
                      lon: currentLocation.longitude.toString(),
                    },
                  ]
                : []),
              ...suggestionsInitial,
            ] as IAddressComplete[]
          }
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => {
                setQueryInitial(item.formatted_address);
                setInitial({
                  latitude: parseFloat(item.lat),
                  longitude: parseFloat(item.lon),
                });
                setSuggestionsInitial([]);
                setIsFocusInitial(false);
              }}
            >
              <GilroyText style={styles.textSuggestionItem}>
                {item?.nameShow}
              </GilroyText>
            </TouchableOpacity>
          )}
        />
      )}
      {isFocusFinal && (
        <FlatList
          data={[...address, ...suggestionsFinal] as IAddressComplete[]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => {
                setQueryFinal(item?.formatted_address);
                setDestination({
                  latitude: parseFloat(item.lat),
                  longitude: parseFloat(item.lon),
                });
                setSuggestionsFinal([]);
                setIsFocusFinal(false);
              }}
            >
              <GilroyText style={styles.textSuggestionItem}>
                {item?.nameShow}
              </GilroyText>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlaySearch: {
    position: "absolute",
    flex: 1,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "#1C2129",
  },
  containerPoint: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 48,
  },
  containerInput: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#14181e",
    width: "100%",
    padding: 12,
    paddingTop: 64,
  },
  initialPoint: {
    borderRadius: 9999,
    borderColor: "#fff",
    borderWidth: 2,
    padding: 3,
  },
  finalPoint: {
    width: 12,
    height: 12,
    borderRadius: 9999,
    backgroundColor: "#FFE924",
    marginBottom: 12,
  },
  point: {
    width: 8,
    height: 8,
    borderRadius: 9999,
    backgroundColor: "#FFE924",
  },
  containerInputPoints: {
    display: "flex",
    columnGap: 0,
    width: "100%",
    paddingHorizontal: 16,
    paddingRight: 24,
  },
  dotsContainer: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  dash: {
    width: 2,
    height: 8,
    backgroundColor: "#fff",
    marginBottom: 4,
  },
  suggestionItem: {
    color: "#fff",
    backgroundColor: "#272f3b",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },
  textSuggestionItem: {
    color: "#fff",
  },
  outlinedButton: {
    borderColor: "#FFD700",
    width: "48%",
  },
  outlinedButtonText: {
    color: "#FFD700",
  },
  searchButtonText: {
    color: "black",
  },
  contentButtons: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
});
