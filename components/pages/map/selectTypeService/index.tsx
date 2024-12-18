import { GilroyText } from "@/components/GilroyText";
import { View } from "@/components/Themed";
import { useAppContext } from "@/context/AppContext";
import { getServicesType } from "@/services/serviceType";
import { IServiceType } from "@/services/serviceType/types";
import { useCallback, useEffect, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useToast } from "react-native-toast-notifications";

export default function SelectTypeService() {
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [typeServices, setTypeServices] = useState([] as IServiceType[]);

  const {
    setTypeService,
    setVisibleModalConfirmService,
    clearService,
    setFocusSearch,
    route,
  } = useAppContext();

  const toast = useToast();

  const fetchTypeService = useCallback(
    async (page: number) => {
      if (page === 1) setIsLoading(true);
      setIsLoadingMore(page > 1);
      const response = await getServicesType();

      if (response?.result === "success") {
        if (page === 1) {
          setTypeServices(response?.data || []);
        } else {
          setTypeServices((prevDrivers) => [
            ...prevDrivers,
            ...(response.data || []),
          ]);
        }

        if (response.data?.length === 0) {
          setHasMore(false);
        }
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
      setIsLoadingMore(false);
    },
    [toast]
  );

  useEffect(() => {
    fetchTypeService(page);
  }, [page]);

  const showCancelConfirmation = () => {
    Alert.alert(
      "Confirmação de Cancelamento",
      "Tem certeza que deseja cancelar este serviço?",
      [
        {
          text: "Fechar",
          style: "cancel",
        },
        {
          text: "Cancelar",
          onPress: () => clearService(),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
      <View style={styles.dialogContainer}>
        <View style={styles.dialog}>
          <GilroyText style={styles.label}>
            {route[0] ? "Deseja continuar?" : "Escolha um serviço"}
          </GilroyText>
          <View style={styles.contentButtons}>
            {!route[0] ? (
              typeServices.map((e) => (
                <Button
                  key={e.id}
                  mode="contained-tonal"
                  buttonColor="#FFE924"
                  onPress={() => {
                    setFocusSearch(true);
                    setTypeService(e);
                  }}
                  style={{ width: "48%" }}
                >
                  <GilroyText style={{ color: "#000" }}>
                    {e.description}
                  </GilroyText>
                </Button>
              ))
            ) : (
              <>
                <Button
                  mode="contained"
                  buttonColor="#ff0000"
                  onPress={showCancelConfirmation}
                  style={{ width: "48%" }}
                >
                  <GilroyText style={{ color: "#fff" }} weight="bold">
                    Cancelar
                  </GilroyText>
                </Button>
                <Button
                  mode="contained-tonal"
                  buttonColor="#FFE924"
                  onPress={() => setVisibleModalConfirmService(true)}
                  style={{ width: "50%" }}
                >
                  <GilroyText style={{ color: "#000" }}>Iniciar</GilroyText>
                </Button>
              </>
            )}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  dialogContainer: {
    position: "absolute",
    bottom: 8,
    left: 20,
    right: 20,
    marginBottom: 12,
  },
  dialog: {
    backgroundColor: "#1C1C1E",
    padding: 12,
    paddingBottom: 12,
    borderRadius: 10,
    marginVertical: 10,
  },
  label: {
    color: "#FFF",
    marginBottom: 5,
  },
  contentButtons: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    paddingVertical: 4,
  },
});
