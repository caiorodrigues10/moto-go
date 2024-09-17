import { GilroyText } from "@/components/GilroyText";
import { TextInputCustom } from "@/components/TextInputCustom";
import { BodyPage, View } from "@/components/Themed";
import { useAppContext } from "@/context/AppContext";
import { validatePin } from "@/services/users";
import { IValidatePin } from "@/services/users/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useToast } from "react-native-toast-notifications";
import { z } from "zod";

const schema = z.object({
  code: z
    .string({ required_error: "Código é obrigatório" })
    .min(6, "Código inválido"),
});

type ValidatePinProps = z.infer<typeof schema>;

export default function ValidatePin() {
  const [isLoading, seIsLoading] = useState(false);
  const { telephone } = useAppContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidatePinProps>({
    resolver: zodResolver(schema),
  });

  const toast = useToast();

  const onSubmit = useCallback(
    async (data: ValidatePinProps) => {
      seIsLoading(true);
      const newData = {
        telephone,
        code: Number(data.code),
      } as IValidatePin;

      const response = await validatePin(newData);

      if (response.result === "success") {
        toast.show(response.message, {
          type: "success",
          placement: "top",
        });
        router.push("/(root)/activeLocale");
      } else {
        toast.show(response.message, {
          type: "danger",
          placement: "top",
        });
      }
      seIsLoading(false);
    },
    [toast, telephone]
  );

  return (
    <BodyPage style={styles.bodyPage}>
      <GilroyText style={styles.title}>Confirmação de SMS</GilroyText>
      <View style={styles.formContainer}>
        <Controller
          name="code"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInputCustom
              onBlur={onBlur}
              value={value}
              onChangeText={onChange}
              maxLength={6}
              isInvalid={!!errors.code}
              errorMessage={String(errors.code?.message)}
              placeholder="--- ---"
            />
          )}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit((e) => onSubmit(e))}
          style={styles.button}
          loading={isLoading}
        >
          <GilroyText style={styles.buttonText}>Validar código</GilroyText>
        </Button>
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
  buttonContainer: {
    flexDirection: "column",
    width: "100%",
    alignItems: "center",
    zIndex: -1,
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
  selectContainer: {
    flexDirection: "row",
    width: "100%",
    zIndex: 999,
    gap: 16,
  },
});
