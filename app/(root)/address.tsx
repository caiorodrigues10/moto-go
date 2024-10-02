import React from "react";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { GilroyText } from "../../components/GilroyText"; // Supondo que você use essa fonte
import { BodyPage, View } from "../../components/Themed";
import { Button, Divider } from "react-native-paper";

const addresses = [
  {
    id: "1",
    title: "Casa",
    address: "17, Razaq Balogun Street, Agodi, Ibadan...",
  },
  {
    id: "2",
    title: "Trabalho",
    address: "Cocoa House Building, Dugbe, Ibadan...",
  },
  {
    id: "3",
    title: "Academia",
    address: "Plot 71, Aboderin Layout Opp ShopRite...",
  },
  {
    id: "4",
    title: "Rodoviária",
    address: "Chief Obafemi Awolowo Station, Moniya...",
  },
];

export default function AddressList() {
  return (
    <BodyPage style={styles.bodyPage}>
      <GilroyText style={styles.title}>Lugares favoritos</GilroyText>
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.7} style={styles.addressItem}>
            <GilroyText style={styles.addressTitle} weight="medium">
              {item.title}
            </GilroyText>
            <GilroyText style={styles.addressText}>{item.address}</GilroyText>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <Divider style={styles.separator} />}
      />
      <Button mode="outlined" style={styles.addButton} onPress={() => {}}>
        <GilroyText style={styles.addButtonText}>
          + Adicionar nova localidade
        </GilroyText>
      </Button>
    </BodyPage>
  );
}

const styles = StyleSheet.create({
  bodyPage: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  addressItem: {
    paddingVertical: 16,
    gap: 4,
  },
  addressTitle: {
    fontSize: 18,
    color: "#FFE924", // Título em amarelo
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#9A9A9D", // Cor cinza claro para o endereço
  },
  separator: {
    height: 2,
    backgroundColor: "#ffffff50",
    marginBottom: 12,
  },
  addButton: {
    marginBottom: 24,
    borderColor: "#FFE924", // Borda amarela
    borderWidth: 1,
    borderRadius: 24, // Borda arredondada como no exemplo
    alignSelf: "center",
    width: "100%",
  },
  addButtonText: {
    color: "#FFE924", // Texto amarelo no botão
  },
});
