import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState, useEffect } from "react";
import { StyleSheet } from "react-native";
import { io, Socket } from "socket.io-client";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  HeaderContainer,
  HeaderNavigation,
  HeaderTitle,
  SafeAreaView,
} from "@/styles/dashbaord.styles";
import BackButton from "@/components/button/BackButton";
import { Button } from "react-native-paper";
import { COLORS } from "@/constants/color_wheel";
import {
  BottomSheetComponent,
  BottomSheetHeaderContainer,
  BottomSheetViewComponent,
  CameraButtonsContainer,
  EyePageContainer,
  Heading,
  IconButtonComponent,
  ResultText,
} from "@/styles/eye.styles";
import { BACKEND_URL } from "@/constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EyePageController from "./EyePageController";
import { useSelector } from "react-redux";
import { setFacing, setIsStreaming } from "@/store/talk.slice";
import { useDispatch } from "react-redux";

export default function EyePage({
  send_channel,
  receive_channel,
  bottomSheetTitle,
}: {
  send_channel: string;
  receive_channel: string;
  bottomSheetTitle: string;
}) {
  const dispatch = useDispatch();
  const [permission, requestPermission] = useCameraPermissions();
  const [apiResult, setApiResult] = useState<String | null>(null);
  const { isStreaming, facing } = useSelector((state: any) => state.talking);
  const cameraRef = useRef<CameraView>(null);
  const socket = useRef<Socket | null>(null);
  const isStreamingRef = useRef(false);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const stopStreaming = () => {
    dispatch(setIsStreaming(false));
  };
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

      socket.current.on(receive_channel, (data) => {
        console.log("Face recognition result:", data);
        console.log(`Received at ${Date.now()}`);
        if (data?.[0]) {
          const message = `${data?.[0]?.name || "Unknown"} here. Greet them!`;
          if (apiResult !== message) {
            setApiResult(message);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            Speech.speak(message);
          }
          bottomSheetRef.current?.expand(); // Open bottom sheet when data is received
        } else {
          bottomSheetRef.current?.close(); // Close bottom sheet when no data is received
        }
      });

      socket.current.on("connect_error", (error) => {
        console.error("Connection error:", error);
      });

      socket.current.on("reconnect_attempt", () => {
        console.log("Attempting to reconnect...");
      });
    })();

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
      // Stop streaming and reset state
      isStreamingRef.current = false;
    };
  }, []);

  console.log("Is streaming op:", isStreaming);

  useEffect(() => {
    console.log("Is streaming:", isStreaming);
    isStreamingRef.current = isStreaming;

    if (isStreaming && cameraRef.current) {
      streamFrames();
    }

    return () => {
      if (isStreaming) {
        stopStreaming();
        dispatch(setIsStreaming(false));
      }
    };
  }, [isStreaming, cameraRef.current]);

  if (!permission) {
    return (
      <SafeAreaView>
        <HeaderContainer>
          <HeaderNavigation>
            <BackButton>Back</BackButton>
          </HeaderNavigation>
          <HeaderTitle>Requesting for camera permission...</HeaderTitle>
        </HeaderContainer>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView>
        <HeaderContainer>
          <HeaderNavigation>
            <BackButton>Back</BackButton>
          </HeaderNavigation>
          <HeaderTitle>
            Camera permission is not granted. Please grant the permission to
            continue.
          </HeaderTitle>
        </HeaderContainer>
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

  function toggleCameraFacing() {
    dispatch(setFacing(facing === "back" ? "front" : "back"));
  }

  const startStreaming = () => {
    dispatch(setIsStreaming(true));
    isStreamingRef.current = true;
    streamFrames();
  };

  const streamFrames = async () => {
    if (!isStreamingRef.current || !cameraRef.current) {
      return;
    }

    const photo = await cameraRef.current.takePictureAsync({
      base64: true,
      quality: 0.3,
      exif: false,
      skipProcessing: true,
    });

    if (!photo) {
      console.error("Failed to take picture");
      return;
    }

    try {
      socket.current?.emit(send_channel, photo.base64);
    } catch (error) {
      console.error("Error sending frame:", error);
    }

    setTimeout(streamFrames, 3000);
  };

  return (
    <EyePageContainer>
      <CameraView
        style={styles.camera}
        facing={facing}
        ref={cameraRef}
        animateShutter={false}
        mute={true}
      >
        <EyePageController />
        <CameraButtonsContainer>
          <IconButtonComponent
            icon={() => (
              <MaterialIcons name="flip-camera-ios" size={20} color="white" />
            )}
            onPress={toggleCameraFacing}
          />
          {isStreaming ? (
            <IconButtonComponent
              icon={() => <MaterialIcons name="stop" size={20} color="white" />}
              onPress={stopStreaming}
            />
          ) : (
            <IconButtonComponent
              icon={() => (
                <MaterialIcons name="play-arrow" size={20} color="white" />
              )}
              onPress={startStreaming}
            />
          )}
        </CameraButtonsContainer>
      </CameraView>

      {apiResult && (
        <BottomSheetComponent
          ref={bottomSheetRef}
          index={0} // Set to 0 to start in a collapsed state
          snapPoints={[250]} // Use calculated percentage
          enablePanDownToClose={true}
          backgroundStyle={styles.bottomSheet}
        >
          <BottomSheetViewComponent>
            <BottomSheetHeaderContainer>
              <AntDesign name="idcard" size={24} color="white" />
              <Heading>{bottomSheetTitle}</Heading>
            </BottomSheetHeaderContainer>
            <ResultText>{apiResult}</ResultText>
          </BottomSheetViewComponent>
        </BottomSheetComponent>
      )}
    </EyePageContainer>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,
  },
  bottomSheet: {
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Opaque background
    zIndex: 0,
  },
});
