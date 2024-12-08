import { Tabs } from "expo-router";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { COLORS } from "@/constants/color_wheel";
import CheckAuth from "@/components/constants/CheckAuth";
import { IconButtonComponent, InitVoiceIconComponent } from "@/styles/eye.styles";
import AudioTranscriber from "@/components/audio/AudioTranscriber";

export default function TabLayout() {
  return (
    <>
      <CheckAuth isPublic={false} />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.primary,
          // headerStyle: {
          //   backgroundColor: COLORS.secondaryBackground,
          // },
          // headerShadowVisible: false,
          // headerTintColor: '#fff',
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.secondaryBackground,
            height: 84,
            borderTopWidth: 0,
          },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, focused }) => (
              <Octicons
                name={focused ? "home" : "home"}
                size={iconSize}
                style={[iconStyles]}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="directory/index"
          options={{
            title: "Directory",
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? "contacts" : "contacts-outline"}
                size={iconSize}
                style={[iconStyles]}
                color={color}
              />
            ),
          }}
        />
         <Tabs.Screen
          name="init-voice"
          options={{
            tabBarButton: () => (
              <AudioTranscriber />
            ),
          }}
        />
        <Tabs.Screen
          name="eye-home"
          options={{
            title: "Eye",
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? "eye-circle" : "eye-circle-outline"}
                size={iconSize}
                style={[iconStyles]}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="eye-street"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="eye-outdoor"
          options={{
            href: null
          }}
        />
        <Tabs.Screen
          name="assistance/index"
          options={{
            href: null
          }}
        />
       
        <Tabs.Screen
          name="community"
          options={{
            title: "Community",
            tabBarIcon: ({ color, focused }) => (
              <Feather
                name={focused ? "users" : "users"}
                size={iconSize}
                style={[iconStyles]}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

const iconStyles = {
  marginBottom: -3,
};

const iconSize = 22;
