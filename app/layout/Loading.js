import React from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

export default function Loading() {
  return (
    <View style={styles.splashContainer}>
      <Image
        source={require("../assets/splash.png")}
        style={styles.splashImage}
      />
      <ActivityIndicator size="large" color="#f2741f" />
      <Text style={styles.loadingText}>Đang tải, vui lòng đợi!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff", // Background color
  },
  splashImage: {
    width: 600,
    height: 600,
    resizeMode: "contain",
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    color: "#f2741f",
    fontWeight: "bold",
  },
});
