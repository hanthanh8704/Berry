import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, ScrollView, RefreshControl } from "react-native";
import { Button, Title, Subheading } from "react-native-paper";
import clientApi from "../api/clientApi";
import CartProductSelling from "../component/CartProductSelling";
import CartProductNew from "../component/CartProductNew";

import Sekeleton from "../layout/Sekeleton";
import { Heading, StatusBar } from "native-base";
import Swiper from "react-native-swiper";

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [sellingProducts, setSellingProducts] = useState([]);
  const images = [
    "https://storage.pixteller.com/designs/designs-images/2020-12-21/05/sneakers-sport-gym-sale-banner-1-5fe0c474a5fdf.png",
    "https://storage.pixteller.com/designs/designs-images/2020-12-21/05/sport-shoes-sale-banner-1-5fe0c471dbecb.png",
    "https://storage.pixteller.com/designs/designs-images/2020-12-21/05/gym-shoes-sale-banner-1-5fe0c46cc78bc.png",
  ];

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [refreshing]);

  async function fetchData() {
    setLoading(true);
    const dataProduct = await clientApi.getProductHome();
    const dataProductSelling = await clientApi.getSellingProduct();
    setProducts(
      dataProduct.data.data.map((e) => {
        return {
          ...e,
          image: e.image.split(","),
        };
      })
    );
    setSellingProducts(
      dataProductSelling.data.data.map((e) => {
        return {
          ...e,
          image: e.image.split(","),
        };
      })
    );
    setLoading(false);
    setRefreshing(false);
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchData();
          }}
        />
      }
      style={{ backgroundColor: "white" }}>
      <Swiper
        style={{ height: 250 }}
        removeClippedSubviews={false}
        loop
        autoplay
        showsPagination={false}>
        {images.map((image, index) => {
          return (
            <Image
              key={"imagehome" + index}
              source={{ uri: image }}
              alt="anh"
              style={{
                height: "100%",
              }}
            />
          );
        })}
      </Swiper>
      <Heading
        style={{
          textAlign: "center",
          marginVertical: 10,
          fontSize: 50,
          lineHeight: 80,
        }}>
        RUN YOUR RUN
      </Heading>
      <Subheading style={{ textAlign: "center", marginHorizontal: 20 }}>
        Follow the feeling that keeps you running your best in the city
      </Subheading>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          marginVertical: 10,
        }}>
        <Button
          mode="contained"
          style={{ backgroundColor: "black", marginRight: -60 }}>
          Shop Apparel
        </Button>
        <Button
          mode="contained"
          style={{ backgroundColor: "black", marginLeft: -60 }}>
          Shop Apparel
        </Button>
      </View>
      <Title style={{ marginVertical: 10, fontWeight: "bold", marginLeft: 5 }}>
        Trending
      </Title>
      <Image
        source={require("../assets/image/nike-just-do-it.jpg")}
        style={{ width: "100%", height: 200 }}
      />
      <View
        style={{
          marginLeft: 10,
          marginRight: 10,
          marginTop: 25,
          marginBottom: 5,
          alignItems: "center",
        }}>
        <View
          style={{
            backgroundColor: "black",
            padding: 5,
            width: "50%",
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          }}>
          <Text
            style={{
              fontSize: 25,
              textAlign: "center",
              fontWeight: "900",
              color: "white",
            }}>
            Sản phẩm mới
          </Text>
        </View>
        <View
          style={{
            marginTop: -3,
            backgroundColor: "black",
            width: "100%",
            height: 3,
          }}
        />
      </View>
      <View style={{ alignItems: "center", paddingVertical: 10 }}>
        {loading ? (
          <Sekeleton />
        ) : (
          <CartProductNew
            setLoading={setLoading}
            products={products}
            navigation={navigation}
          />
        )}
      </View>
      <View
        style={{
          marginLeft: 10,
          marginRight: 10,
          marginTop: 25,
          marginBottom: 5,
          alignItems: "center",
        }}>
        <View
          style={{
            backgroundColor: "black",
            padding: 5,
            width: "65%",
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
          }}>
          <Text
            style={{
              fontSize: 25,
              textAlign: "center",
              fontWeight: "900",
              color: "white",
            }}>
            Sản phẩm bán chạy
          </Text>
        </View>
        <View
          style={{
            marginTop: -3,
            backgroundColor: "black",
            width: "100%",
            height: 3,
          }}
        />
      </View>
      <View style={{ alignItems: "center", paddingVertical: 10 }}>
        {loading ? (
          <Sekeleton />
        ) : (
          <CartProductSelling
            setLoading={setLoading}
            products={sellingProducts}
            navigation={navigation}
          />
        )}
      </View>
    </ScrollView>
  );
}
