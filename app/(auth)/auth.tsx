import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Button, Divider } from "react-native-paper";
import { GilroyText } from "../../components/GilroyText";
import { BodyPage } from "../../components/Themed";

const City = require("../../assets/images/city-2.png");

export default function Auth() {
  return (
    <BodyPage style={styles.bodyPage}>
      <View style={styles.imageContainer}>
        <Image source={City} style={styles.image} />
        <GilroyText style={styles.title} weight="bold">
          Vamos lá!!
        </GilroyText>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          buttonColor="white"
          onPress={() => router.push("/signIn")}
          style={styles.button}
        >
          <GilroyText style={styles.buttonText}>
            Criar uma nova conta de usuário
          </GilroyText>
        </Button>
        <Button
          mode="outlined"
          style={styles.outlinedButton}
          onPress={() => router.push("/login")}
        >
          <GilroyText style={styles.outlinedButtonText}>
            Entrar como usuário
          </GilroyText>
        </Button>
        <View
          style={{
            marginBottom: 16,
            marginTop: 16,
            alignItems: "center",
            width: "100%",
            flexDirection: "row",
            gap: 16,
          }}
        >
          <Divider style={{ width: "42%" }} />
          <GilroyText style={{ color: "gray" }}>OU</GilroyText>
          <Divider style={{ width: "42%" }} />
        </View>
        <Button
          mode="outlined"
          style={styles.outlinedButton}
          onPress={() => router.push("/driverLogin")}
        >
          <GilroyText style={styles.outlinedButtonText}>
            Entrar como motorista
          </GilroyText>
        </Button>
      </View>
    </BodyPage>
  );
}

const styles = StyleSheet.create({
  bodyPage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    gap: 8,
  },
  imageContainer: {
    flexDirection: "column",
    gap: 24,
    marginTop: 4,
  },
  image: {
    width: 300,
    height: 200,
  },
  title: {
    color: "white",
    fontSize: 24,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "column",
    width: "100%",
    gap: 4,
    marginTop: 12,
  },
  button: {
    marginBottom: 10,
  },
  buttonText: {
    color: "black",
  },
  outlinedButton: {
    borderColor: "#FFD700", // Cor amarela
  },
  outlinedButtonText: {
    color: "#FFD700", // Cor amarela
  },
});
