import { GilroyText } from "@/components/GilroyText";
import { BodyPage } from "@/components/Themed";
import { deleteValueLocal } from "@/providers/deleteValueLocal";
import { getValueLocal } from "@/providers/getValueLocal";
import { phoneMask } from "@/providers/maskProviders";
import { updateFCMTokenDriver } from "@/services/drivers";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Button, Divider } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

export function Profile() {
  const signOut = async () => {
    Promise.all([
      deleteValueLocal("token"),
      deleteValueLocal("name"),
      deleteValueLocal("email"),
      deleteValueLocal("id"),
      deleteValueLocal("typeUser"),
      updateFCMTokenDriver({ fcmToken: "" }),
    ]);

    router.push("/(auth)/auth");
  };

  const [name, setName] = useState<string | null>();
  const [telephone, setTelephone] = useState<string | null>();
  const [typeUser, setTypeUser] = useState<string | null>();

  useFocusEffect(
    useCallback(() => {
      const getLocal = async () => {
        setTelephone(await getValueLocal("telephone"));
        setName(await getValueLocal("name"));
        setTypeUser(await getValueLocal("typeUser"));
      };
      getLocal();
    }, [])
  );

  return (
    <BodyPage style={styles.bodyPage}>
      <GilroyText style={styles.title}>Meu perfil</GilroyText>
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.contentUser}
        onPress={() =>
          router.push(
            typeUser === "user" ? "/(root)/edit" : "/(rootDriver)/edit"
          )
        }
      >
        <View style={styles.contentData}>
          <View style={styles.shortName}>
            <GilroyText>{name?.slice(0, 3)}</GilroyText>
          </View>
          <View style={{ gap: 4 }}>
            <GilroyText style={{ fontSize: 18 }} weight="medium">
              {name}
            </GilroyText>
            <GilroyText>{phoneMask(telephone || "")}</GilroyText>
          </View>
        </View>
        <Icon name="chevron-right" size={16} color="white" />
      </TouchableOpacity>

      <Divider style={styles.divider} />

      <GilroyText style={styles.sectionTitle}>Histórico</GilroyText>

      <Button
        mode="contained"
        buttonColor="#ffffff15"
        textColor="#FFE924"
        onPress={() => router.push("/(root)/historyRaces")}
        style={styles.button}
      >
        <View style={styles.buttonContent}>
          <View style={styles.iconAndTextButton}>
            <Icon name="history" size={16} color="#FFE924" />
            <GilroyText style={styles.buttonText} weight="medium">
              Histórico de corridas
            </GilroyText>
          </View>
          <Icon name="chevron-right" size={16} color="#FFE924" />
        </View>
      </Button>

      <Divider style={styles.divider} />

      <GilroyText style={styles.sectionTitle}>Suporte</GilroyText>

      <Button
        mode="contained"
        buttonColor="#ffffff15"
        textColor="#FFE924"
        onPress={() =>
          router.push(
            typeUser === "user" ? "/(root)/manual" : "/(rootDriver)/manual"
          )
        }
        style={styles.button}
      >
        <View style={styles.buttonContent}>
          <View style={styles.iconAndTextButton}>
            <Icon name="info-circle" size={16} color="#FFE924" />
            <GilroyText style={styles.buttonText} weight="medium">
              Manual do {typeUser === "user" ? "usuário" : "motorista"}
            </GilroyText>
          </View>
          <Icon name="chevron-right" size={16} color="#FFE924" />
        </View>
      </Button>

      <Button
        mode="contained"
        buttonColor="#ffffff15"
        textColor="#FF5252"
        onPress={signOut}
        style={styles.button}
      >
        <View style={styles.buttonContent}>
          <View style={styles.iconAndTextButton}>
            <Icon name="sign-out" size={16} color="#FF5252" />
            <GilroyText
              style={[styles.buttonText, { color: "#FF5252" }]}
              weight="medium"
            >
              Sair
            </GilroyText>
          </View>
          <View />
        </View>
      </Button>
    </BodyPage>
  );
}

const styles = StyleSheet.create({
  bodyPage: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    gap: 16,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
  },
  contentData: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  contentUser: {
    flexDirection: "row",
    width: "100%",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FFFFFF15",
    alignItems: "center",
    justifyContent: "space-between",
  },
  shortName: {
    padding: 8,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 1000,
    backgroundColor: "#3B4147",
  },
  divider: {
    width: "100%",
    marginTop: 16,
    backgroundColor: "#FFFFFF30",
    height: 2,
    borderRadius: 4,
  },
  sectionTitle: {
    textAlign: "left",
    width: "100%",
    marginBottom: 4,
    fontSize: 14,
    color: "#FFFFFF90",
  },
  button: {
    borderRadius: 12,
    width: "100%",
  },
  buttonContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 6,
    width: "100%",
  },
  iconAndTextButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    marginLeft: 8,
    color: "#FFE924",
  },
});
