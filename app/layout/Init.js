import React, { useEffect, useState } from "react";
import clientApi from "../api/clientApi";
import Loading from "../layout/Loading";
import { useDispatch, useSelector } from "react-redux";
import { url } from "../service/url";
import { Stomp } from "@stomp/stompjs";
import * as encoding from "text-encoding";
import SockJS from "sockjs-client";
import uuid from "react-native-uuid";
import { GetOrder, removeOrder, setOrder } from "../service/slices/orderSilce";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Box, Button, HStack, Heading, useToast } from "native-base";
import { formatCurrency } from "../service/formatCurrency";
import { GetStaff } from "../service/slices/staffSilce";
import Spinner from "react-native-loading-spinner-overlay";
import CustomLoadingIndicator from "./CustomLoadingIndicator";
import { GetLoading } from "../service/slices/loadingSilce";

var stompClient = null;
const idApp = uuid.v4();
export default function Init({ children }) {
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({});
  const dispatch = useDispatch();
  const idBill = useSelector(GetOrder);
  const idStaff = useSelector(GetStaff);
  const load = useSelector(GetLoading);
  const toast = useToast();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await clientApi.check();
        const urlSocket = url + "/shoes-websocket-endpoint";
        stompClient = Stomp.over(() => new SockJS(urlSocket));
        stompClient.reconnect_delay = 5000;
        stompClient.connect({}, () => {
          console.log("Keest noi thanh cong");
          stompClient.subscribe(`/topic/app-online/${idApp}`, (message) => {
            const data = JSON.parse(message.body);
            if (data.idOrder === null) {
              toast.show({
                render: () => {
                  return (
                    <Box bg="red.600" px="2" py="1" rounded="sm" mb={5}>
                      <Text style={{ color: "white" }}>
                        Mất kết nối, vui lòng thử lại!
                      </Text>
                    </Box>
                  );
                },
              });
            }
            dispatch(setOrder(data.idOrder));
          });
          stompClient.subscribe(`/topic/app-comfirm/${idApp}`, (message) => {
            const data = JSON.parse(message.body);
            setModalData(data);
            setModalVisible(true);
          });
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (idBill && idStaff) {
        stompClient.send(
          `/topic/web-online/${idStaff}`,
          {},
          JSON.stringify({ idBill: idBill, idStaff: idStaff, isConnect: false })
        );
        dispatch(removeOrder());
      }
      stompClient.disconnect();
    };
  }, []);

  const closeModal = () => {
    setModalVisible(false);
  };

  if (loading) {
    return <Loading />;
  }
  return (
    <>
      {console.log(load)}
      <Spinner visible={load} customIndicator={<CustomLoadingIndicator />} />
      {children}
      {isModalVisible && idBill && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}>
          <View style={styles.modalBackground}>
            <View style={styles.modalContent}>
              <Heading color={"green.400"} pb={2} textAlign={"center"}>
                Xác nhận đặt hàng
              </Heading>
              <View
                style={{
                  marginVertical: 5,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  Tổng tiền hàng:
                </Text>
                <Text
                  style={{ fontWeight: "bold", fontSize: 15, color: "red" }}>
                  {formatCurrency(modalData.data.totalMoney)}
                </Text>
              </View>
              <View
                style={{
                  marginVertical: 5,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  Giảm giá:
                </Text>
                <Text
                  style={{ fontWeight: "bold", fontSize: 15, color: "red" }}>
                  {formatCurrency(modalData.data.moneyReduce)}
                </Text>
              </View>
              <View
                style={{
                  marginVertical: 5,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  Hình thức nhận:
                </Text>
                <Text
                  style={{ fontWeight: "bold", fontSize: 15, color: "red" }}>
                  {modalData.data.type === 0 ? "Tại cửa hàng" : "Giao hàng"}
                </Text>
              </View>
              {modalData.data.type === 1 && (
                <>
                  <View
                    style={{
                      marginVertical: 5,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                      Người nhận:
                    </Text>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        color: "red",
                      }}>
                      {modalData.data.fullName}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginVertical: 5,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                      Địa chỉ:
                    </Text>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        color: "red",
                      }}>
                      {modalData.data.address}
                    </Text>
                  </View>
                  <View
                    style={{
                      marginVertical: 5,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}>
                    <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                      Phí ship:
                    </Text>
                    <Text
                      style={{
                        fontWeight: "bold",
                        fontSize: 15,
                        color: "red",
                      }}>
                      {formatCurrency(modalData.data.moneyShip)}
                    </Text>
                  </View>
                </>
              )}
              <View
                style={{
                  marginVertical: 5,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                  Tổng tiền:
                </Text>
                <Text
                  style={{ fontWeight: "bold", fontSize: 15, color: "red" }}>
                  {formatCurrency(modalData.data.moneyAfter)}
                </Text>
              </View>
              {modalData.giaoDich.length > 0 && (
                <View style={{ marginTop: 5 }}>
                  {modalData.giaoDich.map((e) => {
                    return (
                      <Text
                        key={e.id}
                        style={{
                          fontWeight: "bold",
                          fontSize: 15,
                          color: "red",
                        }}>
                        Đã trả {formatCurrency(e.customerAmount)} -{" "}
                        {e.paymentMethod === 1
                          ? "Tiền mặt"
                          : "Chuyển khoản - Mã giao dịch: " + e.transactionCode}
                      </Text>
                    );
                  })}
                </View>
              )}
              <HStack space={3} mt={5} justifyContent={"flex-end"}>
                <Button
                  colorScheme={"red"}
                  variant={"subtle"}
                  onPress={() => {
                    closeModal();
                    stompClient.send(
                      `/topic/bill-comfirm/${idBill}`,
                      {},
                      JSON.stringify(false)
                    );
                  }}>
                  Từ chối
                </Button>
                <Button
                  colorScheme={"orange"}
                  variant={"subtle"}
                  onPress={() => {
                    closeModal();
                    stompClient.send(
                      `/topic/bill-comfirm/${idBill}`,
                      {},
                      JSON.stringify(true)
                    );
                  }}>
                  Đồng ý
                </Button>
              </HStack>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    padding: 10,
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 400,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  spinnerTextStyle: {
    color: "#FFF",
  },
});

export function getStomptClient() {
  return stompClient;
}
export function getIdApp() {
  return idApp;
}
