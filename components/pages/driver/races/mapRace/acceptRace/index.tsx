import { GilroyText } from "@/components/GilroyText";
import { View } from "@/components/Themed";
import { useAppDriverContext } from "@/context/AppDriverContext";
import { Coordinate } from "@/services/Coordinate";
import { useCallback } from "react";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";

export function AcceptRace({
  currentLocation,
  isLoading,
}: {
  currentLocation: Coordinate | null;
  isLoading: boolean;
}) {
  const {
    setRoute,
    setInitial,
    setDestination,
    isInvalidRace,
    setIsInvalidRace,
    setIsAccept,
  } = useAppDriverContext();

  const clearService = useCallback(() => {
    setIsAccept("");
    setRoute([]);
    setDestination({} as Coordinate);
    setInitial(currentLocation);
    setIsInvalidRace(false);
  }, [currentLocation]);

  return (
    <View style={styles.dialogContainer}>
      <View style={styles.dialog}>
        <GilroyText style={styles.label}>Deseja prestar o serviço?</GilroyText>
        <View style={styles.contentButtons}>
          <Button
            mode="contained"
            buttonColor="#ff0000"
            onPress={clearService}
            style={{ width: "48%" }}
            loading={isLoading}
          >
            <GilroyText style={{ color: "#fff" }} weight="bold">
              Cancelar
            </GilroyText>
          </Button>
          <Button
            mode="contained-tonal"
            contentStyle={{
              backgroundColor: isInvalidRace ? "#b19f00" : "#FFE924",
            }}
            style={{
              width: "50%",
            }}
            loading={isLoading}
            // disabled={isInvalidRace}
          >
            <GilroyText style={{ color: "#000" }}>Confirmar</GilroyText>
          </Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  dialogContainer: {
    position: "absolute",
    bottom: 0,
    left: 20,
    right: 20,
    marginBottom: 12,
  },
  dialog: {
    backgroundColor: "#1C1C1E",
    padding: 12,
    paddingBottom: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
  label: {
    color: "#FFF",
    marginBottom: 5,
  },
  contentButtons: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    paddingVertical: 4,
  },
});
