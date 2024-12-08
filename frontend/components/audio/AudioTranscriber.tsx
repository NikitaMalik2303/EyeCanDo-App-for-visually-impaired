import React, { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import { transcribeSpeech } from "./transcribeSpeech";
import { recordSpeech } from "./recordSpeech";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Alert, Linking } from "react-native";
import { InitVoiceIconComponent } from "@/styles/eye.styles";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { setFacing, setIsStreaming } from "@/store/talk.slice";
import Toast from "react-native-root-toast";
import { COLORS } from "@/constants/color_wheel";
import * as Speech from "expo-speech";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetOnlineVolunteer } from "@/services/auth.services";

const AudioTranscriber = () => {
  const dispatch = useDispatch();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);
  const audioRecordingRef = useRef<Audio.Recording>(new Audio.Recording());
  const webAudioPermissionsRef = useRef<MediaStream | null>(null);
  const { facing } = useSelector((state: any) => state.talking);
  console.log({ isRecording, isTranscribing });
  const router = useRouter();

  // Request mic access if needed
  useEffect(() => {
    const getMicAccess = async () => {
      try {
        const permissions = await navigator.mediaDevices?.getUserMedia({
          audio: true,
        });
        if (permissions) webAudioPermissionsRef.current = permissions;
      } catch (error) {
        console.error("Error accessing microphone:", error);
        Toast.show("Microphone access denied!", {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: COLORS.error,
          textColor: COLORS.primaryText,
        });
      }
    };

    if (!webAudioPermissionsRef.current) {
      getMicAccess();
    }

    return () => {
      // Cleanup tracks when component unmounts
      if (webAudioPermissionsRef.current) {
        webAudioPermissionsRef.current
          .getTracks()
          .forEach((track) => track.stop());
        webAudioPermissionsRef.current = null;
      }
    };
  }, []); // Removed navigator.mediaDevices from dependency array

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
      } else {
        console.log("Address not found");
      }
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

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
      console.log("Token:", token);
      const res = await GetOnlineVolunteer(token);
      console.log("Online volunteers:", res);
      const phoneNumber = res?.phoneNumber;

      // Make a FaceTime call to the volunteer
      makeFaceTimeCall(phoneNumber);
    } catch (error) {
      console.error("Error getting online volunteers:", error);
    }
  };

  const actionBasedOnTranscription = (transcript: string) => {
    console.log("Transcript:", transcript);

    if (!transcript) {
      const message = "Could not hear you, please speak again!";
      Speech.speak(message);
      Toast.show(message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: COLORS.error,
        textColor: COLORS.primaryText,
      });
      return;
    }

    const lowerTranscript = transcript.toLowerCase();

    // Define a command map with keywords and corresponding actions
    const commandMap = [
      {
        keywords: ["dashboard"],
        action: () => {
          const msg = "Navigating to dashboard";
          Speech.speak(msg);
          router.push("/dashboard");
          Toast.show(msg, {
            duration: Toast.durations.LONG,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: COLORS.success,
            textColor: COLORS.primaryText,
          });
        },
      },
      {
        keywords: ["add", "contact"],
        action: () => {
          const msg = "Navigating to add contact";
          Speech.speak(msg);
          router.push("/add");
          Toast.show(msg, {
            duration: Toast.durations.LONG,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: COLORS.success,
            textColor: COLORS.primaryText,
          });
        },
      },
      {
        keywords: ["directory"],
        action: () => {
          const msg = "Navigating to Directory";
          Speech.speak(msg);
          router.push("/(tabs)/directory");
          Toast.show(msg, {
            duration: Toast.durations.LONG,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: COLORS.success,
            textColor: COLORS.primaryText,
          });
        },
      },
      {
        keywords: ["settings"],
        action: () => {
          const msg = "Navigating to settings";
          Speech.speak(msg);
          router.push("/settings");
          Toast.show(msg, {
            duration: Toast.durations.LONG,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: COLORS.success,
            textColor: COLORS.primaryText,
          });
        },
      },
      {
        keywords: ["stop", "cancel", "exit"],
        action: () => {
          const msg = "Stopping stream";
          Speech.speak(msg);
          dispatch(setIsStreaming(false));
          Toast.show(msg, {
            duration: Toast.durations.LONG,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: COLORS.error,
            textColor: COLORS.primaryText,
          });
        },
      },
      {
        keywords: ["start", "camera"],
        action: () => {
          const msg = "Starting stream";
          Speech.speak(msg);
          router.push("/(tabs)/eye-home");
          dispatch(setIsStreaming(true));
          Toast.show(msg, {
            duration: Toast.durations.LONG,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: COLORS.success,
            textColor: COLORS.primaryText,
          });
        },
      },
      {
        keywords: ["face", "who", "home"],
        action: () => {
          const msg = "Navigating to home";
          Speech.speak(msg);
          router.push("/(tabs)/eye-home");
          Toast.show(msg, {
            duration: Toast.durations.LONG,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: COLORS.success,
            textColor: COLORS.primaryText,
          });
        },
      },
      {
        keywords: ["object", "detect", "identify", "outdoor"],
        action: () => {
          const msg = "Navigating to outdoor view";
          Speech.speak(msg);
          router.push("/(tabs)/eye-outdoor");
          Toast.show(msg, {
            duration: Toast.durations.LONG,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: COLORS.success,
            textColor: COLORS.primaryText,
          });
        },
      },
      {
        keywords: ["depth", "obstacle", "street"],
        action: () => {
          const msg = "Navigating to street view";
          Speech.speak(msg);
          router.push("/(tabs)/eye-street");
          Toast.show(msg, {
            duration: Toast.durations.LONG,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: COLORS.success,
            textColor: COLORS.primaryText,
          });
        },
      },
      {
        keywords: ["flip", "switch", "toggle"],
        action: () => {
          const newFacing = facing === "back" ? "front" : "back";
          const msg = `Flipped camera to ${newFacing} facing`;
          Speech.speak(msg);
          router.push("/(tabs)/eye-home");
          dispatch(setFacing(newFacing));
          Toast.show("Flipped camera facing", {
            duration: Toast.durations.LONG,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: COLORS.success,
            textColor: COLORS.primaryText,
          });
        },
      },
      {
        keywords: ["where", "am", "i"],
        action: () => {
          const msg = "Finding your location, please wait...";
          getAddress();
          Toast.show(msg, {
            duration: Toast.durations.LONG,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: COLORS.success,
            textColor: COLORS.primaryText,
          });
        },
      },
      {
        keywords: ["call", "volunteer", "emergency", "help"],
        action: () => {
          const msg = "Calling for help!";
          Speech.speak(msg);
          Toast.show(msg, {
            duration: Toast.durations.LONG,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: COLORS.success,
            textColor: COLORS.primaryText,
          });
          handleCallVolunteer()
            .then(() => {
              console.log("Calling for help...");
            })
            .catch((error) => {
              console.error("Error calling for help:", error);
            });
        },
      },
    ];

    // Iterate through the command map to find a matching command
    for (const command of commandMap) {
      if (
        command.keywords.some((keyword) => lowerTranscript.includes(keyword))
      ) {
        command.action();
        return;
      }
    }

    // Default response for unrecognized commands
    const defaultMsg = "Command not recognized. Please try again.";
    Speech.speak(defaultMsg);
    Toast.show(defaultMsg, {
      duration: Toast.durations.LONG,
      position: Toast.positions.TOP,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor: COLORS.error,
      textColor: COLORS.primaryText,
    });
  };

  // Function to start recording
  const startRecording = async () => {
    try {
      // Initialize the recording
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Toast.show("Permission to access microphone denied!", {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: COLORS.error,
          textColor: COLORS.primaryText,
        });

        return;
      }
      setIsRecording(true);

      await recordSpeech(
        audioRecordingRef,
        setIsRecording,
        !!webAudioPermissionsRef.current
      );

      Toast.show("Recording started...", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        backgroundColor: COLORS.success,
        textColor: COLORS.primaryText,
      });
    } catch (error) {
      console.error("Failed to start recording:", error);
      Toast.show("Failed to start recording!", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: COLORS.error,
        textColor: COLORS.primaryText,
      });
    }
  };

  // Function to stop recording and transcribe the audio
  const stopRecordingAndTranscribe = async () => {
    try {
      if (!audioRecordingRef.current) return;

      setIsRecording(false);
      setIsTranscribing(true);
      Toast.show("Transcribing...", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        backgroundColor: COLORS.success,
        textColor: COLORS.primaryText,
      });

      const transcript = await transcribeSpeech(audioRecordingRef);
      console.log("Transcript:", transcript);
      setIsTranscribing(false);
      actionBasedOnTranscription(transcript);
    } catch (error) {
      console.error("Failed to stop recording or transcribe:", error);
      setIsRecording(false);
      setIsTranscribing(false);
      Toast.show("Failed to transcribe audio!", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: COLORS.error,
        textColor: COLORS.primaryText,
      });
    }
  };

  // Handler for the toggle button
  const handlePress = () => {
    if (isRecording) {
      stopRecordingAndTranscribe();
    } else {
      startRecording();
    }
  };

  return (
    <InitVoiceIconComponent
      icon={() => (
        <MaterialCommunityIcons
          name={isRecording ? "microphone-off" : "microphone"}
          size={20}
          color="white"
        />
      )}
      onPress={handlePress} // Toggle recording on press
      disabled={isTranscribing} // Disable button while transcribing
      style={styles.iconButton}
    />
  );
};

const styles = StyleSheet.create({
  iconButton: {
    // Add any additional styling if needed
  },
});

export default AudioTranscriber;
