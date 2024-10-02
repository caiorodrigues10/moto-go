import { useEffect } from "react";
import * as Location from "expo-location";
import { router } from "expo-router";
import { Image, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { GilroyText } from "../../components/GilroyText";
import { BodyPage, View } from "../../components/Themed";

const Locale = require("../../assets/images/icon-location.png");

export default function ActiveLocale() {
  useEffect(() => {
    const checkLocationServices = async () => {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (servicesEnabled) {
        router.replace("/map");
      }
    };

    checkLocationServices();
  }, []);

  return (
    <BodyPage style={styles.bodyPage}>
      <View style={styles.contentContainer}>
        <Image source={Locale} style={styles.image} />

        <GilroyText style={styles.mainText}>
          Para utilizar o{" "}
          <GilroyText weight="bold">
            Moto
            <GilroyText style={styles.highlightedText} weight="bold">
              GO
            </GilroyText>{" "}
          </GilroyText>
          precisamos que você permita o compartilhamento de localização em tempo
          real, assim garantimos a segurança para todos!
        </GilroyText>
      </View>
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => router.replace("/map")}
      >
        <GilroyText style={styles.buttonText}>Habilitar</GilroyText>
      </Button>
    </BodyPage>
  );
}

const styles = StyleSheet.create({
  bodyPage: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    gap: 100,
    alignItems: "center",
  },
  contentContainer: {
    flexDirection: "column",
    gap: 32,
    alignItems: "center",
    display: "flex",
  },
  image: {
    width: 100,
    height: 100,
  },
  mainText: {
    fontSize: 20,
    textAlign: "center",
  },
  highlightedText: {
    color: "#FFD700",
  },
  button: {
    width: "100%",
    backgroundColor: "white",
  },
  buttonText: {
    color: "black",
  },
});
