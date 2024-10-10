import { GilroyText } from "@/components/GilroyText";
import { SelectItems } from "@/components/SelectItems";
import { TextInputCustom } from "@/components/TextInputCustom";
import { View } from "@/components/Themed";
import { statesOfBrazil } from "@/constants/states";
import { getAddress } from "@/providers/getAddressByCEP";
import { cepMask, removedMask } from "@/providers/maskProviders";
import {
  createUserAddress,
  deleteUserAddress,
  updateUserAddress,
} from "@/services/users";
import { ICreateUserAddress, IUserAddress } from "@/services/users/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useToast } from "react-native-toast-notifications";
import { z } from "zod";

const schema = z.object({
  name: z.string({ required_error: "Nome é obrigatório" }),
  zipcode: z.string({ required_error: "CEP é obrigatório" }),
  address: z.string({ required_error: "Rua é obrigatório" }),
  district: z.string({ required_error: "Bairro é obrigatório" }),
  address_number: z.coerce.number({
    required_error: "Número é obrigatório",
    invalid_type_error: "Número é obrigatório",
  }),
  city: z.string({ required_error: "Cidade é obrigatório" }),
  state: z.string({ required_error: "Estado é obrigatório" }),
  complement: z.string().optional().nullable(),
});

export function UpdateAddress({
  setIsOpen,
  addressData,
  refresh,
}: {
  setIsOpen: (val: boolean) => void;
  refresh: () => void;
  addressData: IUserAddress;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);

  const [uf, setUf] = useState(addressData?.state || "");

  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ICreateUserAddress>({
    resolver: zodResolver(schema),
    defaultValues: {
      address: addressData.address,
      address_number: addressData.address_number,
      city: addressData.city,
      complement: addressData?.complement || "",
      district: addressData.district,
      name: addressData.name,
      state: addressData.state,
      zipcode: addressData.zipcode,
    },
  });

  const onSubmit = useCallback(
    async (data: ICreateUserAddress) => {
      setIsLoading(true);

      const response = await updateUserAddress(data, addressData.id);

      if (response.result === "success") {
        toast.show(response.message, {
          type: "success",
          placement: "top",
        });
        refresh();
        setIsOpen(false);
      } else {
        toast.show(response.message, {
          type: "danger",
          placement: "top",
        });
      }
      setIsLoading(false);
    },
    [toast, addressData, refresh]
  );

  const handleSelect = (option: { label: string; value: string }) => {
    setValue("state", option.value);
  };

  const handleGetAddress = useCallback(async (value: string) => {
    const response = await getAddress(value);

    if (response) {
      setValue("address", response.logradouro);
      setValue("city", response.localidade);
      setValue("state", response.uf);
      setUf(response.uf);
      setValue("district", response.bairro);
    }
  }, []);

  const deleteAddress = useCallback(async () => {
    setIsLoadingDelete(true);
    const response = await deleteUserAddress({ id: addressData.id });

    if (response.result === "success") {
      toast.show(response.message, {
        type: "success",
        placement: "top",
      });
      setIsOpen(false);
      refresh();
    } else {
      toast.show(response.message, {
        type: "danger",
        placement: "top",
      });
    }
    setIsLoadingDelete(false);
  }, [addressData, toast, refresh]);

  return (
    <View style={styles.overlaySearch}>
      <StatusBar style="light" />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <LottieView
            source={require("../../../../assets/images/loading-driver.json")}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <GilroyText style={styles.title}>Editar endereço</GilroyText>

          <ScrollView style={styles.formContainer}>
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputCustom
                  onBlur={onBlur}
                  value={value}
                  disabled={isLoading}
                  onChangeText={(e) => {
                    onChange(e);
                  }}
                  isInvalid={!!errors.name}
                  errorMessage={String(errors.name?.message)}
                  placeholder="Nome"
                />
              )}
            />
            <Controller
              name="zipcode"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputCustom
                  onBlur={onBlur}
                  value={value}
                  disabled={isLoading}
                  onChangeText={async (e) => {
                    onChange(e);
                    setValue("zipcode", cepMask(e));
                    const clearValue = removedMask(e);
                    if (clearValue.length === 8) {
                      await handleGetAddress(clearValue);
                    }
                  }}
                  isInvalid={!!errors.zipcode}
                  errorMessage={String(errors.zipcode?.message)}
                  placeholder="CEP"
                  keyboardType="numeric"
                />
              )}
            />
            <Controller
              name="address"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputCustom
                  onBlur={onBlur}
                  value={value}
                  disabled={isLoading}
                  onChangeText={(e) => {
                    onChange(e);
                  }}
                  isInvalid={!!errors.address}
                  errorMessage={String(errors.address?.message)}
                  placeholder="Rua"
                />
              )}
            />
            <View style={styles.containerInLine}>
              <Controller
                name="district"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputCustom
                    onBlur={onBlur}
                    value={value}
                    disabled={isLoading}
                    onChangeText={(e) => {
                      onChange(e);
                    }}
                    styles={{
                      container: styles.inputInContainerInLine,
                    }}
                    isInvalid={!!errors.district}
                    errorMessage={String(errors.district?.message)}
                    placeholder="Bairro"
                  />
                )}
              />
              <Controller
                name="address_number"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputCustom
                    onBlur={onBlur}
                    disabled={isLoading}
                    value={String(value)}
                    onChangeText={(e) => {
                      onChange(Number(e));
                    }}
                    styles={{ container: { width: 140 } }}
                    isInvalid={!!errors.address_number}
                    errorMessage={String(errors.address_number?.message)}
                    placeholder="Número"
                    keyboardType="numeric"
                  />
                )}
              />
            </View>

            <View style={styles.selectContainer}>
              <SelectItems
                options={statesOfBrazil.map((e) => ({
                  label: `${e.code} |  ${e.name}`,
                  value: e.code,
                  showValue: `${e.code}`,
                }))}
                onSelect={handleSelect}
                placeholder="Estado"
                value={uf}
                isInvalid={!!errors.state}
                errorMessage={String(errors.state?.message)}
                styles={{
                  styleList: { minWidth: 200, height: 200 },
                  styleContent: {
                    width: 134,
                  },
                }}
              />
              <Controller
                name="city"
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInputCustom
                    onBlur={onBlur}
                    value={value}
                    disabled={isLoading}
                    styles={{
                      container: styles.inputInContainerInLine,
                    }}
                    onChangeText={(e) => {
                      onChange(e);
                    }}
                    isInvalid={!!errors.city}
                    errorMessage={String(errors.city?.message)}
                    placeholder="Cidade"
                  />
                )}
              />
            </View>
            <Controller
              name="complement"
              control={control}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInputCustom
                  onBlur={onBlur}
                  value={value || ""}
                  disabled={isLoading}
                  onChangeText={(e) => {
                    onChange(e);
                  }}
                  isInvalid={!!errors.complement}
                  errorMessage={String(errors.complement?.message)}
                  placeholder="Complemento"
                />
              )}
            />
          </ScrollView>

          <Button
            mode="contained"
            buttonColor="#FFE924"
            style={{ marginTop: 12, marginBottom: 12 }}
            onPress={handleSubmit((e) => onSubmit(e))}
            textColor="#000"
            loading={isLoading}
            disabled={isLoadingDelete}
            contentStyle={isLoadingDelete && { backgroundColor: "#dbc505" }}
          >
            <GilroyText style={{ color: "#000" }}>Editar endereço</GilroyText>
          </Button>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Button
              mode="outlined"
              onPress={() => {
                setIsOpen(false);
              }}
              disabled={isLoading || isLoadingDelete}
              style={{ width: "50%" }}
            >
              <GilroyText style={{ color: "#fff" }} weight="bold">
                Voltar
              </GilroyText>
            </Button>
            <Button
              mode="contained"
              buttonColor="#ff0000"
              onPress={deleteAddress}
              disabled={isLoading}
              loading={isLoadingDelete}
              style={{ width: "48%" }}
            >
              <GilroyText style={{ color: "#fff" }} weight="bold">
                Deletar
              </GilroyText>
            </Button>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlaySearch: {
    position: "absolute",
    flex: 1,
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: "#1C2129",
  },
  container: {
    marginTop: 90,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    height: "85%",
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 12,
    backgroundColor: "#313a49",
  },
  suggestionItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
  },
  textSuggestionItem: {
    color: "#fff",
    fontSize: 22,
  },
  telephone: {
    color: "#c3c3c3",
    fontSize: 14,
  },
  title: {
    fontSize: 24,
    color: "#ffffff",
    marginBottom: 24,
    textAlign: "center",
  },
  contentDataUser: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  suggestionItemActive: {
    backgroundColor: "#ffffff20",
  },
  formContainer: {
    flexDirection: "column",
    width: "100%",
    gap: 16,
    zIndex: 1,
  },
  containerInLine: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  inputInContainerInLine: {
    width: "100%",
    flex: 1,
  },
  selectContainer: {
    flexDirection: "row",
    width: "100%",
    zIndex: 999,
    gap: 16,
  },
});
