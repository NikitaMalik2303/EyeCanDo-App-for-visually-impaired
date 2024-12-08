import BackButton from "@/components/button/BackButton";
import { COLORS } from "@/constants/color_wheel";
import { Container, VolunteerButton } from "@/styles/assistance.styles";
import {
  HeaderContainer,
  HeaderNavigation,
  HeaderTitle,
  SafeAreaView,
} from "@/styles/dashbaord.styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React from "react";
import { Button, Alert, Linking } from "react-native";

const AssistancePage = () => {
  const makeFaceTimeCall = async (phoneNumber: any) => {
    // Construct the FaceTime URL scheme
    const facetimeUrl = `facetime:${phoneNumber}`;

    // Check if the phone number is valid
    if (!phoneNumber) {
      Alert.alert("Error", "Please provide a valid phone number.");
      return;
    }

    // Check if FaceTime is available and can open the URL
    const supported = await Linking.canOpenURL(facetimeUrl);
    if (supported) {
      // Open the FaceTime app with the given phone number
      await Linking.openURL(facetimeUrl);
    } else {
      Alert.alert("Error", "FaceTime is not available on this device.");
    }
  };

  return (
    <SafeAreaView>
      <HeaderContainer>
        <HeaderNavigation>
          <BackButton>Back</BackButton>
        </HeaderNavigation>
        <HeaderTitle>Assistance</HeaderTitle>
      </HeaderContainer>
      <Container>
        <VolunteerButton
          onPress={() => makeFaceTimeCall("+918317575133")}
          labelStyle={{
            color: COLORS.primaryText,
            fontSize: 26,
            fontWeight: 700,
            lineHeight: 80,
          }}
        >
          Call a Volunteer
        </VolunteerButton>
      </Container>
    </SafeAreaView>
  );
};

export default AssistancePage;
