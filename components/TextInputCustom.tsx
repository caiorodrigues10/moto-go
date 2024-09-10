import React from "react";
import { StyleSheet, TextStyle, ViewStyle } from "react-native";
import { TextInput, TextInputProps } from "react-native-paper";
import { GilroyText } from "./GilroyText";
import { View } from "./Themed";

interface TextInputCustomProps extends TextInputProps {
  isInvalid?: boolean;
  errorMessage?: string;
  styles?: {
    container?: ViewStyle;
    input?: TextStyle;
    errorMessage?: TextStyle;
  };
}

export function TextInputCustom({
  value,
  isInvalid,
  errorMessage,
  styles = {},
  style,
  ...props
}: TextInputCustomProps) {
  return (
    <View style={[styles.container, stylesSheet.container]}>
      <TextInput
        mode="outlined"
        textColor="white"
        placeholderTextColor="#ffffff70"
        value={value}
        style={[styles.input, stylesSheet.input, style]}
        activeOutlineColor="transparent"
        outlineColor="transparent"
        selectionColor="white"
        multiline={false} // Garante que o texto não quebra linhas
        {...props}
      />
      <GilroyText style={[stylesSheet.errorMessage, styles.errorMessage]}>
        {isInvalid && errorMessage && errorMessage}
      </GilroyText>
    </View>
  );
}

const stylesSheet = StyleSheet.create({
  container: {
    flexDirection: "column",
    gap: 6,
  },
  input: {
    fontSize: 16,
    width: "100%",
    color: "white",
    borderColor: "#4B5563",
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: "transparent",
    height: 48, // Altura fixa para o input
    textAlignVertical: "center",
    // O estilo para esconder o texto que ultrapassa o limite
    overflow: "hidden",
  },
  errorMessage: {
    color: "#F87171",
    height: 14,
  },
});
