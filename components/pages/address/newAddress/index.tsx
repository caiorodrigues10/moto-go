import { GilroyText } from "@/components/GilroyText";
import { SelectItems } from "@/components/SelectItems";
import { TextInputCustom } from "@/components/TextInputCustom";
import { View } from "@/components/Themed";
import { statesOfBrazil } from "@/constants/states";
import { getAddress } from "@/providers/getAddressByCEP";
import { cepMask, removedMask } from "@/providers/maskProviders";
import { createUserAddress } from "@/services/users";
import { ICreateUserAddress } from "@/services/users/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet } from "react-native";
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
  complement: z.string().optional(),
});

export function NewAddress({
  setIsOpen,
  refresh,
}: {
  setIsOpen: (val: boolean) => void;
  refresh: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [uf, setUf] = useState("");

  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ICreateUserAddress>({
    resolver: zodResolver(schema),
  });

  const onSubmit = useCallback(
    async (data: ICreateUserAddress) => {
      setIsLoading(true);

      const response = await createUserAddress(data);

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
    [toast, refresh]
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

  return (
    <View style={styles.overlaySearch}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <GilroyText style={styles.title}>Novo endereço</GilroyText>

        <View style={styles.formContainer}>
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
              render={({ field: { onChange, onBlur } }) => (
                <TextInputCustom
                  onBlur={onBlur}
                  disabled={isLoading}
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
        </View>

        <Button
          mode="contained"
          buttonColor="#FFE924"
          style={{ marginTop: 12, marginBottom: 12 }}
          onPress={handleSubmit((e) => onSubmit(e))}
        >
          <GilroyText style={{ color: "#000" }}>Cadastrar endereço</GilroyText>
        </Button>
        <Button
          mode="outlined"
          onPress={() => {
            setIsOpen(false);
          }}
          style={{ width: "100%" }}
        >
          <GilroyText style={{ color: "#fff" }} weight="bold">
            Voltar
          </GilroyText>
        </Button>
      </View>
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
