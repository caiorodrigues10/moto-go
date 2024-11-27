import React from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function Manual() {
  return (
    <View style={styles.container}>
      <WebView
        source={require("../../assets/files/manual-motorista.pdf")}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
