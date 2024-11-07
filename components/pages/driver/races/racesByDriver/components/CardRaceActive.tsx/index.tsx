import { GilroyText } from "@/components/GilroyText";
import { View } from "@/components/Themed";
import { useAppDriverContext } from "@/context/AppDriverContext";
import { getTravelTimeAndDistance } from "@/providers/getTravelTimeAndDistance";
import {
  cancelServiceOrder,
  finishServiceOrder,
} from "@/services/serviceOrder";
import {
  IListServiceOrders,
  IResponseListServiceOrders,
} from "@/services/serviceOrder/types";
import { calculateTimeSinceStart } from "@/utils/calculateTimeSinceStart";
import React, { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";
import { useToast } from "react-native-toast-notifications";
import { KeyedMutator } from "swr";

export const CardRaceActive = ({
  item,
  mutate,
}: {
  item: IListServiceOrders;
  mutate: KeyedMutator<IResponseListServiceOrders>;
}) => {
  const { currentLocation } = useAppDriverContext();
  const [travelInfo, setTravelInfo] = useState({ distance: "", duration: "" });

  const toast = useToast();

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
    <View style={styles.time}>
      <GilroyText style={styles.countdown} weight="bold">
        Serviço ativo à:{" "}
        {calculateTimeSinceStart(item.created_at).hours !== 0
          ? `${calculateTimeSinceStart(item.created_at).hours} horas`
          : calculateTimeSinceStart(item.created_at).minutes === 0
          ? "1 minuto"
          : calculateTimeSinceStart(item.created_at).minutes + " minutos"}
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
      <View style={{ marginTop: 16 }}>
        <GilroyText style={styles.estimatedTime} weight="medium">
          Endereço do usuário:
        </GilroyText>
        <GilroyText style={styles.estimatedTime} weight="medium">
          {item.full_address}
        </GilroyText>
      </View>

      <View>
        <GilroyText style={styles.estimatedTime} weight="medium">
          Endereço do destino:
        </GilroyText>
        <GilroyText style={styles.estimatedTime} weight="medium">
          {item.full_address_destiny}
        </GilroyText>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={onFinishServiceOrder}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 2,
              borderColor: "#2ecc71",
              borderRadius: 12,
              padding: 12,
              paddingRight: 18,
              gap: 8,
            }}
          >
            <Icon source="check" color="#2ecc71" size={24} />
            <GilroyText style={{ color: "#2ecc71" }} weight="bold">
              Entregue
            </GilroyText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={showCancelConfirmation}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 2,
              borderColor: "#e74c3c",
              borderRadius: 12,
              padding: 12,
              paddingRight: 18,
              gap: 8,
            }}
          >
            <Icon source="close" color="#e74c3c" size={24} />
            <GilroyText style={{ color: "#e74c3c" }} weight="bold">
              Cancelar
            </GilroyText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  time: {
    padding: 24,
    borderWidth: 2,
    borderColor: "#ffffff30",
    width: "100%",
    borderRadius: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 12,
  },
  countdown: {
    fontSize: 18,
  },
  estimatedTime: {
    fontSize: 16,
    marginTop: 12,
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 32,
    justifyContent: "space-around",
    alignItems: "center",
  },
});
