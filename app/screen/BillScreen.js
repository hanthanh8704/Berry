import {
  Badge,
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  Image,
  Input,
  ScrollView,
  Text,
  VStack,
  useToast,
} from "native-base";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from "react-native";

import IconMaterialIcons from "react-native-vector-icons/MaterialIcons";
import IconAntDesign from "react-native-vector-icons/AntDesign";
import { formatCurrency } from "./../service/formatCurrency";
import clientApi from "../api/clientApi";

import { useDispatch, useSelector } from "react-redux";
import { GetCode, removeCode, setCode } from "../service/slices/codeSilce";
import { GetOrder, removeOrder } from "../service/slices/orderSilce";
import { getIdApp, getStomptClient } from "../layout/Init";
import { GetStaff, setStaff } from "../service/slices/staffSilce";
import {
  removeOrderDetailSlice,
  selectOrderDetailSlice,
  setOrderDetailSlice,
} from "../service/slices/orderDetailSlice";
import InputCart from "../layout/InputCart";

export default function BillScreen({ navigation }) {
  const orderCode = useSelector(GetCode);
  const idBill = useSelector(GetOrder);
  const dispatch = useDispatch();
  const listProductDetailBill = useSelector(selectOrderDetailSlice);
  const [refreshing, setRefreshing] = useState(false);

  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    const discountAmount = (discountPercentage / 100) * originalPrice;
    const discountedPrice = originalPrice - discountAmount;
    return discountedPrice;
  };

  const increaseQuantityBillDetail = async (
    idBillDetail,
    idPrDetail,
    currentQuantity
  ) => {
    try {
      const updatedQuantity = parseInt(currentQuantity) + 1;
      const response = await clientApi.increaseQuantityBillDetail(
        idBillDetail,
        idPrDetail,
        updatedQuantity
      );
      if (response.status === 200) {
        let dataUpdate = null;
        dispatch(
          setOrderDetailSlice(
            listProductDetailBill.map((e) => {
              if (e.idBillDetail === idBillDetail) {
                dataUpdate = { ...e, quantity: "" + updatedQuantity };
                return dataUpdate;
              }
              return e;
            })
          )
        );
        if (dataUpdate) {
          updateWeb({ method: "PUT", data: dataUpdate });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const inputQuantityBillDetail = (
    idBillDetail,
    idPrDetail,
    quantity,
    cart
  ) => {
    let sum = 0;
    if (cart.value) {
      sum = calculateDiscountedPrice(cart.price, cart.value) * quantity;
    } else {
      sum = cart.price * quantity;
    }
    if (Number(sum) < 500000000) {
      clientApi
        .inputQuantityBillDetail(idBillDetail, idPrDetail, quantity)
        .then((response) => {
          if (response.status === 200) {
            let dataUpdate = null;
            dispatch(
              setOrderDetailSlice(
                listProductDetailBill.map((e) => {
                  if (e.idBillDetail === idBillDetail) {
                    dataUpdate = { ...e, quantity: "" + quantity };
                    return dataUpdate;
                  }
                  return e;
                })
              )
            );
            if (dataUpdate) {
              updateWeb({ method: "PUT", data: dataUpdate });
            }
          }
        });
    } else {
      toastError("Vượt quá số lượng cho phép");
    }
  };

  const rollBackQuantityProductDetail = async (idBill, idPrDetail) => {
    try {
      const response = await clientApi.rollBackQuantityProductDetail(
        idBill,
        idPrDetail
      );
      if (response.status === 200) {
        toast.show({
          render: () => {
            return (
              <Box bg="green.300" px="2" py="1" rounded="sm" mb={5}>
                Bạn đã bỏ sản phẩm ra thành công!
              </Box>
            );
          },
        });
        fectchProductBillSell(idBill);
        updateWeb({ method: "DELETE", id: idPrDetail });
      }
    } catch (error) {
      toast.show({
        render: () => {
          return (
            <Box bg="red.300" px="2" py="1" rounded="sm" mb={5}>
              Bạn đã bỏ sản phẩm ra thất bại!
            </Box>
          );
        },
      });
      console.error(error);
    }
  };

  const handleInputChange = (text) => {
    dispatch(setCode(text));
  };

  useEffect(() => {
    if (idBill) {
      fectchProductBillSell(idBill);
    } else {
      dispatch(removeCode());
    }
  }, [idBill, refreshing]);

  const toast = useToast();

  function toastError(mess) {
    toast.show({
      render: () => {
        return (
          <Box bg="red.600" px="2" py="1" rounded="sm" mb={5}>
            <Text color={"white"}>{mess}</Text>
          </Box>
        );
      },
    });
  }

  const handlePress = async () => {
    try {
      const response = await clientApi.getBillOrder(orderCode);
      console.log(response);
      if (response.status === 200) {
        if (response.data.success) {
          const data = response.data.data;
          send(data, true);
          setTimeout(() => {
            if (idBill !== null) {
              toast.show({
                render: () => {
                  return (
                    <Box bg="red.600" px="2" py="1" rounded="sm" mb={5}>
                      <Text color={"white"}>
                        Nhân viên bán hàng không phản hồi, vui lòng thử lại sau!
                      </Text>
                    </Box>
                  );
                },
              });
            }
          }, 5000);
        } else {
          toast.show({
            render: () => {
              return (
                <Box bg="orange.300" px="2" py="1" rounded="sm" mb={5}>
                  Không tìm thấy đơn hàng nào. Vui lòng liên hệ nhân viên bán
                  hàng!
                </Box>
              );
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
    setRefreshing(false);
  };

  const fectchProductBillSell = (id) => {
    clientApi
      .getProductDetailBill(id)
      .then((response) => {
        dispatch(setOrderDetailSlice(response.data.data));
      })
      .finally(() => {
        setRefreshing(false);
      });
  };

  useEffect(() => {
    let stompClient;

    const subscribeToTopic = (id) => {
      stompClient = getStomptClient();
      stompClient.subscribe(`/topic/app-load/${id}`, (message) => {
        if (message.body) {
          const data = JSON.parse(message.body);
          if (data.appLoad) {
            fectchProductBillSell(id);
          }
        }
      });
    };

    if (idBill) {
      subscribeToTopic(idBill);
    }

    return () => {
      if (stompClient) {
        stompClient.unsubscribe(`/topic/app-load/${idBill}`);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idBill]);

  function send(data, isConnect) {
    const mess = {
      idApp: getIdApp(),
      idBill: data.idBill,
      isConnect: isConnect,
    };
    getStomptClient().send(
      `/topic/web-online/${data.idStaff}`,
      {},
      JSON.stringify(mess)
    );
    dispatch(setStaff(data.idStaff));
  }

  function updateWeb(data) {
    if (idBill) {
      getStomptClient().send(
        `/topic/online-bill/${idBill}`,
        {},
        JSON.stringify(data)
      );
    }
  }

  const idStaff = useSelector(GetStaff);

  const totalSum = listProductDetailBill.reduce((sum, cart) => {
    if (cart.value) {
      return (
        sum + calculateDiscountedPrice(cart.price, cart.value) * cart.quantity
      );
    } else {
      return sum + cart.price * cart.quantity;
    }
  }, 0);

  return (
    <View style={{ backgroundColor: "white", height: "100%" }}>
      <View style={styles.container}>
        <HStack space={1} style={{ margin: 10 }}>
          <Input
            isDisabled={idBill}
            InputLeftElement={
              <IconMaterialIcons
                name="search"
                style={{
                  marginRight: -10,
                  marginLeft: 5,
                  fontSize: 25,
                  color: "#f2741f",
                }}
              />
            }
            bgColor={"gray"}
            focusOutlineColor={"white"}
            colorScheme={"gray"}
            variant="filled"
            h={"10"}
            w={"75%"}
            value={orderCode}
            placeholder="Tìm kiếm theo số điện thoại hoặc mã đơn hàng..."
            onChangeText={(text) => handleInputChange(text)}
          />
          <Button
            w={"25%"}
            colorScheme={"red"}
            variant={"subtle"}
            onPress={() => {
              if (idBill) {
                send({ idBill: idBill, idStaff: idStaff }, false);
                dispatch(removeCode());
                dispatch(removeOrder());
              } else {
                handlePress();
              }
            }}>
            {idBill ? (
              <Text>
                <IconAntDesign name="disconnect" /> Thay đổi
              </Text>
            ) : (
              <Text>
                <IconAntDesign name="search1" /> Kiểm tra
              </Text>
            )}
          </Button>
        </HStack>
      </View>
      <Divider />
      {idBill ? (
        <View>
          <View style={{ height: "82%" }}>
            <ScrollView
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    setRefreshing(true);
                  }}
                />
              }
              style={{ backgroundColor: "white" }}>
              {listProductDetailBill.length > 0 &&
                listProductDetailBill.map((cart, index) => {
                  return (
                    <HStack
                      key={"cart" + index}
                      space={1}
                      style={{
                        paddingTop: 15,
                        paddingLeft: 10,
                        paddingRight: 10,
                      }}>
                      <View>
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("ProductDetails", {
                              id: cart.id,
                            })
                          }>
                          <Image
                            source={{
                              uri: cart.image,
                            }}
                            alt="anh"
                            style={{
                              height: 100,
                              width: 100,
                              borderRadius: 20,
                              position: "relative",
                            }}
                          />
                        </TouchableOpacity>
                        {cart.value && (
                          <Box
                            style={{
                              left: 5,
                              top: 5,
                              position: "absolute",
                              backgroundColor:
                                cart.value >= 1 && cart.value <= 50
                                  ? "#66CC00"
                                  : cart.value >= 51 && cart.value <= 80
                                  ? "#FF9900"
                                  : "#FF0000",
                              borderRadius: 10,
                            }}>
                            <Text
                              style={{
                                paddingLeft: 3,
                                paddingRight: 3,
                                textAlign: "center",
                                color: "white",
                              }}>
                              {cart.value}%
                            </Text>
                          </Box>
                        )}
                      </View>
                      <VStack p={2}>
                        <View style={{ height: 25 }}>
                          <Text
                            style={{
                              fontWeight: "bold",
                              fontSize: 20,
                              lineHeight: 30,
                              width: 200,
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail">
                            {cart.nameProduct}
                          </Text>
                        </View>
                        <View style={{ height: 25, marginTop: 3 }}>
                          {cart.value ? (
                            <HStack>
                              <Text
                                fontSize={15}
                                style={{
                                  color: "gray",
                                  fontWeight: "bold",
                                  textDecorationLine: "line-through",
                                }}>
                                {formatCurrency(cart.price)}
                              </Text>
                              <Text
                                fontSize={15}
                                style={{
                                  color: "red",
                                  fontWeight: "bold",
                                }}>
                                &nbsp;
                                {`${formatCurrency(
                                  calculateDiscountedPrice(
                                    cart.price,
                                    cart.value
                                  )
                                )}`}
                              </Text>
                            </HStack>
                          ) : (
                            <Text
                              fontSize={17}
                              style={{
                                color: "red",
                                fontWeight: "bold",
                              }}>
                              {formatCurrency(cart.price)}
                            </Text>
                          )}
                        </View>
                        <InputCart
                          totalSum={totalSum}
                          cart={cart}
                          inputQuantityBillDetail={inputQuantityBillDetail}
                        />
                      </VStack>
                      <VStack p={3} style={{ flex: 1, alignItems: "flex-end" }}>
                        <View style={{ height: 25, marginTop: -3 }}>
                          <TouchableOpacity
                            onPress={() =>
                              rollBackQuantityProductDetail(idBill, cart.id)
                            }
                            style={{
                              width: 20,
                              height: 20,
                              backgroundColor: "red",
                              borderRadius: 5,
                            }}>
                            <IconMaterialIcons
                              name="delete"
                              style={{
                                lineHeight: 20,
                                textAlign: "center",
                                fontSize: 15,
                                color: "white",
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                        <View
                          style={{ height: 25, marginTop: 2, marginBottom: 5 }}>
                          <HStack>
                            <Text
                              style={{
                                fontWeight: "bold",
                                fontSize: 15,
                                lineHeight: 25,
                                color: "gray",
                              }}>
                              Size:
                            </Text>
                            <Text
                              style={{
                                color: "gray",
                                fontSize: 15,
                                lineHeight: 25,
                              }}>
                              {" " + cart.size}
                            </Text>
                          </HStack>
                        </View>
                        <View
                          style={{ height: 25, marginTOp: 3, marginLeft: -80 }}>
                          <Text
                            fontSize={17}
                            style={{
                              color: "red",
                              fontWeight: "bold",
                            }}>
                            {cart.value
                              ? formatCurrency(
                                  calculateDiscountedPrice(
                                    cart.price,
                                    cart.value
                                  ) * cart.quantity
                                )
                              : formatCurrency(cart.price * cart.quantity)}
                          </Text>
                        </View>
                      </VStack>
                    </HStack>
                  );
                })}
            </ScrollView>
          </View>
          <Divider />
          <View style={{ height: "10%", padding: 15 }}>
            <View>
              <View
                style={{
                  marginVertical: 5,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                  Tổng tiền hàng
                </Text>
                <Text
                  style={{ fontWeight: "bold", fontSize: 20, color: "red" }}>
                  {formatCurrency(totalSum)}
                </Text>
              </View>
              <Text
                style={{
                  marginTop: 5,
                  padding: 10,
                  fontSize: 17,
                  fontWeight: "300",
                  textAlign: "center",
                  fontStyle: "italic",
                  color: "red",
                }}>
                Trên đây chỉ tổng giá tiền của sản phẩm, số tiền cần thanh toán
                có thể thay đổi dựa vào phí ship hoặc giảm giá..!
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={{ flex: 1, alignItems: "center", padding: 10 }}>
          <Image
            mt={5}
            source={require("../assets/image/check-order.jpg")}
            alt="check"
          />
          <Heading mt={3} textAlign={"center"}>
            Thiết bị không tồn tại đơn hàng nào. Vui lòng tìm kiếm!
          </Heading>
          <Text mt={3} textAlign={"center"} style={{ fontStyle: "italic" }}>
            Quý khách có thể tìm kiếm theo số điện thoại hoặc mã hóa đơn do nhân
            viên bán hàng cung cấp. Nếu cần hỗ trợ vui lòng liên hệ nhân viên
            bán hàng để được giải đáp. Trân trọng!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  container: {
    alignItems: "center",
    padding: 8,
    paddingTop: 5,
    paddingBottom: 5,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
});
