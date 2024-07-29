import { router } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import CircularProgressBar from "../../components/ButtonProgress";
import { GilroyText } from "../../components/GilroyText";
import { BodyPage, View } from "../../components/Themed";

const Moto = require("../../assets/images/moto.png");
const City = require("../../assets/images/city.png");
const Locale = require("../../assets/images/locale.png");

export default function WelcomeLayout() {
  const [step, setStep] = useState(0);

  return (
    <BodyPage style={styles.bodyPage}>
      <View style={[styles.buttonRow, step > 0 && styles.buttonRowStep]}>
        {step > 0 && (
          <Button
            mode="text"
            textColor="#FFE924"
            onPress={() => setStep((prev) => prev - 1)}
          >
            Voltar
          </Button>
        )}
        <Button
          mode="text"
          textColor="#FFE924"
          onPress={() => router.push("/auth")}
        >
          Pular
        </Button>
      </View>
      {step === 0 && (
        <View style={styles.contentContainer}>
          <Image source={Moto} style={styles.image} />
          <GilroyText style={styles.text}>
            Seu motorista na palma da sua mão. Utilize este App com
            responsabilidade!
          </GilroyText>
        </View>
      )}
      {step === 1 && (
        <View style={styles.contentContainer}>
          <Image source={City} style={styles.image} />
          <GilroyText style={styles.text}>
            Motoristas On-line em tempo real, assim sua corrida se torna muita
            mais rápida!
          </GilroyText>
        </View>
      )}
      {step === 2 && (
        <View style={styles.contentContainer}>
          <Image source={Locale} style={styles.image} />
          <GilroyText style={styles.text}>
            Está pronto para começar? Aproveite tudo que o{" "}
            <GilroyText weight="bold">
              Moto
              <GilroyText style={styles.highlightText} weight="bold">
                GO
              </GilroyText>{" "}
            </GilroyText>
            tem a oferecer
          </GilroyText>
        </View>
      )}
      <View style={styles.progressContainer}>
        <View style={styles.dotsContainer}>
          <TouchableOpacity
            onPress={() => setStep(0)}
            style={[
              styles.dot,
              step === 0 ? styles.activeDot : styles.inactiveDot,
            ]}
          />
          <TouchableOpacity
            onPress={() => setStep(1)}
            style={[
              styles.dot,
              step === 1 ? styles.activeDot : styles.inactiveDot,
            ]}
          />
          <TouchableOpacity
            onPress={() => setStep(2)}
            style={[
              styles.dot,
              step === 2 ? styles.activeDot : styles.inactiveDot,
            ]}
          />
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (step === 2) {
              router.push("/auth");
            } else {
              setStep((prev) => prev + 1);
            }
          }}
        >
          <CircularProgressBar
            value={step + 1}
            max={3}
            strokeWidth={3}
            color={step === 2 ? "#FFE924" : undefined}
          />
        </TouchableOpacity>
      </View>
    </BodyPage>
  );
}

const styles = StyleSheet.create({
  bodyPage: {
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "column",
    flex: 1,
  },
  buttonRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "flex-end",
  },
  buttonRowStep: {
    justifyContent: "space-between",
  },
  contentContainer: {
    flexDirection: "column",
    gap: 32,
  },
  image: {
    width: 300,
    height: 200,
  },
  text: {
    fontSize: 24,
  },
  highlightText: {
    color: "#FFE924",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 12,
  },
  dot: {
    height: 12,
    borderRadius: 6,
  },
  activeDot: {
    backgroundColor: "#FFEB3B",
    width: 48,
  },
  inactiveDot: {
    backgroundColor: "#4B5563",
    width: 12,
  },
});
