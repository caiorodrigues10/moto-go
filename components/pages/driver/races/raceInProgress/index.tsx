import { GilroyText } from "@/components/GilroyText";
import { BodyPage, View } from "@/components/Themed";
import { useAppDriverContext } from "@/context/AppDriverContext";
import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Icon, SegmentedButtons } from "react-native-paper";

interface Race {
  id: string;
  userName: string;
  serviceDistance: number;
  service: string;
  createdAt: string;
  address: string;
}

const mockRaces: Race[] = [
  {
    id: "1",
    userName: "Carlos Silva",
    serviceDistance: 5.2,
    service: "Transporte",
    address: "Rua das coxinhas",
    createdAt: "01/10/2024 15:30",
  },
  {
    id: "2",
    userName: "Ana Costa",
    serviceDistance: 3.8,
    service: "Entrega",
    address: "Rua das esfirras",
    createdAt: "01/10/2024 14:30",
  },
];

export default function RaceInProgress() {
  const [races, setRaces] = useState<Race[]>([]);
  const { setDestination, isAccept, setIsAccept, setRaceInProgress } =
    useAppDriverContext();
  const [value, setValue] = useState("pending");

  useEffect(() => {
    setRaces(mockRaces);
  }, []);

  const handleAccept = (id: string) => {
    console.log(`Corrida com ID ${id} aceita.`);
    setIsAccept(id);
    setDestination({ latitude: -21.31941, longitude: -48.13291 });
  };

  const handleReject = (id: string) => {
    setRaces((prevRaces) => prevRaces.filter((race) => race.id !== id));
  };

  return (
    <BodyPage style={styles.bodyPage}>
      <GilroyText style={styles.title}>Corridas ativas</GilroyText>

      <TouchableOpacity
        activeOpacity={0.8}
        style={{
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          padding: 16,
          backgroundColor: "#ffffff30",
          borderRadius: 12,
          justifyContent: "space-between",
        }}
        onPress={() => setRaceInProgress(false)}
      >
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <GilroyText style={{ fontSize: 18, marginTop: 2 }}>
            Corridas disponíveis
          </GilroyText>
          <View
            style={{
              backgroundColor: "#2ecc71",
              borderRadius: 1000,
              width: 24,
              height: 24,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <GilroyText
              weight="medium"
              style={{ color: "#000", fontSize: 14, marginTop: 2 }}
            >
              4
            </GilroyText>
          </View>
        </View>
        <Icon size={32} source="chevron-right" color="#fff" />
      </TouchableOpacity>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: "pending",
            label: "Pendentes",
            // Aqui você pode definir os estilos do botão
            style: {
              backgroundColor: value === "pending" ? "#FFE924" : "#ffffff20",
              borderRadius: 12,
            },
            labelStyle: { color: value === "pending" ? "#000" : "#FFF" }, // cor do texto
          },
          {
            value: "delivered",
            label: "Entregues",
            // Estilos personalizados para o segundo botão
            style: {
              backgroundColor: value === "delivered" ? "#FFE924" : "#ffffff20",
              borderRadius: 12,
            },
            labelStyle: { color: value === "delivered" ? "#000" : "#FFF" }, // cor do texto
          },
        ]}
      />
      {value === "pending" ? (
        <View style={styles.time}>
          <GilroyText style={styles.countdown} weight="bold">
            Serviço ativo à: 4 horas
          </GilroyText>
          <GilroyText style={styles.estimatedTime} weight="medium">
            Tempo estimado: 2 horas
          </GilroyText>
          <GilroyText style={styles.estimatedTime} weight="medium">
            Distância: 2 km
          </GilroyText>
          <View style={styles.buttonsContainer}>
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
                Canelar
              </GilroyText>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.finalized}>
          <GilroyText
            style={[styles.countdown, { color: "#2ecc71" }]}
            weight="bold"
          >
            Serviço concluído em: 4 horas
          </GilroyText>
          <GilroyText style={styles.estimatedTime} weight="medium">
            Tempo estimado: 2 horas
          </GilroyText>
          <GilroyText style={styles.estimatedTime} weight="medium">
            Distância: 2 km
          </GilroyText>
          <GilroyText style={styles.estimatedTime} weight="medium">
            Data da entrega: 02/10/2024
          </GilroyText>
        </View>
      )}
    </BodyPage>
  );
}

const styles = StyleSheet.create({
  bodyPage: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: 24,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    marginBottom: 8,
  },
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
  },
  finalized: {
    padding: 24,
    borderWidth: 2,
    borderColor: "#2ecc71",
    width: "100%",
    borderRadius: 12,
  },
  countdown: {
    fontSize: 18,
  },
  estimatedTime: {
    fontSize: 14,
    marginTop: 12,
    color: "#c3c3c3",
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 24,
    justifyContent: "space-around",
    alignItems: "center",
  },
});
