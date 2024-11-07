import { GilroyText } from "@/components/GilroyText";
import { TextInputCustom } from "@/components/TextInputCustom";
import { View } from "@/components/Themed";
import { useAppContext } from "@/context/AppContext";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export function Observations() {
  const {
    setIsOpenObservations,
    setVisibleModalConfirmService,
    observationsValue,
    setObservationsValue,
  } = useAppContext();

  return (
    <View style={styles.overlaySearch}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <GilroyText style={styles.title}>Escolha um motorista</GilroyText>
        <TextInputCustom
          value={observationsValue}
          onChangeText={setObservationsValue}
          placeholder="Observações para o motorista"
          multiline={true}
          style={{ height: 100 }}
          numberOfLines={4}
        />
        <View style={{ marginTop: "auto" }} />
        {observationsValue && (
          <Button
            mode="contained"
            buttonColor="#FFE924"
            style={{ marginTop: "auto", marginBottom: 12 }}
            onPress={() => {
              setIsOpenObservations(false);
              setVisibleModalConfirmService(true);
            }}
          >
            <GilroyText style={{ color: "#000" }}>Salvar observação</GilroyText>
          </Button>
        )}
        <Button
          mode="contained"
          buttonColor="#ff0000"
          onPress={async () => {
            setIsOpenObservations(false);
            setVisibleModalConfirmService(true);
            setObservationsValue("");
          }}
          style={{ width: "100%" }}
        >
          <GilroyText style={{ color: "#fff" }} weight="bold">
            Cancelar
          </GilroyText>
        </Button>
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
    height: "85%",
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
});
