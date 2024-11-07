import { GilroyText } from "@/components/GilroyText";
import { View } from "@/components/Themed";
import { useAppContext } from "@/context/AppContext";
import { getDrivers } from "@/services/drivers";
import { IDriver } from "@/services/drivers/types";
import { cancelServiceOrder } from "@/services/serviceOrder";
import {
  IListServiceOrders,
  IResponseListServiceOrderByUser,
} from "@/services/serviceOrder/types";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useToast } from "react-native-toast-notifications";
import { KeyedMutator } from "swr";

export function ServiceOrderActive({
  raceActive,
  fetchServiceOrderActive,
}: {
  raceActive: IListServiceOrders;
  fetchServiceOrderActive: KeyedMutator<IResponseListServiceOrderByUser>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [drivers, setDrivers] = useState([] as IDriver[]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);
  const [isLoadingCancel, setIsLoadingCancel] = useState(false);
  const toast = useToast();
  const { clearService } = useAppContext();

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

  const showCancelConfirmation = () => {
    Alert.alert(
      "Confirmação de Cancelamento",
      "Tem certeza que deseja cancelar este serviço?",
      [
        {
          text: "Fechar",
          style: "cancel",
        },
        {
          text: "Cancelar",
          onPress: () => onCancelServiceOrder(),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

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
      clearService();
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

  return (
    <View style={styles.overlaySearch}>
      <StatusBar style="light" />
      <View style={styles.container}>
        {raceActive.accepted ? (
          <View style={styles.containerRaceAwait}>
            <GilroyText style={{ marginTop: 12, color: "#ffffff95" }}>
              Previsão de chegada
            </GilroyText>

            <GilroyText
              style={{ fontSize: 18, marginBottom: 8 }}
              weight="medium"
            >
              {raceActive.duration}
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
              {raceActive.distance}
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
              onPress={showCancelConfirmation}
              style={{ width: "100%", marginTop: 14 }}
            >
              <GilroyText style={{ color: "#fff" }} weight="bold">
                Cancelar
              </GilroyText>
            </Button>
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
              {raceActive.duration}
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
              {raceActive.distance}
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
              onPress={showCancelConfirmation}
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
