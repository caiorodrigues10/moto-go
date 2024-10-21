import { GilroyText } from "@/components/GilroyText";
import { View } from "@/components/Themed";
import { useAppContext } from "@/context/AppContext";
import { Coordinate } from "@/services/Coordinate";
import { getDrivers } from "@/services/drivers";
import { IDriver } from "@/services/drivers/types";
import { cancelServiceOrder } from "@/services/serviceOrder";
import { IListServiceOrders } from "@/services/serviceOrder/types";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useToast } from "react-native-toast-notifications";

export function ServiceOrderActive({
  raceActive,
  fetchServiceOrderActive,
}: {
  raceActive: IListServiceOrders;
  fetchServiceOrderActive: () => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [drivers, setDrivers] = useState([] as IDriver[]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);
  const toast = useToast();
  const { setVisibleModalConfirmService } = useAppContext();

  async function getTravelTime({
    destinations,
    origins,
  }: {
    origins: Coordinate;
    destinations: Coordinate;
  }) {
    const originCoords = `${origins.latitude},${origins.longitude}`;
    const destinationCoords = `${destinations.latitude},${destinations.longitude}`;

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originCoords}&destinations=${destinationCoords}&key=${process.env.EXPO_PUBLIC_GOOGLE_API_KEY_MATRIX}`
    )
      .then((res) => res.json())
      .catch((err) => {
        console.error("Erro na requisição:", err);
        throw new Error("Erro ao buscar dados da API do Google");
      });

    if (response.status === "OK") {
      const elements = response.rows[0].elements[0];
      const distance = elements.distance.text;
      const duration = elements.duration.text;

      setDuration(duration);
      setDistance(distance);
    }
  }

  const fetchDrivers = useCallback(
    async (page: number) => {
      if (page === 1) setIsLoading(true);
      setIsLoadingMore(page > 1);
      const response = await getDrivers({ page, limit: 10 });

      if (response?.result === "success") {
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
        toast.show(
          response?.message ||
            "Serviço indisponível, tente novamente mais tarde",
          {
            type: "danger",
            placement: "top",
          }
        );
      }

      setIsLoading(false);
      setIsLoadingMore(false);
    },
    [toast]
  );

  const onCancelServiceOrder = useCallback(async () => {
    setIsLoadingCancel(true);
    const response = await cancelServiceOrder(raceActive.id);

    if (response?.result === "success") {
      toast.show(
        response?.message || "Serviço indisponível, tente novamente mais tarde",
        {
          type: "success",
          placement: "top",
        }
      );
      await fetchServiceOrderActive();
      setVisibleModalConfirmService(true);
    } else {
      toast.show(
        response?.message || "Serviço indisponível, tente novamente mais tarde",
        {
          type: "danger",
          placement: "top",
        }
      );
    }
    setIsLoadingCancel(false);
  }, [raceActive, toast, fetchServiceOrderActive]);

  useEffect(() => {
    fetchDrivers(page);
  }, [page]);

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
            <GilroyText style={{ marginTop: 12, color: "#ffffff95" }}>
              Previsão de chegada
            </GilroyText>

            <GilroyText
              style={{ fontSize: 18, marginBottom: 8 }}
              weight="medium"
            >
              {duration}
            </GilroyText>

            <View
              style={{
                width: "100%",
                alignItems: "center",
                gap: 16,
              }}
            >
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginTop: 4,
                paddingRight: 12,
              }}
            >
              <View style={styles.point} />
              <GilroyText style={{ fontSize: 16 }} weight="medium">
                Aguardando o motorista aceitar a ordem de serviço
              </GilroyText>
            </View>
            <GilroyText style={{ marginTop: 14, fontSize: 14 }} weight="medium">
              Distância
            </GilroyText>
            <GilroyText style={{ fontSize: 20 }} weight="medium">
              {distance}
            </GilroyText>
            <GilroyText style={{ marginTop: 14, fontSize: 14 }} weight="medium">
              Motorista responsável
            </GilroyText>
            <GilroyText style={{ fontSize: 20 }} weight="medium">
              {raceActive?.driver_name || "Aguardando o motorista responsável"}
            </GilroyText>

            <GilroyText style={{ marginTop: 14, fontSize: 14 }} weight="medium">
              Observações
            </GilroyText>
            <GilroyText style={{ fontSize: 20 }} weight="medium">
              {raceActive?.comments || "Nenhuma observação"}
            </GilroyText>

            <Button
              mode="contained"
              buttonColor="#ff0000"
              onPress={onCancelServiceOrder}
              style={{ width: "100%", marginTop: 14 }}
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
    padding: 12,
    gap: 8,
  },
  point: {
    width: 8,
    height: 8,
    borderRadius: 1000,
    backgroundColor: "#FFE924",
  },
});
