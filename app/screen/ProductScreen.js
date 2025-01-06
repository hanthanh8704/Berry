import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import IconFontAwesome5 from "react-native-vector-icons/FontAwesome5";
import IconMaterialIcons from "react-native-vector-icons/MaterialIcons";
import clientApi from "../api/clientApi";
import CartProduct from "../component/CartProduct";
import { HStack, Input } from "native-base";
import FillterProduct from "../component/FillterProduct";
import Sekeleton from "../layout/Sekeleton";

export default function ProductScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState({
    brand: [],
    material: [],
    color: [],
    sole: [],
    lstSize: [],
    category: [],
    minPrice: null,
    maxPrice: null,
    nameProductDetail: null,
  });

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    fetchData(filter);
  }, [filter]);

  async function fetchData(filter) {
    setLoading(true);
    const result = await clientApi.getAllProduct(filter);
    setProducts(
      result.data.data.map((e) => {
        return {
          ...e,
          image: e.image.split(","),
        };
      })
    );
    setLoading(false);
    setRefreshing(false);
  }

  const [inputValue, setInputValue] = useState(null);

  const handleEnterPress = () => {
    setFilter({ ...filter, nameProductDetail: inputValue });
  };

  const [listBrand, setListBrand] = useState([]);
  const [listMaterial, setListMaterial] = useState([]);
  const [listColor, setListColor] = useState([]);
  const [listSole, setListSole] = useState([]);
  const [listCategory, setListCategory] = useState([]);
  const [listSize, setListSize] = useState([]);

  useEffect(() => {
    clientApi.getBrand().then((response) => {
      setListBrand(response.data.data);
    });
    clientApi.getMaterial().then((response) => {
      setListMaterial(response.data.data);
    });
    clientApi.getColor().then((response) => {
      setListColor(response.data.data);
    });
    clientApi.getSole().then((response) => {
      setListSole(response.data.data);
    });
    clientApi.getCategory().then((response) => {
      setListCategory(response.data.data);
    });
    clientApi.getSize().then((response) => {
      setListSize(response.data.data);
    });
  }, []);

  return (
    <View style={{ backgroundColor: "white", height: "100%" }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              fetchData(filter);
              setRefreshing(true);
            }}
          />
        }
        style={{ paddingBottom: 150 }}>
        <FillterProduct
          onClose={closeModal}
          isOpen={isModalVisible}
          listCategory={listCategory}
          listBrand={listBrand}
          listMaterial={listMaterial}
          listSole={listSole}
          listSize={listSize}
          listColor={listColor}
          filter={filter}
          setFilter={setFilter}
        />
        <View style={{ marginTop: 10 }}>
          <HStack style={{ margin: 10 }}>
            <Input
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
              w={"90%"}
              placeholder="Tìm kiếm sản phẩm..."
              onChangeText={(text) => setInputValue(text)}
              onSubmitEditing={handleEnterPress}
            />
            <IconFontAwesome5
              onPress={() => setModalVisible(true)}
              style={{
                fontSize: 25,
                color: "#f2741f",
                textAlign: "center",
                lineHeight: 40,
                width: "10%",
              }}
              name="filter"
            />
          </HStack>
          {loading ? (
            <Sekeleton />
          ) : (
            <CartProduct
              setLoading={setLoading}
              products={products}
              navigation={navigation}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
}
