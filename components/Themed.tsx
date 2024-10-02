import {
  Text as DefaultText,
  View as DefaultView,
  StyleSheet,
  useColorScheme,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { Colors } from "../constants/Colors";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText["props"];
export type ViewProps = ThemeProps & DefaultView["props"];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? "light";
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;

  return <DefaultView style={[style]} {...otherProps} />;
}

export function BodyPage(props: ViewProps) {
  const { style, lightColor, darkColor, children, ...otherProps } = props;

  return (
    <DefaultView style={[styles.bodyPage, style]} {...otherProps}>
      <StatusBar style="light" />
      {children}
    </DefaultView>
  );
}

const styles = StyleSheet.create({
  bodyPage: {
    flex: 1,
    backgroundColor: "#1C2129",
    paddingHorizontal: 24,
    paddingTop: 90,
  },
});
