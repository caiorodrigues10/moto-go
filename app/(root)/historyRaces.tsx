import { GilroyText } from "@/components/GilroyText";
import { BodyPage, View } from "@/components/Themed";
import { useApi } from "@/providers/useApi";
import { IResponseListServiceOrders } from "@/services/serviceOrder/types";
import React from "react";
import { FlatList, StyleSheet } from "react-native";

export default function AcceptedRacesHistory() {
  const { data: dataHistory } = useApi<IResponseListServiceOrders>(
    `/serviceOrders/history?page=0&limit=9999`
  );

  const convertDate = (val: Date) => {
    const date = new Date(val);

    return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
  };

  return (
    <BodyPage style={styles.bodyPage}>
      <GilroyText style={styles.title}>Histórico de corridas</GilroyText>
      <FlatList
        style={styles.flatList}
        data={dataHistory?.data?.list}
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
          <View style={styles.finalized} key={item.id}>
            <View style={{ gap: 8 }}>
              <GilroyText
                style={[
                  styles.countdown,
                  {
                    color:
                      !item.active && !!item.end_at ? "#2ecc71" : "#e74c3c",
                  },
                ]}
                weight="bold"
              >
                {!item.active && item.end_at && item.accepted
                  ? "Serviço concluído em:"
                  : "Serviço cancelado"}
              </GilroyText>
              {!item.active && !!item.end_at && (
                <GilroyText
                  style={[styles.countdown, { color: "#2ecc71" }]}
                  weight="bold"
                >
                  {item?.end_at && convertDate(item?.end_at)}
                </GilroyText>
              )}
            </View>
            {item.driver_name && (
              <GilroyText
                style={[styles.estimatedTime, { marginTop: 8 }]}
                weight="medium"
              >
                Motorista: {item.driver_name}
              </GilroyText>
            )}
            <GilroyText style={styles.estimatedTime} weight="medium">
              Serviço prestado: {item.service_type_name}
            </GilroyText>
            <GilroyText style={styles.estimatedTime} weight="medium">
              Distância: {item.distance}
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
    marginTop: -70,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    marginBottom: 8,
  },
  flatList: {
    width: "100%",
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
    borderColor: "#ffffff30",
    width: "100%",
    borderRadius: 12,
    gap: 12,
    marginBottom: 12,
  },
  countdown: {
    fontSize: 22,
  },
  estimatedTime: {
    fontSize: 18,
  },
  buttonsContainer: {
    flexDirection: "row",
    width: "100%",
    marginTop: 24,
    justifyContent: "space-around",
    alignItems: "center",
  },
});
