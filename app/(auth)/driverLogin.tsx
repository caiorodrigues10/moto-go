import { SelectItems } from "@/components/SelectItems";
import { flags } from "@/constants/flags";
import { useAppContext } from "@/context/AppContext";
import { phoneMask } from "@/providers/maskProviders";
import { driverLogin } from "@/services/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useToast } from "react-native-toast-notifications";
import { z } from "zod";
import { GilroyText } from "../../components/GilroyText";
import { TextInputCustom } from "../../components/TextInputCustom";
import { BodyPage } from "../../components/Themed";

const schema = z.object({
  telephone: z
    .string({ required_error: "Telefone é obrigatório" })
    .min(10, "Telefone inválido"),
});

type ILogin = z.infer<typeof schema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [codePhone, setCodePhone] = useState("+55");

  const { setTelephone, telephone } = useAppContext();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ILogin>({
    resolver: zodResolver(schema),
    defaultValues: {
      telephone,
    },
  });

  const handleSelect = (option: { label: string; value: string }) => {
    setCodePhone(option.value);
  };

  const toast = useToast();

  const onSubmit = useCallback(
    async (data: ILogin) => {
      setIsLoading(true);
      const newData = { telephone: data.telephone } as ILogin;
      const response = await driverLogin(newData);

      if (response.result === "success") {
        toast.show(response.message, {
          type: "success",
          placement: "top",
        });
        setTelephone(data.telephone);
        router.replace("/(auth)/driverValidatePin");
      } else {
        toast.show(response.message, {
          type: "danger",
          placement: "top",
        });
      }
      setIsLoading(false);
    },
    [toast]
  );

  return (
    <BodyPage style={styles.bodyPage}>
      <GilroyText style={styles.title}>Entrar</GilroyText>
      <View style={styles.formContainer}>
        <View style={styles.selectContainer}>
          <SelectItems
            options={flags.map((e) => ({
              label: `${e.flag} ${e.code}  |  ${e.name}`,
              value: e.code,
              showValue: `${e.flag} ${e.code} `,
            }))}
            onSelect={handleSelect}
            placeholder=""
            defaultValue="+55"
            styles={{
              styleList: { minWidth: 200 },
            }}
          />
          <Controller
            name="telephone"
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInputCustom
                onBlur={onBlur}
                value={value}
                disabled={isLoading}
                onChangeText={(e) => {
                  onChange(e);
                  setValue("telephone", phoneMask(e));
                }}
                isInvalid={!!errors.telephone}
                styles={{
                  container: { flex: 1 },
                }}
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
                keyboardType="numeric"
              />
            )}
          />
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit((e) => onSubmit(e))}
          style={styles.button}
          loading={isLoading}
          textColor="#000"
          disabled={isLoading}
        >
          <GilroyText style={styles.buttonText}>Enviar código</GilroyText>
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
  selectContainer: {
    flexDirection: "row",
    width: "100%",
    zIndex: 999,
    gap: 16,
  },
});
