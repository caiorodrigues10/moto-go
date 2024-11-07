import { getValueLocal } from "@/providers/getValueLocal";
import { phoneMask } from "@/providers/maskProviders";
import { setValueLocal } from "@/providers/setValueLocal";
import { getUserById, updateUser } from "@/services/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useToast } from "react-native-toast-notifications";
import { z } from "zod";
import { GilroyText } from "../../components/GilroyText";
import { TextInputCustom } from "../../components/TextInputCustom";
import { BodyPage } from "../../components/Themed";

const schema = z.object({
  name: z
    .string({ required_error: "Nome é obrigatório" })
    .min(1, "Nome é obrigatório"),
});

type IEdiUser = z.infer<typeof schema>;

export default function EditUser() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDataDriver, setIsLoadingDataDriver] = useState(false);
  const [telephone, setTelephone] = useState("");
  const [id, setId] = useState<number>(0);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IEdiUser>({
    resolver: zodResolver(schema),
  });

  const toast = useToast();

  const onSubmit = useCallback(
    async (data: IEdiUser) => {
      setIsLoading(true);

      const response = await updateUser(data, id);

      if (response?.result === "success") {
        toast.show(
          response?.message ||
            "Serviço indisponível, tente novamente mais tarde",
          {
            type: "success",
            placement: "top",
          }
        );
        setValueLocal({ key: "name", value: data.name });
      } else {
        toast.show(
          response?.message ||
            "Serviço indisponível, tente novamente mais tarde",
          {
            type: "danger",
            placement: "top",
          }
        );
      }
      setIsLoading(false);
    },
    [toast, id]
  );

  useEffect(() => {
    const getLocal = async () => {
      setIsLoadingDataDriver(true);
      const id = await getValueLocal("id");

      if (!id) {
        setIsLoadingDataDriver(false);
        return;
      }

      const response = await getUserById(Number(id));

      if (response?.data && response?.result === "success") {
        setId(Number(id));
        setValue("name", response.data.name);
        setTelephone(phoneMask(response.data.telephone || ""));
      } else {
        router.back();
      }
      setIsLoadingDataDriver(false);
    };
    getLocal();
  }, []);

  return (
    <BodyPage style={styles.bodyPage}>
      {!isLoadingDataDriver && (
        <>
          <GilroyText style={styles.title}>Editar perfil</GilroyText>
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

            <TextInputCustom
              value={telephone}
              disabled
              left={<TextInput.Icon icon="phone" color={"#ffffff"} />}
              placeholder="Telefone"
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleSubmit((e) => onSubmit(e))}
              style={styles.button}
              loading={isLoading}
              textColor="black"
              disabled={isLoading}
            >
              <GilroyText style={styles.buttonText}>Salvar</GilroyText>
            </Button>
          </View>
        </>
      )}
    </BodyPage>
  );
}

const styles = StyleSheet.create({
  bodyPage: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column",
    paddingTop: 0,
    gap: 24,
  },
  title: {
    textAlign: "center",
    fontSize: 24,
  },
  formContainer: {
    flexDirection: "column",
    width: "100%",
    gap: 4,
    marginTop: 16,
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

  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#cccccc",
    marginBottom: 16,
  },
  imageContainer: {
    marginTop: 20,
    width: 200,
    height: 200,
    borderRadius: 100,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#FFD700",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  iconEdit: {
    bottom: 10,
    right: 10,
    zIndex: 10,
    position: "absolute",
    backgroundColor: "#ff3f3f",
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 1000,
  },
  loading: {
    position: "absolute",
    zIndex: 1,
  },
});
