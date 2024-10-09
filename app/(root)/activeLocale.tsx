import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { router } from "expo-router";
import { Image, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { GilroyText } from "../../components/GilroyText";
import { BodyPage, View } from "../../components/Themed";
import LottieView from "lottie-react-native";

const Locale = require("../../assets/images/icon-location.png");

export default function ActiveLocale() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLocationServices = async () => {
      setIsLoading(true);
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (servicesEnabled) {
        router.replace("/(root)/teste");
      }
      setIsLoading(false);
    };

    checkLocationServices();
  }, []);

  if (!isLoading) {
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
            precisamos que você permita o compartilhamento de localização em
            tempo real, assim garantimos a segurança para todos!
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
  } else {
    return (
      <BodyPage style={styles.bodyPage}>
        <View style={styles.loadingContainer}>
          <LottieView
            source={require("../../assets/images/loading-driver.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        </View>
      </BodyPage>
    );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
