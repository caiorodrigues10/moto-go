import { GilroyText } from "@/components/GilroyText";
import { useAppContext } from "@/context/AppContext";
import { StatusBar } from "expo-status-bar";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, Divider } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ConfirmService() {
  const { visibleModalConfirmService, setVisibleModalConfirmService } =
    useAppContext();

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
        <GilroyText
          style={{ fontSize: 18, textAlign: "center", marginBottom: 12 }}
          weight="bold"
        >
          Confirmar serviço
        </GilroyText>
        <Divider />
        <View>
          <TouchableOpacity style={styles.buttonMenu}>
            <View style={styles.containerIconAndText}>
              <View style={styles.containerIcon}>
                <Icon name="user" size={30} color="#000" style={styles.icon} />
              </View>
              <GilroyText weight="bold" style={{ fontSize: 16 }}>
                Escolher motorista
              </GilroyText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonMenu}>
            <View style={styles.containerIconAndText}>
              <View style={styles.containerIcon}>
                <Icon name="road" size={24} color="#000" style={styles.icon} />
              </View>
              <GilroyText weight="bold" style={{ fontSize: 16 }}>
                Distância
              </GilroyText>
            </View>
            <GilroyText weight="light" style={{ fontSize: 14 }}>
              5km
            </GilroyText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonMenu}>
            <View style={styles.containerIconAndText}>
              <View style={styles.containerIcon}>
                <Icon
                  name="motorcycle"
                  size={24}
                  color="#000"
                  style={styles.icon}
                />
              </View>
              <GilroyText weight="bold" style={{ fontSize: 16 }}>
                Entrega
              </GilroyText>
            </View>
            <GilroyText weight="light" style={{ fontSize: 14 }}>
              Editar
            </GilroyText>
          </TouchableOpacity>
        </View>
        <Divider />
        <Button
          mode="contained"
          buttonColor="#FFE924"
          style={{ marginTop: "auto", marginBottom: 24 }}
        >
          <GilroyText style={{ color: "#000" }}>Iniciar viagem</GilroyText>
        </Button>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    height: 360,
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
  },
});
