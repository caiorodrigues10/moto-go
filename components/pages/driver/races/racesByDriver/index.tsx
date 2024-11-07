import { GilroyText } from "@/components/GilroyText";
import { BodyPage, View } from "@/components/Themed";
import { useAppDriverContext } from "@/context/AppDriverContext";
import { getValueLocal } from "@/providers/getValueLocal";
import { useApi } from "@/providers/useApi";
import { IResponseListServiceOrders } from "@/services/serviceOrder/types";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SegmentedButtons } from "react-native-paper";
import { ConfirmRace } from "../mapRace";
import { CardRaceActive } from "./components/CardRaceActive.tsx";
import { CardRaceAvailable } from "./components/CardRaceAvailable";

export default function RacesByDriver() {
  const { data: dataServices } = useApi<IResponseListServiceOrders>(
    `/serviceOrders?page=0&limit=9999`
  );

  const { data, mutate } = useApi<IResponseListServiceOrders>(
    "/serviceOrders/drivers?active=true"
  );
  const [value, setValue] = useState("available");

  const { isAccept } = useAppDriverContext();

  const [driverId, setDriverId] = useState("");

  useEffect(
    useCallback(() => {
      const getLocal = async () => {
        setDriverId((await getValueLocal("id")) || "");
      };
      getLocal();
    }, [])
  );

  return !isAccept ? (
    <BodyPage style={styles.bodyPage}>
      <GilroyText style={styles.title}>Corridas</GilroyText>
      <SegmentedButtons
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            value: "available",
            label: "Disponíveis",
            style: {
              backgroundColor: value === "available" ? "#FFE924" : "#ffffff20",
              borderRadius: 12,
            },
            labelStyle: { color: value === "available" ? "#000" : "#FFF" },
          },
          {
            value: "active",
            label: "Ativas",
            style: {
              backgroundColor: value === "active" ? "#FFE924" : "#ffffff20",
              borderRadius: 12,
            },
            labelStyle: { color: value === "active" ? "#000" : "#FFF" },
          },
        ]}
      />
      {value === "active" ? (
        <FlatList
          style={styles.flatList}
          data={data?.data?.list}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={
            <View
              style={{
                alignItems: "center",
                marginTop: 32,
              }}
            >
              <GilroyText style={{ fontSize: 24 }} weight="medium">
                Nenhum serviço disponível
              </GilroyText>
            </View>
          }
          renderItem={({ item }) => (
            <CardRaceActive item={item} key={item.id} mutate={mutate} />
          )}
        />
      ) : (
        <FlatList
          style={styles.flatList}
          data={dataServices?.data?.list.filter((e) => e.active && !e.accepted)}
          keyExtractor={(item) => String(item.id)}
          ListEmptyComponent={
            <View
              style={{
                alignItems: "center",
                marginTop: 32,
              }}
            >
              <GilroyText style={{ fontSize: 24 }} weight="medium">
                Nenhum serviço disponível
              </GilroyText>
            </View>
          }
          renderItem={({ item }) => (
            <CardRaceAvailable
              driverId={driverId}
              item={item}
              mutate={mutate}
            />
          )}
        />
      )}
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
