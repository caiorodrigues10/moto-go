import { GilroyText } from "@/components/GilroyText";
import { View } from "@/components/Themed";
import { useAppDriverContext } from "@/context/AppDriverContext";
import { getTravelTimeAndDistance } from "@/providers/getTravelTimeAndDistance";
import { Coordinate } from "@/services/Coordinate";
import {
  cancelServiceOrder,
  finishServiceOrder,
  updateServiceOrder,
} from "@/services/serviceOrder";
import {
  IListServiceOrders,
  IResponseListServiceOrders,
} from "@/services/serviceOrder/types";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, Linking, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";
import { useToast } from "react-native-toast-notifications";
import { KeyedMutator } from "swr";

export const CardRaceAvailable = ({
  item,
  mutate,
  driverId,
}: {
  item: IListServiceOrders;
  mutate: KeyedMutator<IResponseListServiceOrders>;
  driverId: string;
}) => {
  const { currentLocation } = useAppDriverContext();
  const [travelInfo, setTravelInfo] = useState({ distance: "", duration: "" });

  const toast = useToast();

  const openRoute = async ({ latitude, longitude }: Coordinate) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=current+location&destination=${latitude},${longitude}&travelmode=driving`;

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      Linking.openURL(url).catch((err) =>
        console.error("Erro ao tentar abrir o link:", err)
      );
    } else {
      Alert.alert("Link não suportado", "Não foi possível abrir este link.");
    }
  };

  const handleAccept = useCallback(
    async (data: IListServiceOrders) => {
      const response = await updateServiceOrder(
        { accepted: true, driver_id: Number(driverId) },
        data.id
      );

      if (response?.result === "success") {
        toast.show(
          response?.message ||
            "Serviço indisponível, tente novamente mais tarde",
          {
            type: "success",
            placement: "top",
          }
        );
        openRoute({
          latitude: Number(data.init_lat),
          longitude: Number(data.init_long),
        });
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
    },
    [driverId]
  );

  const handleRecuse = useCallback(
    async (id: number) => {
      const response = await updateServiceOrder({ driver_id: null }, id);

      if (response?.result === "success") {
        toast.show(
          response?.message ||
            "Serviço indisponível, tente novamente mais tarde",
          {
            type: "success",
            placement: "top",
          }
        );
        mutate();
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
    },
    [driverId, mutate]
  );

  const onCancelServiceOrder = useCallback(async () => {
    const response = await cancelServiceOrder(item.id);

    if (response?.result === "success") {
      toast.show(
        response?.message || "Serviço indisponível, tente novamente mais tarde",
        {
          type: "success",
          placement: "top",
        }
      );
      mutate();
    } else {
      toast.show(
        response?.message || "Serviço indisponível, tente novamente mais tarde",
        {
          type: "danger",
          placement: "top",
        }
      );
    }
  }, [toast, mutate, item]);

  const onFinishServiceOrder = useCallback(async () => {
    const response = await finishServiceOrder(item.id);

    if (response?.result === "success") {
      toast.show(
        response?.message || "Serviço indisponível, tente novamente mais tarde",
        {
          type: "success",
          placement: "top",
        }
      );
      mutate();
    } else {
      toast.show(
        response?.message || "Serviço indisponível, tente novamente mais tarde",
        {
          type: "danger",
          placement: "top",
        }
      );
    }
  }, [toast, mutate, item]);

  useEffect(() => {
    const fetchTravelData = async () => {
      if (currentLocation && item) {
        try {
          const response = await getTravelTimeAndDistance({
            origins: {
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            },
            destinations: {
              latitude: item.init_lat,
              longitude: item.init_long,
            },
          });

          if (response) {
            setTravelInfo(response);
          }
        } catch (err) {
          console.log("Erro ao buscar dados: " + err);
        }
      }
    };

    fetchTravelData();
  }, [currentLocation, item]);

  return (
    <View style={styles.raceItem}>
      <GilroyText style={styles.userName} weight="bold">
        {item.user_name}
      </GilroyText>
      <GilroyText style={styles.estimatedTime} weight="medium">
        Distância total:{" "}
        {String(
          Number(travelInfo.distance.replace("km", "").replace(",", ".")) +
            Number(item?.distance?.replace("km", "").replace(",", "."))
        )}{" "}
        km
      </GilroyText>
      <GilroyText style={styles.estimatedTime} weight="medium">
        De você até o usuário: {travelInfo.distance} - {travelInfo.duration}
      </GilroyText>
      <GilroyText style={styles.estimatedTime} weight="medium">
        Do usuário até o destino: {item.distance} -{" "}
        {item.duration && item.duration + " min"}
      </GilroyText>
      <View style={{ gap: 8, marginTop: 12 }}>
        <GilroyText style={styles.estimatedTime} weight="medium">
          Ponto de partida:
        </GilroyText>
        <GilroyText style={styles.estimatedTime} weight="medium">
          {item.full_address}
        </GilroyText>
      </View>
      <View style={{ gap: 8, marginTop: 12 }}>
        <GilroyText style={styles.estimatedTime} weight="medium">
          Destino:
        </GilroyText>
        <GilroyText style={styles.estimatedTime} weight="medium">
          {item.full_address_destiny}
        </GilroyText>
      </View>
      {/* <GilroyText style={styles.distance} weight="medium">
              Tipo de serviço: {item.service}
            </GilroyText> */}
      {/* <GilroyText style={styles.distance} weight="medium">
              Criado em: {item.createdAt}
            </GilroyText> */}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 2,
            borderColor: "#2ecc71",
            borderRadius: 12,
            padding: 8,
            paddingRight: 18,
            justifyContent: "center",
            gap: 8,
            width: item?.driver_id !== Number(driverId) ? "100%" : "50%",
          }}
          onPress={() => handleAccept(item)}
        >
          <Icon source="check" color="#2ecc71" size={24} />
          <GilroyText style={{ color: "#2ecc71" }} weight="bold">
            Aceitar
          </GilroyText>
        </TouchableOpacity>
        {item?.driver_id === Number(driverId) && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 2,
              borderColor: "#e74c3c",
              borderRadius: 12,
              padding: 8,
              paddingRight: 18,
              gap: 8,
              justifyContent: "center",
              width: item?.driver_id !== Number(driverId) ? "100%" : "50%",
            }}
            onPress={() => handleRecuse(item.id)}
          >
            <Icon source="close" color="#e74c3c" size={24} />
            <GilroyText style={{ color: "#e74c3c" }} weight="bold">
              Recusar
            </GilroyText>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bodyPage: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: 24,
  },
  flatList: {
    width: "100%",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    marginBottom: 8,
  },
  raceItem: {
    marginBottom: 12,
    gap: 8,
    padding: 24,
    borderWidth: 2,
    borderColor: "#ffffff30",
    backgroundColor: "#ffffff06",
    width: "100%",
    borderRadius: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  distance: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 8,
    gap: 24,
  },
  time: {
    padding: 24,
    borderWidth: 2,
    borderColor: "#ffffff30",
    backgroundColor: "#ffffff06",
    width: "100%",
    borderRadius: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
  },
  countdown: {
    fontSize: 18,
  },
  estimatedTime: {
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 24,
    justifyContent: "space-around",
    alignItems: "center",
  },
});
