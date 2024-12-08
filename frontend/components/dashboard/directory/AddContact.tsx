import React, { useEffect, useRef, useState } from "react";
import { Button, Snackbar } from "react-native-paper";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import {
  CameraContainer,
  InputContainer,
  FlipCameraButton,
  ScanButton,
  TextInputField,
  CameraContainerBackground,
} from "@/styles/directory.styles";
import BackButton from "@/components/button/BackButton";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { COLORS } from "@/constants/color_wheel";
import io, { Socket } from "socket.io-client";
import * as ImageManipulator from "expo-image-manipulator";
import {
  HeaderContainer,
  HeaderNavigation,
  HeaderTitle,
  SafeAreaView,
} from "@/styles/dashbaord.styles";
import { BACKEND_URL } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddContactPage = () => {
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, requestPermission] = useCameraPermissions();
  const [name, setName] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Convert isScanning to a useRef
  const isScanningRef = useRef(false);

  console.log({
    cameraReady,
    scanning: isScanningRef.current,
  });
  const cameraRef = useRef<CameraView>(null);
  const socket = useRef<Socket | null>(null);
  const frameCountRef = useRef(0);

  useEffect(() => {
    (async () => {
      console.log("IFFY...");

      const token = await AsyncStorage.getItem("token");

      console.log("Token:", token);
      // Establish WebSocket connection with reconnection options
      socket.current = io(BACKEND_URL, {
        transports: ["websocket"], // Use WebSocket transport only
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        query: {
          token,
        },
      });

      socket.current.on("connect", () => {
        console.log("Connected to server");
      });

      socket.current.on("disconnect", (e) => {
        console.log("Disconnected from server", e);
      });

      socket.current.on("add_person_result", (data) => {
        console.log("Add person result:", data);
        console.log(`Received at ${data.count}`);
        frameCountRef.current = data.count;
        if (data.message === "Person added and model retrained") {
          // setLoading(false);
          setSnackbarMessage("Contact added successfully!");
          setSnackbarVisible(true);
          isScanningRef.current = false; // Update ref
        }
      });

      socket.current.on("connect_error", (error) => {
        console.error("Connection error:", error);
      });

      socket.current.on("reconnect_attempt", () => {
        console.log("Attempting to reconnect...");
      });

      socket.current.on("error", (data) => {
        //   setLoading(false);
        setSnackbarMessage(data.error || "An error occurred");
        setSnackbarVisible(true);
      });
    })();
    return () => {
      console.log("\n\n++++++++++Disconnecting from server...");
      socket.current?.disconnect();
    };
  }, []);

  const handleCreateContact = async () => {
    if (!name.trim()) {
      setSnackbarMessage("Please enter a name");
      setSnackbarVisible(true);
      return;
    }

    isScanningRef.current = true; // Set ref
    // setLoading(true);
    frameCountRef.current = 0;

    // Start capturing and sending frames
    captureAndSendFrame();
  };

  const captureAndSendFrame = async () => {
    console.log("Capturing frame... new");

    if (cameraRef.current && isScanningRef.current && socket.current) {
      console.log("Capturing frame...");
      try {
        // Capture a photo
        const photo = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.3,
          exif: false,
          skipProcessing: true,
        });

        if (!photo) {
          //   setLoading(false);
          console.error("Error capturing frame!!!");
          setSnackbarMessage("Error capturing frame");
          setSnackbarVisible(true);
          isScanningRef.current = false; // Update ref
          return;
        }

        console.log("Sending frame to server...", {
          name: name.trim(),
        });

        const resizedPhoto = await ImageManipulator.manipulateAsync(
          photo.uri,
          [{ resize: { width: 300 } }], // Resize to 300px width
          {
            compress: 0.5,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: true,
          } // Further compress
        );
        console.log("Socket:", socket.current);
        // Send the frame to the server
        socket.current.emit("add_person", {
          name: name.trim(),
          frame: resizedPhoto.base64,
        });

        // Continue sending frames until server responds
        if (frameCountRef.current < 10 && isScanningRef.current) {
          console.log("Frame count:", frameCountRef.current);
          // Wait a short period before capturing the next frame
          setTimeout(captureAndSendFrame, 150);
        }
      } catch (error) {
        console.error("Error capturing or sending frame:", error);
        // setLoading(false);
        console.error("Error capturing frame!!!", error);
        setSnackbarMessage("Error capturing or sending frame");
        setSnackbarVisible(true);
        isScanningRef.current = false; // Update ref
      }
    } else {
      console.log("Camera not ready or scanning stopped.");
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  if (!permission) {
    return (
      <SafeAreaView>
        <HeaderTitle>Requesting for camera permission...</HeaderTitle>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView>
        <HeaderTitle>
          Camera permission is not granted. Please grant the permission to
          continue.
        </HeaderTitle>
        <Button
          labelStyle={{ color: COLORS.primary, fontSize: 16 }}
          onPress={requestPermission}
          style={{
            marginLeft: 0,
            marginRight: "auto",
            marginBottom: 0,
            marginTop: 10,
          }}
        >
          Grant Permission
        </Button>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <HeaderContainer>
            <HeaderNavigation>
              <BackButton>Back</BackButton>
            </HeaderNavigation>
            <HeaderTitle>Add Contact</HeaderTitle>
          </HeaderContainer>

          <CameraContainerBackground
            source={require("@/assets/images/backgrounds/camera-bg.png")}
          >
            <CameraContainer>
              <CameraView
                style={styles.camera}
                facing={facing}
                ref={cameraRef}
                onCameraReady={() => {
                  setCameraReady(true);
                  console.log("Camera is ready!");
                }}
                onMountError={(error) => {
                  console.error("Camera mount error:", error);
                  setSnackbarMessage("Error mounting the camera");
                  setSnackbarVisible(true);
                }}
              >
                <FlipCameraButton
                  icon={() => (
                    <MaterialIcons
                      name="flip-camera-android"
                      size={28}
                      color={"#333"}
                    />
                  )}
                  onPress={toggleCameraFacing}
                />
              </CameraView>

              {loading && (
                <View>
                  <ActivityIndicator size="large" color="#fff" />
                </View>
              )}
            </CameraContainer>
          </CameraContainerBackground>

          <InputContainer>
            <TextInputField 
textColor="#fff"
              label="Name"
              value={name}
              onChangeText={(text) => setName(text)}
              mode="outlined"
              placeholder="Enter Name"
              outlineColor="transparent"
              selectionColor={COLORS.primary}
              outlineStyle={{
                borderRadius: 10,
                borderWidth: 0,
              }}
              theme={{
                colors: { text: "#fff", placeholder: "#888" },
              }}
            />
            <ScanButton
              mode="text"
              labelStyle={{
                color:
                  !cameraReady || isScanningRef.current
                    ? COLORS.secondaryFill
                    : COLORS.primary,
                fontSize: 16,
                fontWeight: "bold",
              }}
              onPress={handleCreateContact}
              disabled={!cameraReady || isScanningRef.current}
            >
              Scan & Save
            </ScanButton>
          </InputContainer>
        </ScrollView>
      </KeyboardAvoidingView>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
        action={{
          label: "OK",
          onPress: () => {
            setSnackbarVisible(false);
          },
        }}
      >
        {snackbarMessage}
      </Snackbar>
    </SafeAreaView>
  );
};

export default AddContactPage;

const styles = StyleSheet.create({
  camera: {
    width: 400,
    height: 400,
    borderRadius: 0,
    position: "relative",
    overflow: "hidden",
  },
});
