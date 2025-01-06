import React from "react";
import { Text } from "react-native";
export default function PriceProduct({ product }) {
  const calculateDiscountedPrice = (originalPrice, discountPercentage) => {
    const discountAmount = (discountPercentage / 100) * originalPrice;
    const discountedPrice = originalPrice - discountAmount;
    return discountedPrice;
  };

  return (
    <Text
      style={{
        marginLeft: 5,
      }}>
      {product.value ? (
        <Text>
          <Text
            style={{
              textDecorationLine: "line-through",
              color: "gray",
              fontSize: 16,
            }}>
            {`${product.price.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })} `}
          </Text>
          <Text
            style={{
              color: "red",
              fontWeight: "bold",
              fontSize: 16,
            }}>
            {` ${calculateDiscountedPrice(
              product.price,
              product.value
            ).toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            })} `}
          </Text>
        </Text>
      ) : (
        <Text
          style={{
            color: "red",
            fontWeight: "bold",
            fontSize: 16,
          }}>
          {`${product.price.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })} `}
        </Text>
      )}
    </Text>
  );
}
