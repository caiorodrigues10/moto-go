import React, { useEffect, useState } from "react";
import { BodyPage, View } from "@/components/Themed";
import { FlatList, Text, StyleSheet } from "react-native";
import { GilroyText } from "@/components/GilroyText";

interface Race {
  id: string;
  userName: string;
  serviceDistance: number;
  service: string;
  createdAt: string;
  address: string;
}

const mockAcceptedRaces: Race[] = [
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

export default function AcceptedRacesHistory() {
  const [acceptedRaces, setAcceptedRaces] = useState<Race[]>([]);

  useEffect(() => {
    setAcceptedRaces(mockAcceptedRaces);
  }, []);

  return (
    <BodyPage style={styles.bodyPage}>
      <GilroyText style={styles.title}>
        Histórico de Corridas Aceitas
      </GilroyText>

      <FlatList
        style={styles.flatList}
        data={acceptedRaces}
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  raceItem: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#f2f2f215",
    borderRadius: 8,
    width: "100%",
    gap: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  distance: {
    fontSize: 14,
    color: "white",
  },
});
