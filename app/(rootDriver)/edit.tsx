import { SelectItems } from "@/components/SelectItems";
import { flags } from "@/constants/flags";
import { getDriverById, updateDriver } from "@/services/drivers";
import { IDriver, IUpdateDriver } from "@/services/drivers/types";
import { zodResolver } from "@hookform/resolvers/zod";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useToast } from "react-native-toast-notifications";
import Icon from "react-native-vector-icons/FontAwesome";
import { z } from "zod";
import { GilroyText } from "../../components/GilroyText";
import { TextInputCustom } from "../../components/TextInputCustom";
import { BodyPage } from "../../components/Themed";
import { getValueLocal } from "@/providers/getValueLocal";
import { phoneMask } from "@/providers/maskProviders";
import {
  convertFileToBase64,
  convertUrlToBase64,
} from "@/providers/normalizeBase64";
import { isBase64 } from "@/utils/isBase64";
import { setValueLocal } from "@/providers/setValueLocal";

const schema = z.object({
  name: z
    .string({ required_error: "Nome é obrigatório" })
    .min(1, "Nome é obrigatório"),
  telephone: z
    .string({ required_error: "Telefone é obrigatório" })
    .min(11, "Telefone é obrigatório"),
});

type IEditDriver = z.infer<typeof schema>;

export default function EditDriver() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDataDriver, setIsLoadingDataDriver] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [imageToShow, setImageToShow] = useState<string>("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<IEditDriver>({
    resolver: zodResolver(schema),
  });

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageToShow("");
    }
  };

  const toast = useToast();

  const onSubmit = useCallback(
    async (data: IEditDriver) => {
      setIsLoading(true);

      const encodedAuth = image
        ? isBase64(image)
          ? image
          : await convertFileToBase64(image)
        : imageToShow
        ? await convertUrlToBase64(imageToShow)
        : undefined;

      const newData: IUpdateDriver = {
        name: data.name,
        profilePicture: encodedAuth,
      };

      const response = await updateDriver(newData);

      if (response?.result === "success") {
        await setValueLocal({ key: "name", value: data.name });
        toast.show(
          response?.message ||
            "Serviço indisponível, tente novamente mais tarde",
          {
            type: "success",
            placement: "top",
          }
        );
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
    [toast, image, isBase64, imageToShow]
  );

  useEffect(() => {
    const getLocal = async () => {
      setIsLoadingDataDriver(true);
      const id = await getValueLocal("id");

      const response = await getDriverById(id || "");

      if (response?.data && response?.result === "success") {
        setImageToShow(
          response.data.profile_picture !== "profile-pic-uuid"
            ? response.data.profile_picture || ""
            : ""
        );
        setValue("name", response.data.name);
        setValue("telephone", phoneMask(response.data.telephone || ""));
      } else {
        router.back();
      }
      setIsLoadingDataDriver(false);
    };
    getLocal();
  }, []);
  const [loading, setLoading] = useState(false);

  return (
    <BodyPage style={styles.bodyPage}>
      {!isLoadingDataDriver && (
        <>
          <GilroyText style={styles.title}>Editar perfil</GilroyText>
          <View style={{ position: "relative" }}>
            {(image || imageToShow) && (
              <TouchableOpacity
                style={styles.iconEdit}
                onPress={() => {
                  setImage(null);
                  setImageToShow("");
                }}
              >
                <Icon name="trash" size={24} color="white" />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
              {loading && (
                <ActivityIndicator
                  style={styles.loading}
                  size="small"
                  color="#fff"
                />
              )}
              {image || imageToShow ? (
                <Image
                  source={{
                    uri: image || imageToShow,
                  }}
                  style={styles.image}
                  onLoadStart={() => setLoading(true)}
                  onLoadEnd={() => setLoading(false)}
                />
              ) : (
                <GilroyText>Selecione uma imagem</GilroyText>
              )}
            </TouchableOpacity>
          </View>
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
                  disabled
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
