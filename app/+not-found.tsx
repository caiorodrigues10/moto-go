import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { View } from "@/components/Themed";
import { GilroyText } from "@/components/GilroyText";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <GilroyText>This screen doesn't exist.</GilroyText>
        <Link href="/" style={styles.link}>
          <GilroyText>Go to home screen!</GilroyText>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
