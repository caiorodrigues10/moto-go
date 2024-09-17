import { GilroyText } from "@/components/GilroyText";
import { View } from "@/components/Themed";
import { useAppContext } from "@/context/AppContext";
import { phoneMask } from "@/providers/maskProviders";
import { getDrivers } from "@/services/drivers";
import { IDriver } from "@/services/drivers/types";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, TouchableOpacity } from "react-native";
import { ActivityIndicator, Button } from "react-native-paper";
import { useToast } from "react-native-toast-notifications";

export function SelectDriver() {
  const [isLoading, setIsLoading] = useState(false);
  const [drivers, setDrivers] = useState([] as IDriver[]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<number | null>(null);

  const { setIsOpenSelectDriver, setVisibleModalConfirmService, setDriver } =
    useAppContext();

  const toast = useToast();

  const fetchDrivers = useCallback(
    async (page: number) => {
      if (page === 1) setIsLoading(true);
      setIsLoadingMore(page > 1);
      const response = await getDrivers({ page, limit: 10 });

      if (response.result === "success") {
        if (page === 1) {
          setDrivers(response.data?.list || []);
        } else {
          setDrivers((prevDrivers) => [
            ...prevDrivers,
            ...(response.data?.list || []),
          ]);
        }

        if (response.data?.list?.length === 0) {
          setHasMore(false);
        }
      } else {
        toast.show(response.message, {
          type: "danger",
          placement: "top",
        });
      }

      setIsLoading(false);
      setIsLoadingMore(false);
    },
    [toast]
  );

  useEffect(() => {
    fetchDrivers(page);
  }, [page]);

  const loadMoreDrivers = () => {
    if (!isLoadingMore && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <View style={styles.overlaySearch}>
      <StatusBar style="light" />
      <View style={styles.container}>
        <GilroyText style={styles.title} weight="bold">
          Escolha um motorista
        </GilroyText>
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
          <FlatList
            data={drivers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={
                  selectedDriver === item.id
                    ? [styles.suggestionItem, styles.suggestionItemActive]
                    : styles.suggestionItem
                }
                onPress={() => {
                  setDriver(item);
                  setSelectedDriver(item.id);
                }}
              >
                <View style={styles.contentDataUser}>
                  <Image
                    src={item?.profile_picture || ""}
                    style={styles.image}
                  />
                  <View
                    style={{
                      gap: 8,
                      maxWidth: "70%",
                      width: "100%",
                      marginLeft: 16,
                    }}
                  >
                    <GilroyText
                      style={styles.textSuggestionItem}
                      weight="medium"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item?.name}
                    </GilroyText>
                    <GilroyText style={styles.telephone}>
                      {phoneMask(item?.telephone)}
                    </GilroyText>
                  </View>
                </View>
                <GilroyText style={{ color: "#c3c3c3", marginRight: 12 }}>
                  5km
                </GilroyText>
              </TouchableOpacity>
            )}
            onEndReached={loadMoreDrivers}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isLoadingMore ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : null
            }
          />
        )}

        {selectedDriver && (
          <Button
            mode="contained"
            buttonColor="#FFE924"
            style={{ marginTop: "auto", marginBottom: 12 }}
            onPress={() => {
              setIsOpenSelectDriver(false);
              setVisibleModalConfirmService(true);
            }}
          >
            <GilroyText style={{ color: "#000" }}>
              Escolher motorista
            </GilroyText>
          </Button>
        )}
        <Button
          mode="contained"
          buttonColor="#ff0000"
          onPress={async () => {
            setIsOpenSelectDriver(false);
            setVisibleModalConfirmService(true);
            setDriver({} as IDriver);
          }}
          style={{ width: "100%" }}
        >
          <GilroyText style={{ color: "#fff" }} weight="bold">
            Cancelar
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
    marginTop: 100,
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
    textAlign: "center",
    paddingBottom: 24,
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
});
