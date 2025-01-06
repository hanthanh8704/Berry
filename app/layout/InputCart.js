import { Box, HStack, Text, useToast } from "native-base";
import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";
import useDebounce from "../service/useDebounce";
import clientApi from "../api/clientApi";

export default function InputCart({ cart, inputQuantityBillDetail, totalSum }) {
  const [quantity, setQuantity] = useState(cart.quantity);
  const debouncedValue = useDebounce(quantity, 500);

  useEffect(() => {
    if (quantity !== cart.quantity) {
      check(quantity);
    }
  }, [debouncedValue]);

  async function check(quantity) {
    const numericValue = Number(quantity);
    const numericValue2 = Number(cart.quantity);
    if (!isNaN(numericValue) && numericValue >= 1) {
      const res = await clientApi.checkQuantiy(
        cart.id,
        numericValue - numericValue2
      );
      if (res.data) {
        inputQuantityBillDetail(cart.idBillDetail, cart.id, numericValue, cart);
      } else {
        setQuantity(cart.quantity);
        toastError("Số lượng quá số lượng sản phẩm");
      }
    } else {
      setQuantity(cart.quantity);
      toastError("Số lượng phải lớn hơn 0");
    }
  }

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

  return (
    <HStack style={{ height: 25, marginTop: 3 }}>
      <TouchableOpacity
        style={{
          ...styles.button,
          backgroundColor: quantity <= 1 ? "gray" : "#f2741f",
        }}
        onPress={() => {
          if (!quantity <= 1) {
            setQuantity(parseInt(quantity) - 1);
          }
        }}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <TextInput
        onChangeText={(e) => {
          setQuantity(e);
        }}
        value={quantity + ""}
        style={styles.input}
        keyboardType="numeric"
      />
      <TouchableOpacity
        style={{
          ...styles.button,
          backgroundColor: Number(totalSum) >= 500000000 ? "gray" : "#f2741f",
        }}
        onPress={() => {
          if (!(Number(totalSum) >= 500000000)) {
            setQuantity(parseInt(quantity) + 1);
          }
        }}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </HStack>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: 5,
    width: 50,
    fontSize: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  button: {
    padding: 8,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
  },
});
