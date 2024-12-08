import { useState, useEffect, useRef } from "react";
import { StyleSheet, Alert } from "react-native";
import { Accelerometer } from "expo-sensors";
import { useSelector } from "react-redux";
import * as SMS from "expo-sms";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetOnlineVolunteer } from "@/services/auth.services";

export default function FallDetection() {
  const [{ x, y, z }, setData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState<any>(null);
  
  // Ref to prevent multiple detections
  const alreadyDetectedRef = useRef(false);
  
  // Ref to track if an alert is currently being shown
  const isAlertVisibleRef = useRef(false);
  
  const { fallDetectionEnabled } = useSelector((state: any) => state.user);

  const FALL_THRESHOLD = 10; // Threshold for detecting a significant fall (10g)
  const GRAVITY = 9.81; // Standard gravity in m/s^2

  const subscribe = () => {
    const accelSubscription = Accelerometer.addListener((accelerometerData) => {
      setData(accelerometerData);
      detectFall(accelerometerData);
    });
    setSubscription(accelSubscription);
    Accelerometer.setUpdateInterval(100); // Set update interval to 100ms
  };

  const unsubscribe = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  };


  const getVolunteerNumber = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await GetOnlineVolunteer(token);

      const phoneNumber = res?.phoneNumber

      return phoneNumber;

    } catch (error) {
      console.error("Error getting online volunteers:", error);
    }
  }

  const detectFall = async ({ x, y, z }: any) => {
    const totalAcceleration = Math.sqrt(
      Math.pow(x * GRAVITY, 2) +
      Math.pow(y * GRAVITY, 2) +
      Math.pow(z * GRAVITY, 2)
    );

    // Check if the acceleration exceeds the fall threshold
    if (
      totalAcceleration > FALL_THRESHOLD * GRAVITY &&
      !alreadyDetectedRef.current &&
      !isAlertVisibleRef.current
    ) {
      alreadyDetectedRef.current = true; // Prevent further detections
      isAlertVisibleRef.current = true;  // Indicate that an alert is being shown
      
      unsubscribe(); // Stop detecting more falls until the alert is handled

      Alert.alert("Fall Detected", "Are you okay?", [
        {
          text: "Yes",
          onPress: () => {
            alreadyDetectedRef.current = false; // Allow future fall detections
            isAlertVisibleRef.current = false;   // Alert is dismissed
            subscribe();                         // Resubscribe after the alert is dismissed
          },
        },
        {
          text: "No",
          onPress: () => {
            alreadyDetectedRef.current = false; // Allow future fall detections
            isAlertVisibleRef.current = false;   // Alert is dismissed
            subscribe();                         // Resubscribe after the alert is dismissed
          },
        },
      ]);

      // Send SMS to emergency contacts
      const phoneNumber = await getVolunteerNumber();
      const emergencyContacts = [phoneNumber];
      const message = "Fall detected! Please check on me.";
      SMS.sendSMSAsync(emergencyContacts, message)
        .then(() => {
          console.log("SMS sent successfully!");
        })
        .catch((error) => {
          console.log("Failed to send SMS:", error);
        });
    }
  };

  useEffect(() => {
    if (fallDetectionEnabled) {
      subscribe();
    } else {
      unsubscribe();
    }

    return () => unsubscribe();
  }, [fallDetectionEnabled]);

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
  },
});
