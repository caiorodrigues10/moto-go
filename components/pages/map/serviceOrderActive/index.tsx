import { GilroyText } from "@/components/GilroyText";
import { View } from "@/components/Themed";
import { useAppContext } from "@/context/AppContext";
import { Coordinate } from "@/services/Coordinate";
import { getDrivers } from "@/services/drivers";
import { IDriver } from "@/services/drivers/types";
import { IListServiceOrders } from "@/services/serviceOrder/types";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useToast } from "react-native-toast-notifications";

export function ServiceOrderActive({
  raceActive,
}: {
  raceActive: IListServiceOrders;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [drivers, setDrivers] = useState([] as IDriver[]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);

  async function getTravelTime({
    destinations,
    origins,
  }: {
    origins: Coordinate;
    destinations: Coordinate;
  }) {
    const originCoords = `${origins.latitude},${origins.longitude}`;
    const destinationCoords = `${destinations.latitude},${destinations.longitude}`;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originCoords}&destinations=${destinationCoords}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY_MATRIX}`;

    const response = await fetch(url)
      .then((res) => res.json())
      .catch((err) => {
        console.error("Erro na requisição:", err);
        throw new Error("Erro ao buscar dados da API do Google");
      });

    console.log("Resposta da API:", response);

    if (response.status === "OK") {
      const elements = response.rows[0].elements[0];
      const distance = elements.distance.text;
      const duration = elements.duration.text;

      console.log(`Distância: ${distance}`);
      console.log(`Tempo estimado: ${duration}`);

      return { distance, duration };
    }
  }

  useEffect(() => {
    getTravelTime({
      destinations: {
        latitude: Number(raceActive.final_lat),
        longitude: Number(raceActive.final_long),
      },
      origins: {
        latitude: Number(raceActive.init_lat),
        longitude: Number(raceActive.init_long),
      },
    });
  }, [raceActive]);

  const { setIsOpenSelectDriver, setVisibleModalConfirmService, setDriver } =
    useAppContext();

  const toast = useToast();

  const fetchDrivers = useCallback(
    async (page: number) => {
      if (page === 1) setIsLoading(true);
      setIsLoadingMore(page > 1);
      const response = await getDrivers({ page, limit: 10 });

      if (response.result === "success") {
        if (page === 1) {
          setDrivers(response.data?.list || []);
        } else {
          setDrivers((prevDrivers) => [
            ...prevDrivers,
            ...(response.data?.list || []),
          ]);
        }

        if (response.data?.list?.length === 0) {
          setHasMore(false);
        }
      } else {
        toast.show(response.message, {
          type: "danger",
          placement: "top",
        });
      }

      setIsLoading(false);
      setIsLoadingMore(false);
    },
    [toast]
  );

  useEffect(() => {
    fetchDrivers(page);
  }, [page]);

  const loadMoreDrivers = () => {
    if (!isLoadingMore && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <View style={styles.overlaySearch}>
      <StatusBar style="light" />
      <View style={styles.container}>
        {raceActive.accepted ? (
          <View style={styles.containerRaceActive}>
            <GilroyText>Motorista responsável</GilroyText>
            <GilroyText>{raceActive?.driver_name}</GilroyText>
          </View>
        ) : (
          <View style={styles.containerRaceAwait}>
            <View
              style={{
                width: "100%",
                alignItems: "center",
                paddingBottom: 16,
                gap: 16,
              }}
            >
              <GilroyText style={{ fontSize: 20 }} weight="medium">
                Motorista á caminho
              </GilroyText>
              <LottieView
                source={require("../../../../assets/images/loading-bar.json")}
                autoPlay
                duration={4000}
                style={{
                  width: "100%",
                  height: 4,
                }}
              />
            </View>
            <GilroyText style={{ fontSize: 20 }} weight="medium">
              Iniciado em:
            </GilroyText>
            <GilroyText style={{ fontSize: 16 }}>
              {new Date(raceActive?.created_at).toLocaleDateString() +
                " - " +
                new Date(raceActive?.created_at).toLocaleTimeString()}
            </GilroyText>

            <GilroyText style={{ fontSize: 20, marginTop: 12 }} weight="medium">
              Motorista responsável
            </GilroyText>
            <GilroyText>{raceActive?.driver_name}Robertinho</GilroyText>

            <GilroyText style={{ fontSize: 20, marginTop: 12 }} weight="medium">
              Observações
            </GilroyText>
            <GilroyText>
              {raceActive?.comments || "Nenhuma observação"}
            </GilroyText>

            <Button
              mode="contained"
              buttonColor="#FFE924"
              style={{ marginTop: "auto", marginBottom: 12 }}
              onPress={() => {
                setIsOpenSelectDriver(false);
                setVisibleModalConfirmService(true);
              }}
            >
              <GilroyText style={{ color: "#000" }}>
                Corrida em progresso
              </GilroyText>
            </Button>
            <Button
              mode="contained"
              buttonColor="#ff0000"
              onPress={async () => {
                setIsOpenSelectDriver(false);
                setVisibleModalConfirmService(true);
                setDriver({} as IDriver);
              }}
              style={{ width: "100%" }}
            >
              <GilroyText style={{ color: "#fff" }} weight="bold">
                Cancelar
              </GilroyText>
            </Button>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlaySearch: {
    position: "absolute",
    flex: 1,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "#1C2129",
  },
  container: {
    marginTop: 90,
    paddingHorizontal: 16,
    justifyContent: "space-between",
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 12,
    backgroundColor: "#313a49",
  },
  suggestionItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
  },
  textSuggestionItem: {
    color: "#fff",
    fontSize: 22,
  },
  telephone: {
    color: "#c3c3c3",
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    color: "#ffffff",
    marginBottom: 24,
    textAlign: "center",
  },
  contentDataUser: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  suggestionItemActive: {
    backgroundColor: "#ffffff20",
  },
  containerRaceActive: {
    backgroundColor: "#ffffff20",
    padding: 8,
  },
  containerRaceAwait: {
    backgroundColor: "#ffffff10",
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    gap: 8,
  },
});
