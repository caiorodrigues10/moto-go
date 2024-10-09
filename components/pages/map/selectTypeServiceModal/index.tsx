import { GilroyText } from "@/components/GilroyText";
import { useAppContext } from "@/context/AppContext";
import { getServicesType } from "@/services/serviceType";
import { IServiceType } from "@/services/serviceType/types";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, Divider } from "react-native-paper";
import { useToast } from "react-native-toast-notifications";
import Icon from "react-native-vector-icons/FontAwesome";

export default function SelectTypeServiceModal() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const {
    visibleModalConfirmService,
    setVisibleModalConfirmService,
    setTypeService,
    setIsOpenSelectTypeServiceModal,
  } = useAppContext();

  const [typeServices, setTypeServices] = useState([] as IServiceType[]);

  const fetchTypeService = useCallback(async () => {
    setIsLoading(true);
    const response = await getServicesType();

    if (response.result === "success") {
      setTypeServices(response?.data || []);
    } else {
      setTypeServices((prevDrivers) => [
        ...prevDrivers,
        ...(response.data || []),
      ]);

      toast.show(response.message, {
        type: "danger",
        placement: "top",
      });
    }

    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchTypeService();
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visibleModalConfirmService}
      onRequestClose={() => setVisibleModalConfirmService(false)}
    >
      <StatusBar style="light" />

      <TouchableWithoutFeedback
        onPress={() => setVisibleModalConfirmService(false)}
      >
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={styles.modalContent}>
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <GilroyText
            style={{ fontSize: 18, textAlign: "center" }}
            weight="bold"
          >
            Escolher tipo de serviço
          </GilroyText>
          <TouchableOpacity
            onPress={() => setIsOpenSelectTypeServiceModal(false)}
            style={{
              padding: 6,
              paddingHorizontal: 8,
              backgroundColor: "#ffffff20",
              borderRadius: 8,
              marginLeft: "auto",
            }}
          >
            <Icon name="times" size={16} color="#ff5151" />
          </TouchableOpacity>
        </View>
        <Divider />
        <View style={styles.contentAllButtons}>
          <View style={styles.contentButtons}>
            {typeServices.map((e) => (
              <Button
                key={e.id}
                mode="contained-tonal"
                buttonColor="#FFE924"
                onPress={() => {
                  setTypeService(e);
                  setIsOpenSelectTypeServiceModal(false);
                }}
                style={{ width: "48%" }}
              >
                <GilroyText style={{ color: "#000" }}>
                  {e.description}
                </GilroyText>
              </Button>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  modalContent: {
    height: 410,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#1C2129",
  },
  icon: {
    color: "#FFE924",
  },
  buttonMenu: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  containerIcon: {
    borderRadius: 12,
    backgroundColor: "#343f54",
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    width: 48,
  },
  containerIconAndText: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    width: "100%",
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 12,
  },
  contentButtons: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contentAllButtons: {
    display: "flex",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: -24,
    gap: 12,
    paddingVertical: 4,
  },
});
