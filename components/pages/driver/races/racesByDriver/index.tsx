import { GilroyText } from "@/components/GilroyText";
import { BodyPage, View } from "@/components/Themed";
import { useAppDriverContext } from "@/context/AppDriverContext";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";
import { ConfirmRace } from "../mapRace";
import RaceInProgress from "../raceInProgress";

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

export default function RacesByDriver() {
  const [races, setRaces] = useState<Race[]>([]);
  const {
    setDestination,
    isAccept,
    setIsAccept,
    raceInProgress,
    setRaceInProgress,
  } = useAppDriverContext();

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

  if (raceInProgress) {
    return <RaceInProgress />;
  }

  return !isAccept ? (
    <BodyPage style={styles.bodyPage}>
      <GilroyText style={styles.title}>Corridas Disponíveis</GilroyText>

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
        onPress={() => setRaceInProgress(true)}
      >
        <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
          <GilroyText style={{ fontSize: 18, marginTop: 2 }}>
            Corridas ativas
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
      <FlatList
        style={styles.flatList}
        data={races}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.raceItem}>
            <GilroyText style={styles.userName} weight="bold">
              {item.userName}
            </GilroyText>
            <GilroyText style={styles.distance} weight="medium">
              Distância até o serviço: {item.serviceDistance} km
            </GilroyText>
            <GilroyText style={styles.distance} weight="medium">
              Endereço: {item.address}
            </GilroyText>
            <GilroyText style={styles.distance} weight="medium">
              Tipo de serviço: {item.service}
            </GilroyText>
            <GilroyText style={styles.distance} weight="medium">
              Criado em: {item.createdAt}
            </GilroyText>

            {/* Ícones de aceitar e recusar */}
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
                  gap: 8,
                }}
                onPress={() => handleAccept(item.id)}
              >
                <Icon source="check" color="#2ecc71" size={24} />
                <GilroyText style={{ color: "#2ecc71" }} weight="bold">
                  Aceitar
                </GilroyText>
              </TouchableOpacity>
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
                }}
              >
                <Icon source="close" color="#e74c3c" size={24} />
                <GilroyText style={{ color: "#e74c3c" }} weight="bold">
                  Recusar
                </GilroyText>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </BodyPage>
  ) : (
    <ConfirmRace />
  );
}

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
