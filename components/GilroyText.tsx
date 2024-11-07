import React from "react";
import { Text, TextProps, StyleSheet, StyleProp } from "react-native";

interface GilroyTextProps extends TextProps {
  weight?: "bold" | "light" | "medium";
}

export function GilroyText(props: GilroyTextProps) {
  const { style, weight, ...otherProps } = props;

  let fontFamily = "Gilroy";

  if (weight === "bold") {
    fontFamily = "GilroyBold";
  } else if (weight === "light") {
    fontFamily = "GilroyLight";
  } else if (weight === "medium") {
    fontFamily = "GilroyMedium";
  }

  return (
    <Text {...otherProps} style={[styles.textWhite, style, { fontFamily }]} />
  );
}

const styles = StyleSheet.create({
  textWhite: {
    color: "white",
  },
});
