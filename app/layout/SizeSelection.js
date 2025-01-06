import React from "react";
import { HStack, Pressable, Text } from "native-base";
import IconFeather from "react-native-vector-icons/Feather";

export default function SizeSelection({
  product,
  navigation,
  arrMap,
  i,
  setArrMap,
}) {
  const maxColorsToShow = 3;

  const renderSizeButtons = () => {
    const sizesToRender = product.duplicate.sizes
      .slice(0, maxColorsToShow)
      .sort((a, b) => a.size - b.size);
    return sizesToRender.map((size, index) => (
      <Pressable
        key={"sizeSelect" + index}
        onPress={() => {
          let preArrMap = [...arrMap];
          preArrMap[i] = { ...preArrMap[i], ...size };
          setArrMap(preArrMap);
        }}
        style={{
          transform: [{ scale: 1.03 }],
          padding: 1,
          borderWidth: 1,
          borderColor: "black",
        }}>
        <HStack
          style={{
            height: 16,
            width: 20,
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            fontWeight: "bold",
            textAlign: "center",
            color: product.size === size.size ? "white" : "black",
            backgroundColor: product.size === size.size ? "black" : "white",
          }}>
          <Text
            fontSize={10}
            fontWeight="bold"
            textAlign="center"
            color={product.size === size.size ? "white" : "black"}
            backgroundColor={product.size === size.size ? "black" : "white"}>
            {size.size}
          </Text>
        </HStack>
      </Pressable>
    ));
  };

  return (
    <HStack space={1} marginLeft={1}>
      {renderSizeButtons()}
      {product.duplicate.sizes.length > maxColorsToShow && (
        <Pressable
          onPress={() =>
            navigation.navigate("ProductDetails", {
              id: product.id,
            })
          }
          style={{
            transform: [{ scale: 1.03 }],
            padding: 1,
            borderWidth: 1,
            borderColor: "black",
          }}>
          <HStack
            style={{
              height: 16,
              width: 20,
              alignItems: "center",
              justifyContent: "center",
              fontSize: 10,
              fontWeight: "bold",
              textAlign: "center",
              color: "black",
              backgroundColor: "white",
            }}>
            <IconFeather name="more-horizontal" size={10} color={"black"} />
          </HStack>
        </Pressable>
      )}
    </HStack>
  );
}
