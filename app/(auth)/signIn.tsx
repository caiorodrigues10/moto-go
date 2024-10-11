import { createUser } from "@/services/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useToast } from "react-native-toast-notifications";
import { z } from "zod";
import { GilroyText } from "../../components/GilroyText";
import { TextInputCustom } from "../../components/TextInputCustom";
import { BodyPage, View } from "../../components/Themed";
import { phoneMask } from "../../providers/maskProviders";

const schema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }),
  telephone: z
    .string({ required_error: "Telefone é obrigatório" })
    .min(10, "Telefone inválido"),
});

type SignInProps = z.infer<typeof schema>;

export default function Login() {
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SignInProps>({
    resolver: zodResolver(schema),
  });
  const toast = useToast();

  const onSubmit = useCallback(
    async (data: SignInProps) => {
      const response = await createUser(data);

      if (response.result === "success") {
        toast.show(response.message, {
          type: "success",
          placement: "top",
        });
      } else {
        toast.show(response.message, {
          type: "danger",
          placement: "top",
        });
      }
    },
    [toast]
  );

  return (
    <BodyPage style={styles.bodyPage}>
      <GilroyText style={styles.title}>Cadastrar-se</GilroyText>
      <View style={styles.formContainer}>
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputCustom
              onBlur={onBlur}
              value={value}
              onChangeText={onChange}
              isInvalid={!!errors.name}
              errorMessage={String(errors.name?.message)}
              left={
                <TextInput.Icon
                  icon="account"
                  color={(isTextInputFocused) =>
                    isTextInputFocused || value ? "#ffffff" : "#ffffff70"
                  }
                />
              }
              placeholder="Nome completo"
            />
          )}
        />

        <Controller
          name="telephone"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputCustom
              onBlur={onBlur}
              value={value}
              onChangeText={(e) => {
                onChange(e);
                setValue("telephone", phoneMask(e));
              }}
              isInvalid={!!errors.telephone}
              errorMessage={String(errors.telephone?.message)}
              left={
                <TextInput.Icon
                  icon="phone"
                  color={(isTextInputFocused) =>
                    isTextInputFocused || value ? "#ffffff" : "#ffffff70"
                  }
                />
              }
              placeholder="Telefone"
            />
          )}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
        >
          <GilroyText style={styles.buttonText}>Cadastrar-se</GilroyText>
        </Button>

        <View style={styles.signInContainer}>
          <GilroyText>Já possui uma conta?</GilroyText>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => router.replace("/login")}
          >
            <GilroyText style={styles.signInText}>Acesse aqui!</GilroyText>
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
    gap: 24,
    paddingTop: 0,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
  },
  formContainer: {
    flexDirection: "column",
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    zIndex: -10,
  },
  button: {
    width: "100%",
    backgroundColor: "white",
    marginTop: -10,
  },
  buttonText: {
    color: "black",
  },
  signInContainer: {
    marginTop: 16,
    flexDirection: "row",
    gap: 8,
  },
  signInText: {
    color: "#00BFFF",
    textDecorationLine: "underline",
  },
});
