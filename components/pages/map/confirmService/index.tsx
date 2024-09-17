import { GilroyText } from "@/components/GilroyText";
import { useAppContext } from "@/context/AppContext";
import { Coordinate } from "@/services/Coordinate";
import { IDriver } from "@/services/drivers/types";
import { ITypeService } from "@/services/service/types";
import { StatusBar } from "expo-status-bar";
import { useCallback } from "react";
import {
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Button, Divider } from "react-native-paper";
import Icon from "react-native-vector-icons/FontAwesome";

export default function ConfirmService({
  currentLocation,
}: {
  currentLocation: Coordinate | null;
}) {
  const {
    visibleModalConfirmService,
    setVisibleModalConfirmService,
    setIsOpenSelectDriver,
    setDriver,
    setTypeService,
    setRoute,
    setQueryFinal,
    setQueryInitial,
    setDestination,
    setInitial,
    driver,
    queryFinal,
    queryInitial,
    setFocusSearch,
  } = useAppContext();

  const clearService = useCallback(() => {
    setDriver({} as IDriver);
    setTypeService({} as ITypeService);
    setRoute([]);
    setQueryFinal("");
    setQueryInitial("");
    setDestination({} as Coordinate);
    setInitial(currentLocation);
    setVisibleModalConfirmService(false);
  }, [currentLocation]);

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
            Confirmar serviço
          </GilroyText>
          <TouchableOpacity
            onPress={clearService}
            style={{
              padding: 6,
              paddingHorizontal: 8,
              backgroundColor: "#ffffff20",
              borderRadius: 8,
              marginLeft: "auto",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Icon name="trash" size={16} color="#ff5151" />
            <GilroyText style={{ color: "#ff5151" }} weight="bold">
              Limpar
            </GilroyText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setVisibleModalConfirmService(false)}
            style={{
              padding: 6,
              paddingHorizontal: 8,
              backgroundColor: "#ffffff20",
              borderRadius: 8,
              marginLeft: 12,
            }}
          >
            <Icon name="times" size={16} color="#ff5151" />
          </TouchableOpacity>
        </View>
        <Divider />
        <View>
          <TouchableOpacity
            style={styles.buttonMenu}
            onPress={() => {
              setIsOpenSelectDriver(true);
              setVisibleModalConfirmService(false);
            }}
          >
            {driver?.id ? (
              <View
                style={[
                  {
                    width: "100%",
                  },
                  styles.containerIconAndText,
                ]}
              >
                <View style={styles.containerIcon}>
                  <Image
                    src={driver?.profile_picture || ""}
                    style={styles.image}
                  />
                </View>
                <View
                  style={{
                    gap: 4,
                    width: "100%",
                    maxWidth: "70%",
                  }}
                >
                  <GilroyText weight="light" style={{ fontSize: 12 }}>
                    Motorista
                  </GilroyText>
                  <GilroyText
                    weight="bold"
                    style={{ fontSize: 16 }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {driver?.name}
                  </GilroyText>
                </View>
                <Icon
                  name="edit"
                  size={24}
                  style={{ color: "#FFE924", marginLeft: "auto" }}
                />
              </View>
            ) : (
              <View style={styles.containerIconAndText}>
                <View style={styles.containerIcon}>
                  <Icon
                    name="user"
                    size={30}
                    color="#000"
                    style={styles.icon}
                  />
                </View>
                <GilroyText weight="bold" style={{ fontSize: 16 }}>
                  Escolher motorista
                </GilroyText>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonMenu}
            onPress={() => {
              setFocusSearch(true);
              setVisibleModalConfirmService(false);
            }}
          >
            <View style={styles.containerIconAndText}>
              <View style={styles.containerIcon}>
                <Icon
                  name="map-pin"
                  size={24}
                  color="#000"
                  style={styles.icon}
                />
              </View>
              <View
                style={{
                  gap: 4,
                  width: "100%",
                  maxWidth: "70%",
                }}
              >
                <GilroyText weight="light" style={{ fontSize: 12 }}>
                  De:
                </GilroyText>
                <GilroyText
                  weight="bold"
                  style={{ fontSize: 16 }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {queryInitial}
                </GilroyText>
              </View>
              <Icon
                name="edit"
                size={24}
                style={{ color: "#FFE924", marginLeft: "auto" }}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonMenu}
            onPress={() => {
              setFocusSearch(true);
              setVisibleModalConfirmService(false);
            }}
          >
            <View style={styles.containerIconAndText}>
              <View style={styles.containerIcon}>
                <Icon name="flag" size={24} color="#000" style={styles.icon} />
              </View>
              <View
                style={{
                  gap: 4,
                  width: "100%",
                  maxWidth: "70%",
                }}
              >
                <GilroyText weight="light" style={{ fontSize: 12 }}>
                  Para:
                </GilroyText>
                <GilroyText
                  weight="bold"
                  style={{ fontSize: 16 }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {queryFinal}
                </GilroyText>
              </View>
              <Icon
                name="edit"
                size={24}
                style={{ color: "#FFE924", marginLeft: "auto" }}
              />
            </View>
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
            <Icon
              name="edit"
              size={24}
              style={{ color: "#FFE924", marginLeft: "auto" }}
            />
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
    height: 440,
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
});
