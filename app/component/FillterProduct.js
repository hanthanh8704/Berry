import {
  Actionsheet,
  Center,
  Checkbox,
  ScrollView,
  Text,
  View,
} from "native-base";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import IconMaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function FillterProduct({
  isOpen,
  onClose,
  listCategory,
  filter,
  setFilter,
  listBrand,
  listMaterial,
  listSole,
  listSize,
  listColor,
}) {
  const [selectCategory, setSelectCategory] = useState([]);
  const [selectBrand, setSelectBrand] = useState([]);
  const [selectMaterial, setSelectMaterial] = useState([]);
  const [selectSole, setSelectSole] = useState([]);
  const [selectColor, setSelectColor] = useState([]);
  const [selectSize, setSelectSize] = useState([]);

  const handleCheckBoxCategory = (id) => {
    const selectedIndex = selectCategory.indexOf(id);
    let newSelectedIds = [];

    if (selectedIndex === -1) {
      newSelectedIds = [...selectCategory, id];
    } else {
      newSelectedIds = [
        ...selectCategory.slice(0, selectedIndex),
        ...selectCategory.slice(selectedIndex + 1),
      ];
    }
    setSelectCategory(newSelectedIds);
    setFilter({ ...filter, category: newSelectedIds });
  };

  const handleCheckBoxBrand = (id) => {
    const selectedIndex = selectBrand.indexOf(id);
    let newSelectedIds = [];

    if (selectedIndex === -1) {
      newSelectedIds = [...selectBrand, id];
    } else {
      newSelectedIds = [
        ...selectBrand.slice(0, selectedIndex),
        ...selectBrand.slice(selectedIndex + 1),
      ];
    }
    setSelectBrand(newSelectedIds);
    setFilter({ ...filter, brand: newSelectedIds });
  };

  const handleCheckBoxMaterial = (id) => {
    const selectedIndex = selectMaterial.indexOf(id);
    let newSelectedIds = [];

    if (selectedIndex === -1) {
      newSelectedIds = [...selectMaterial, id];
    } else {
      newSelectedIds = [
        ...selectMaterial.slice(0, selectedIndex),
        ...selectMaterial.slice(selectedIndex + 1),
      ];
    }
    setSelectMaterial(newSelectedIds);
    setFilter({ ...filter, material: newSelectedIds });
  };

  const handleCheckBoxSole = (id) => {
    const selectedIndex = selectSole.indexOf(id);
    let newSelectedIds = [];

    if (selectedIndex === -1) {
      newSelectedIds = [...selectSole, id];
    } else {
      newSelectedIds = [
        ...selectSole.slice(0, selectedIndex),
        ...selectSole.slice(selectedIndex + 1),
      ];
    }
    setSelectSole(newSelectedIds);
    setFilter({ ...filter, sole: newSelectedIds });
  };

  const handleCheckBoxColor = (id) => {
    const selectedIndex = selectColor.indexOf(id);
    let newSelectedIds = [];

    if (selectedIndex === -1) {
      newSelectedIds = [...selectColor, id];
    } else {
      newSelectedIds = [
        ...selectColor.slice(0, selectedIndex),
        ...selectColor.slice(selectedIndex + 1),
      ];
    }
    setSelectColor(newSelectedIds);
    setFilter({ ...filter, color: newSelectedIds });
  };

  const handleCheckBoxSize = (id) => {
    const selectedIndex = selectSize.indexOf(id);
    let newSelectedIds = [];

    if (selectedIndex === -1) {
      newSelectedIds = [...selectSize, id];
    } else {
      newSelectedIds = [
        ...selectSize.slice(0, selectedIndex),
        ...selectSize.slice(selectedIndex + 1),
      ];
    }
    setSelectSize(newSelectedIds);
    setFilter({ ...filter, lstSize: newSelectedIds });
  };

  return (
    <Center>
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <ScrollView w={"100%"} h={450}>
            <View mt={2} mx={5}>
              <Text style={styles.headingText}> Loại giày</Text>
              {listCategory.map((lf) => (
                <Checkbox
                  colorScheme={"orange"}
                  my={3}
                  size={"sm"}
                  ml={2}
                  defaultIsChecked={selectCategory.includes(lf.id)}
                  onPress={() => handleCheckBoxCategory(lf.id)}
                  key={"checkbox" + lf.id}>
                  {lf.name}
                </Checkbox>
              ))}
            </View>
            <View mt={2} mx={5}>
              <Text style={styles.headingText}> Thương hiệu</Text>
              {listBrand.map((lf) => (
                <Checkbox
                  colorScheme={"orange"}
                  my={3}
                  size={"sm"}
                  ml={2}
                  defaultIsChecked={selectBrand.includes(lf.id)}
                  onPress={() => handleCheckBoxBrand(lf.id)}
                  key={"checkbox" + lf.id}>
                  {lf.name}
                </Checkbox>
              ))}
            </View>
            <View mt={2} mx={5}>
              <Text style={styles.headingText}> Chất liệu</Text>
              {listMaterial.map((lf) => (
                <Checkbox
                  colorScheme={"orange"}
                  my={3}
                  size={"sm"}
                  ml={2}
                  defaultIsChecked={selectMaterial.includes(lf.id)}
                  onPress={() => handleCheckBoxMaterial(lf.id)}
                  key={"checkbox" + lf.id}>
                  {lf.name}
                </Checkbox>
              ))}
            </View>
            <View mt={2} mx={5}>
              <Text style={styles.headingText}> Đế giày</Text>
              {listSole.map((lf) => (
                <Checkbox
                  colorScheme={"orange"}
                  my={3}
                  size={"sm"}
                  ml={2}
                  defaultIsChecked={selectSole.includes(lf.id)}
                  onPress={() => handleCheckBoxSole(lf.id)}
                  key={"checkbox" + lf.id}>
                  {lf.name}
                </Checkbox>
              ))}
            </View>
            <View mt={2} mx={5}>
              <Text style={styles.headingText}> Kích cỡ</Text>
              {listSize.map((lf) => (
                <Checkbox
                  colorScheme={"orange"}
                  my={3}
                  size={"sm"}
                  ml={2}
                  defaultIsChecked={selectSize.includes(lf.id)}
                  onPress={() => handleCheckBoxSize(lf.id)}
                  key={"checkbox" + lf.id}>
                  {lf.size}
                </Checkbox>
              ))}
            </View>
            <View mt={2} mx={5}>
              <Text style={styles.headingText}> Màu sắc</Text>
              <View style={styles.colorContainer}>
                {listColor.map((lf) => (
                  <TouchableOpacity
                    key={lf.id}
                    style={[styles.colorButton, { backgroundColor: lf.code }]}
                    onPress={() => handleCheckBoxColor(lf.id)}>
                    {selectColor.includes(lf.id) && (
                      <IconMaterialCommunityIcons
                        name="check"
                        type="material"
                        color="white"
                        size={18}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </Actionsheet.Content>
      </Actionsheet>
    </Center>
  );
}

const styles = StyleSheet.create({
  listItemContainer: {
    paddingVertical: 5,
  },
  checkboxContainer: {
    padding: 0,
  },
  headingText: {
    fontSize: 25,
    fontWeight: "bold",
    lineHeight: 50,
  },
  colorContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  colorButton: {
    marginRight: 10,
    width: 40,
    height: 40,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  textFilter: {
    fontSize: 18,
    color: "green",
    fontWeight: "bold",
  },
  inputField: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  textFilter: {
    fontSize: 20,
    color: "#f2741f",
    fontWeight: "900",
  },
  closeButton: {
    width: 80,
    height: 30,
    borderRadius: 5,
    borderColor: "gray",
    borderWidth: 2,
  },
  closeButtonText: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
    lineHeight: 26,
  },
});
