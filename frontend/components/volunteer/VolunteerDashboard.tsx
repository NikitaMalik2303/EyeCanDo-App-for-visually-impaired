import { COLORS } from '@/constants/color_wheel'
import { DashboardHeaderContainer, DashboardTitleContainer, HeaderContainer, HeaderText, HeaderTitle, ProfileContainer, SafeAreaView } from '@/styles/dashbaord.styles'
import { InputContainer, ScanButton, TextInputField } from '@/styles/directory.styles'
import { Feather } from '@expo/vector-icons'
import { router } from 'expo-router'
import moment from 'moment'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { Avatar, Text } from 'react-native-paper'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { AddCommunityDetails, AddVolunteerPhone } from '@/services/auth.services'
import Toast from 'react-native-root-toast'
import AsyncStorage from '@react-native-async-storage/async-storage'

const VolunteerDashboard = () => {
  const [phone, setPhone] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [form, setForm] = React.useState<any>({
    title: '',
    description: '',
    rating: '',
  });

  const handleAddPhone = async () => {
    if (!phone) {
      Toast.show("Please provide a valid phone number.", {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        backgroundColor: COLORS.error,
        textColor: COLORS.primaryText,
      });
      return;
    }
    const token = await AsyncStorage.getItem("token");

    try {
      setLoading(true);
      const res = await AddVolunteerPhone({
        phoneNumber: phone,
      },
        token
      );
      console.log(res);

      if (res.status === 200 || res.status === 201) {
        Toast.show("Phone number added successfully!", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: COLORS.success,
          textColor: COLORS.primaryText,
        });

      } else {
        Toast.show("Phone number addition failed!", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: COLORS.error,
          textColor: COLORS.primaryText,
        });
      }

    } catch (error: any) {
      Toast.show(`Phone number addition failed! ${error.message}`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: COLORS.error,
        textColor: COLORS.primaryText,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCommunity = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const res = await AddCommunityDetails({
        name: form.title,
        description: form.description,
        rating: form.rating,
      },
        token
      );

      if (res.status === 200 || res.status === 201) {
        Toast.show("Community details added successfully!", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: COLORS.success,
          textColor: COLORS.primaryText,
        });

      } else {
        Toast.show("Failed to add community details!", {
          duration: Toast.durations.SHORT,
          position: Toast.positions.TOP,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
          backgroundColor: COLORS.error,
          textColor: COLORS.primaryText,
        });
      }

    } catch (error: any) {
      Toast.show(`Failed to add community details! ${error.message}`, {
        duration: Toast.durations.SHORT,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: COLORS.error,
        textColor: COLORS.primaryText,
      });
    } finally {
      setLoading(false);
    }
  }



  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: COLORS.background }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <SafeAreaView>
          <HeaderContainer>

            <DashboardHeaderContainer>
              <DashboardTitleContainer>
                <HeaderText>
                  {moment().format('LL')}
                </HeaderText>
                <HeaderTitle>
                  Volunteer
                </HeaderTitle>
              </DashboardTitleContainer>
              <ProfileContainer>
                <TouchableOpacity onPress={() => router.push('/settings')}>
                  <Avatar.Icon
                    size={36}
                    icon={() => <Feather name="user" size={24} color="#000" />}
                  />
                </TouchableOpacity>
              </ProfileContainer>
            </DashboardHeaderContainer>

            <InputContainer>
              <TextInputField 
textColor="#fff"
                label="Phone number"
                value={phone}
                onChangeText={(text) => setPhone(text)}
                mode="outlined"
                placeholder="Enter Phone number"
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
                onPress={handleAddPhone}
                loading={loading}

              >
                Add phone number
              </ScanButton>
            </InputContainer>


            <InputContainer>
              <HeaderText>
                Add Community Details
              </HeaderText>
              <View style={{ marginBottom: 10 }}></View>
              <TextInputField 
textColor="#fff"
                label="Title"
                value={form.title}
                onChangeText={(text) => setForm({ ...form, title: text })}
                mode="outlined"
                placeholder="Enter title"
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
              <TextInputField 
textColor="#fff"
                label="Description"
                value={form.description}
                onChangeText={(text) => setForm({ ...form, description: text })}
                mode="outlined"
                placeholder="Enter description"
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

              <TextInputField 
textColor="#fff"
                label="Rating"
                value={form.rating}
                onChangeText={(text) => setForm({ ...form, rating: text })}
                mode="outlined"
                placeholder="Enter rating"
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
                onPress={handleAddCommunity}
                loading={loading}

              >
                Add Community Details
              </ScanButton>
            </InputContainer>
          </HeaderContainer>
        </SafeAreaView>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default VolunteerDashboard