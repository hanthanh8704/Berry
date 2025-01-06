import { HStack, Skeleton, VStack } from "native-base";
import React from "react";

const Load = () => {
  return (
    <VStack
      w="48%"
      borderWidth="1"
      space={2}
      overflow="hidden"
      rounded="md"
      _dark={{
        borderColor: "coolGray.500",
      }}
      _light={{
        borderColor: "coolGray.200",
      }}>
      <Skeleton h="40" />
      <Skeleton.Text px="4" py="5" />
    </VStack>
  );
};

export default function Sekeleton() {
  return (
    <VStack space={2} mx={3}>
      <HStack space={2}>
        <Load />
        <Load />
      </HStack>
      <HStack space={2}>
        <Load />
        <Load />
      </HStack>
      <HStack space={2}>
        <Load />
        <Load />
      </HStack>
    </VStack>
  );
}
