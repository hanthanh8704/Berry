import React from "react";
import { View, TouchableOpacity } from "react-native";
import { isColorDark } from "../service/isColorDark";
import IconFontAwesome from "react-native-vector-icons/FontAwesome";
import IconFeather from "react-native-vector-icons/Feather";

const ColorSelection = ({ product, arrMap, setArrMap, i, navigation }) => {
  const maxColorsToShow = 3;

  const handleColorSelection = (color) => {
    let preArrMap = [...arrMap];
    preArrMap[i] = { ...preArrMap[i], ...color.sizes[0] };
    preArrMap[i].duplicate = color;
    setArrMap(preArrMap);
  };

  const renderColorButtons = () => {
    const colorsToRender = product.duplicates.slice(0, maxColorsToShow);

    return colorsToRender.map((color) => (
      <TouchableOpacity
        key={"colorSelection" + color.idColor}
        onPress={() => handleColorSelection(color)}
        style={{
          marginLeft: 3,
          height: 20,
          width: 20,
          borderRadius: 12.5,
          borderWidth: 1,
          borderColor: isColorDark(color.codeColor) ? color.codeColor : "black",
          backgroundColor: color.codeColor,
          alignItems: "center",
          justifyContent: "center",
        }}>
        {product.idColor === color.idColor && (
          <IconFontAwesome
            name="check"
            size={10}
            color={isColorDark(color.codeColor) ? "white" : "black"}
          />
        )}
      </TouchableOpacity>
    ));
  };

  return (
    <View style={{ flexDirection: "row" }}>
      {renderColorButtons()}
      {product.duplicates.length > maxColorsToShow && (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ProductDetails", {
              id: product.id,
            })
          }
          style={{
            marginLeft: 3,
            height: 20,
            width: 20,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: "black",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <IconFeather name="more-horizontal" size={10} color={"black"} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ColorSelection;
