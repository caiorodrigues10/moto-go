import React, { useEffect, useState } from "react";
import { BodyPage, View } from "@/components/Themed";
import { FlatList, StyleSheet } from "react-native";
import { GilroyText } from "@/components/GilroyText";
import { IconButton } from "react-native-paper";

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

  useEffect(() => {
    setRaces(mockRaces);
  }, []);

  const handleAccept = (id: string) => {
    console.log(`Corrida com ID ${id} aceita.`);
  };

  const handleReject = (id: string) => {
    setRaces((prevRaces) => prevRaces.filter((race) => race.id !== id));
  };

  return (
    <BodyPage style={styles.bodyPage}>
      <GilroyText style={styles.title}>Corridas Disponíveis</GilroyText>

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
              <IconButton
                icon="check"
                iconColor="#2ecc71"
                style={{
                  borderWidth: 2,
                  borderColor: "#2ecc71",
                  borderRadius: 12,
                }}
                size={24}
                onPress={() => console.log("Aceitar corrida:", item)}
              />
              <IconButton
                icon="close"
                style={{
                  borderWidth: 2,
                  borderColor: "#e74c3c",
                  borderRadius: 12,
                }}
                iconColor="#e74c3c"
                size={24}
                onPress={() => handleReject(item.id)}
              />
            </View>
          </View>
        )}
      />
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
  flatList: {
    width: "100%",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    marginBottom: 8,
  },
  raceItem: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#ffffff15",
    borderRadius: 8,
    width: "100%",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
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
});
