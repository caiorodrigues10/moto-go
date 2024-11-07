import { NewAddress } from "@/components/pages/address/newAddress";
import { UpdateAddress } from "@/components/pages/address/updateAddress";
import { getUserAddress } from "@/services/users";
import { IUserAddress } from "@/services/users/types";
import LottieView from "lottie-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { ActivityIndicator, Button, Divider } from "react-native-paper";
import { useToast } from "react-native-toast-notifications";
import { GilroyText } from "../../components/GilroyText";
import { BodyPage, View } from "../../components/Themed";

export default function AddressList() {
  const [newAddress, setNewAddress] = useState(false);
  const [updateAddress, setUpdateAddress] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [address, setAddress] = useState([] as IUserAddress[]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [addressData, setAddressData] = useState({} as IUserAddress);

  const toast = useToast();

  const fetchAddress = useCallback(
    async (page: number) => {
      if (page === 1) setIsLoading(true);
      setIsLoadingMore(page > 1);
      const response = await getUserAddress({ page, limit: 10 });

      if (response?.result === "success") {
        if (page === 1) {
          setAddress(response.data?.list || []);
        } else {
          setAddress((prev) => [...prev, ...(response.data?.list || [])]);
        }

        if (response.data?.list?.length === 0) {
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

  const loadMoreAddress = () => {
    if (!isLoadingMore && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    fetchAddress(page);
  }, [page]);

  const refreshAddresses = useCallback(() => {
    setPage(1);
    fetchAddress(1);
  }, [fetchAddress]);

  return (
    <>
      <BodyPage style={styles.bodyPage}>
        <GilroyText style={styles.title}>Meus endereços</GilroyText>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <LottieView
              source={require("../../assets/images/loading-driver.json")}
              autoPlay
              loop
              style={{ width: 200, height: 200 }}
            />
          </View>
        ) : (
          <>
            <FlatList
              data={address}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.addressItem}
                  onPress={() => {
                    setAddressData(item);
                    setUpdateAddress(true);
                  }}
                >
                  <GilroyText style={styles.addressTitle} weight="medium">
                    {item.name}
                  </GilroyText>
                  <GilroyText style={styles.addressText}>
                    {item.district}, {item.address}, {item.address_number} -{" "}
                    {item.city}-{item.state}
                  </GilroyText>
                </TouchableOpacity>
              )}
              onEndReached={loadMoreAddress}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                isLoadingMore ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : null
              }
              ItemSeparatorComponent={() => (
                <Divider style={styles.separator} />
              )}
            />

            <Button
              mode="outlined"
              style={styles.addButton}
              onPress={() => {
                setNewAddress(true);
              }}
            >
              <GilroyText style={styles.addButtonText}>
                + Adicionar nova localidade
              </GilroyText>
            </Button>
          </>
        )}
      </BodyPage>
      {newAddress && (
        <NewAddress setIsOpen={setNewAddress} refresh={refreshAddresses} />
      )}
      {updateAddress && (
        <UpdateAddress
          refresh={refreshAddresses}
          addressData={addressData}
          setIsOpen={setUpdateAddress}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  bodyPage: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
  },
  addressItem: {
    paddingVertical: 16,
    gap: 4,
  },
  addressTitle: {
    fontSize: 18,
    color: "#FFE924",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 16,
    color: "#ffffff",
  },
  separator: {
    height: 2,
    backgroundColor: "#ffffff50",
    marginBottom: 12,
  },
  addButton: {
    marginBottom: 24,
    borderColor: "#FFE924",
    borderWidth: 1,
    borderRadius: 24,
    alignSelf: "center",
    width: "100%",
  },
  addButtonText: {
    color: "#FFE924",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
