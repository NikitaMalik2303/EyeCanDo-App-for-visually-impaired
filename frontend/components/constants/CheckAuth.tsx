import { COLORS } from "@/constants/color_wheel";
import { CheckAuthStatus } from "@/services/auth.services";
import { update } from "@/store/user.slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import Toast from "react-native-root-toast";
import { useDispatch } from "react-redux";

const CheckAuth = ({ isPublic }: { isPublic: boolean }) => {
  console.log("CheckAuth");
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("Token", token);
        if (token) {
          // dispatch(login({ token: token }));
          const res = await CheckAuthStatus(token);
          if (res.status === 200) {
            dispatch(
              update({
                user: {
                  role: res.data.role,
                  email: res.data.email,
                },
              })
            );

            if (isPublic) {
              Toast.show("Already logged in!", {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
                backgroundColor: COLORS.success,
                textColor: COLORS.primaryText,
              });

              if (res.data.role === "volunteer") {
                router.push("/volunteer-dashboard");
              } else {
                router.push("/dashboard");
              }
            }
          } else {
            if (!isPublic) {
              Toast.show("Session not found. Please login!", {
                duration: Toast.durations.LONG,
                position: Toast.positions.TOP,
                shadow: true,
                animation: true,
                hideOnPress: true,
                delay: 0,
                backgroundColor: COLORS.error,
                textColor: COLORS.primaryText,
              });
              router.push("/");
            }
          }
        } else {
          if (!isPublic) {
            Toast.show("Session not found. Please login!", {
              duration: Toast.durations.LONG,
              position: Toast.positions.TOP,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 0,
              backgroundColor: COLORS.error,
              textColor: COLORS.primaryText,
            });
            router.push("/");
          }
        }
      } catch (e) {
        console.log(e);
      }
    };

    checkAuth().then(() => console.log("Checked Auth"));
  }, []);

  return null;
};

export default CheckAuth;
