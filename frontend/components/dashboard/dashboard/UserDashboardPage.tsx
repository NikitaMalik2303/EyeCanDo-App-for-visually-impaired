import {
  CardButton,
  CardButtonContainer,
  CardButtonText,
  DashboardHeaderContainer,
  DashboardPageContainer,
  DashboardQuickLinksContainer,
  DashboardTitleContainer,
  HeaderContainer,
  HeaderText,
  HeaderTitle,
  ProfileContainer,
  SafeAreaView,
  StepsCard,
  StepsContent,
  StepsCount,
  StepsKey,
  VolunteerButton,
  VolunteerButtonDanger,
} from "@/styles/dashbaord.styles";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Avatar, Icon } from "react-native-paper";
import PieChart from "react-native-pie-chart";
import { Pedometer } from "expo-sensors";
import { COLORS } from "@/constants/color_wheel";
import { Alert, Linking } from "react-native";
import * as Location from "expo-location";
import * as Speech from "expo-speech";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetOnlineVolunteer } from "@/services/auth.services";
import Toast from "react-native-root-toast";

const widthAndHeight = 150;
const sliceColor = ["#14B8A6", "#333"];

const UserDashboardPage = () => {
  const router = useRouter();
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();

    if (isAvailable) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);

      const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
      if (pastStepCountResult) {
        setPastStepCount(pastStepCountResult.steps);
      }

      return Pedometer.watchStepCount((result) => {
        setCurrentStepCount(result.steps);
      });
    }
  };

  const getAddress = async () => {
    try {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Location permission is required.");
        return;
      }

      Speech.speak("Getting your current location please wait.");
      // Get current location
      let location = await Location.getCurrentPositionAsync({});
      console.log("Location:", location);

      // Extract latitude and longitude
      const { latitude, longitude } = location.coords;

      // Reverse geocode to get address
      let address = await Location.reverseGeocodeAsync({
        latitude: latitude,
        longitude: longitude,
      });

      if (address.length > 0) {
        console.log("Address:", address[0]);
        // Convert latitude and longitude to string and speak it out
        const message = `Your current are in ${
          address[0].name
        }. Your current location is latitude ${latitude.toFixed(
          4
        )} and longitude ${longitude.toFixed(4)}`;
        Speech.speak(message);
        Toast.show(message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: COLORS.secondaryBackground,
          textColor: COLORS.primaryText,
        });
      } else {
        console.log("Address not found");
      }
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  useEffect(() => {
    const subscription = subscribe();
    // return () => subscription
  }, []);

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

  const handleCallVolunteer = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await GetOnlineVolunteer(token);

      const phoneNumber = res?.phoneNumber;

      // Make a FaceTime call to the volunteer
      makeFaceTimeCall(phoneNumber);
    } catch (error) {
      console.error("Error getting online volunteers:", error);
    }
  };

  return (
    <SafeAreaView>
      <HeaderContainer>
        <DashboardHeaderContainer>
          <DashboardTitleContainer>
            <HeaderText>{moment().format("LL")}</HeaderText>
            <HeaderTitle>Dashboard</HeaderTitle>
          </DashboardTitleContainer>
          <ProfileContainer>
            <TouchableOpacity onPress={() => router.push("/settings")}>
              <Avatar.Icon
                size={36}
                icon={() => <Feather name="user" size={24} color="#000" />}
              />
            </TouchableOpacity>
          </ProfileContainer>
        </DashboardHeaderContainer>
        <DashboardPageContainer>
          <StepsCard>
            <PieChart
              widthAndHeight={widthAndHeight}
              series={[
                pastStepCount + currentStepCount,
                10000 - (pastStepCount + currentStepCount),
              ]}
              sliceColor={sliceColor}
              coverRadius={0.7}
              coverFill={"transparent"}
            />
            <StepsContent>
              <StepsCount>{pastStepCount + currentStepCount}</StepsCount>
              <StepsKey>STEPS</StepsKey>
            </StepsContent>
          </StepsCard>
        </DashboardPageContainer>
        <DashboardQuickLinksContainer>
          <HeaderText>Quick Links</HeaderText>
          <CardButtonContainer>
            <TouchableOpacity onPress={() => router.push("/eye-home")}>
              <CardButton>
                <Icon
                  source={() => (
                    <MaterialCommunityIcons
                      name="face-recognition"
                      size={20}
                      color="white"
                    />
                  )}
                  size={20}
                />
                <CardButtonText>Home mode</CardButtonText>
              </CardButton>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/eye-street")}>
              <CardButton>
                <Icon
                  source={() => (
                    <MaterialCommunityIcons
                      name="alert"
                      size={20}
                      color="white"
                    />
                  )}
                  size={20}
                />
                <CardButtonText>Street mode</CardButtonText>
              </CardButton>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/eye-outdoor")}>
              <CardButton>
                <Icon
                  source={() => (
                    <MaterialCommunityIcons
                      name="information-outline"
                      size={20}
                      color="white"
                    />
                  )}
                  size={20}
                />
                <CardButtonText>Outdoor mode</CardButtonText>
              </CardButton>
            </TouchableOpacity>
          </CardButtonContainer>
        </DashboardQuickLinksContainer>

        <DashboardPageContainer>
          <VolunteerButton
            labelStyle={{
              color: COLORS.primaryText,
              fontSize: 16,
              fontWeight: 600,
              width: "100%",
            }}
            onPress={getAddress} // Attach the getAddress function to this button
          >
            Where am I?
          </VolunteerButton>
          <VolunteerButtonDanger
            labelStyle={{
              color: COLORS.primaryText,
              fontSize: 16,
              fontWeight: 600,
              width: "100%",
            }}
            onPress={handleCallVolunteer} // Attach the getAddress function to this button
          >
            Call a Volunteer
          </VolunteerButtonDanger>
        </DashboardPageContainer>
      </HeaderContainer>
    </SafeAreaView>
  );
};

export default UserDashboardPage;
