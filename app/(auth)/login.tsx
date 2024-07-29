import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity, StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { z } from "zod";
import { TextInputCustom } from "../../components/TextInputCustom";
import { BodyPage } from "../../components/Themed";
import { router } from "expo-router";
import { GilroyText } from "../../components/GilroyText";

const schema = z.object({
  email: z
    .string({ required_error: "Email é obrigatório" })
    .email("Email inválido"),
  password: z
    .string({ required_error: "Senha é obrigatória" })
    .min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export default function Login() {
  const [secureTextEntryIsActive, setSecureTextEntryIsActive] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <BodyPage style={styles.bodyPage}>
      <GilroyText style={styles.title}>Entrar</GilroyText>
      <View style={styles.formContainer}>
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputCustom
              onBlur={onBlur}
              value={value}
              onChangeText={onChange}
              isInvalid={!!errors.email}
              errorMessage={String(errors.email?.message)}
              left={
                <TextInput.Icon
                  icon="email"
                  color={(isTextInputFocused) =>
                    isTextInputFocused || value ? "#ffffff" : "#ffffff70"
                  }
                />
              }
              placeholder="Email"
            />
          )}
        />

        <View style={styles.passwordContainer}>
          <Controller
            name="password"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputCustom
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Senha"
                isInvalid={!!errors.password}
                errorMessage={String(errors.password?.message)}
                secureTextEntry={secureTextEntryIsActive}
                right={
                  <TextInput.Icon
                    icon={secureTextEntryIsActive ? "eye-off" : "eye"}
                    onPress={() => setSecureTextEntryIsActive((prev) => !prev)}
                    color={(isTextInputFocused) =>
                      isTextInputFocused || value ? "#ffffff" : "#ffffff70"
                    }
                  />
                }
                left={
                  <TextInput.Icon
                    icon="lock"
                    color={(isTextInputFocused) =>
                      isTextInputFocused || value ? "#ffffff" : "#ffffff70"
                    }
                  />
                }
              />
            )}
          />

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push("/forgotPassword")}
          >
            <GilroyText style={styles.forgotPasswordText}>
              Esqueceu sua senha?
            </GilroyText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          // onPress={handleSubmit(onSubmit)}
          onPress={() => router.push("/activeLocale")}
          style={styles.button}
        >
          <GilroyText style={styles.buttonText}>Entrar</GilroyText>
        </Button>

        <View style={styles.signUpContainer}>
          <GilroyText>Não possui uma conta?</GilroyText>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.push("/signIn")}
          >
            <GilroyText style={styles.signUpText}>
              Crie uma nova aqui!
            </GilroyText>
          </TouchableOpacity>
        </View>
      </View>
    </BodyPage>
  );
}

const styles = StyleSheet.create({
  bodyPage: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    paddingTop: 24,
    gap: 24,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
  },
  formContainer: {
    flexDirection: "column",
    width: "100%",
    gap: 16,
  },
  passwordContainer: {
    flexDirection: "column",
    gap: 12,
  },
  forgotPasswordText: {
    color: "#00BFFF", // sky blue color
    textDecorationLine: "underline",
  },
  buttonContainer: {
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
  },
  button: {
    width: "100%",
    backgroundColor: "white",
  },
  buttonText: {
    color: "black",
  },
  signUpContainer: {
    marginTop: 12,
    flexDirection: "row",
    gap: 4,
  },
  signUpText: {
    color: "#00BFFF",
    textDecorationLine: "underline",
  },
});
