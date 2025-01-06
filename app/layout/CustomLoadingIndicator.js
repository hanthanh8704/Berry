// CustomLoadingIndicator.js
import React from "react";
import { View, Image, StyleSheet } from "react-native";

const CustomLoadingIndicator = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/gif/loading.gif")}
        style={styles.gifImage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gifImage: {
    width: 200, // Adjust the width as needed
    height: 200, // Adjust the height as needed
  },
});

export default CustomLoadingIndicator;
