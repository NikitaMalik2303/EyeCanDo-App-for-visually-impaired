// styles/directory.styles.ts
import styled from "styled-components/native";
import { View, Text, ImageBackground, FlatList } from "react-native";
import { Button, IconButton, Searchbar, TextInput } from "react-native-paper";
import { COLORS } from "@/constants/color_wheel";

export const CameraContainerBackground = styled(ImageBackground)`
  height: 400px;
  width: 100%;
`;

export const CameraContainer = styled(View)`
  margin: 40px auto;
  margin-bottom: 20px;
  border-radius: 1000px;
  overflow: hidden;
  height: 300px;
  width: 300px;
  position: relative;
`;

export const FlipCameraButton = styled(IconButton)`
  position: absolute;
  left: 31.5%;
  bottom: 24%;
`;

export const ScanButton = styled(Button)`
  color: ${COLORS.primaryText};
`;

export const ScanButtonContainer = styled(View)`
  align-items: center;
  margin-bottom: 20px;
`;

export const TextInputField = styled(TextInput)`
  background-color: ${COLORS.secondaryFill};
  margin-bottom: 30px;
`;

export const SearchInput = styled(Searchbar)`
  margin: 10px 16px;
  background-color: ${COLORS.secondaryFill};
  border: none;
  border-radius: 8px;
  height: 40px;
`;

export const ContactsList = styled(FlatList)`
  padding: 10px 16px;
`;

export const ContactCardContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: 16px 15px;
  border-bottom-width: 1px;
  border-bottom-color: #333;
`;


export const CommunityCardContainer = styled(View)`
  padding: 16px 0px;
  border-bottom-width: 1px;
  border-bottom-color: #333;
  gap:16px;
`;


export const ContactName = styled(Text)`
  flex: 1;
  font-size: 16px;
  color: ${COLORS.primaryText};
  font-weight: 600;
`;



export const CommunityTitle = styled(Text)`
  flex: 1;
  font-size: 18px;
  color: ${COLORS.primaryText};
  font-weight: 600;
`;



export const CommunityDescription = styled(Text)`
  flex: 1;
  font-size: 15px;
  color: ${COLORS.secondaryText};
  font-weight: 500;
`;


export const CommunityRating = styled(Text)`
  flex: 1;
  font-size: 16px;
  color: ${COLORS.primaryText};
  font-weight: 600;
`;

export const InputContainer = styled(View)`
  padding: 15px;
  padding: 16px 15px;
  border-bottom-width: 1px;
  border-bottom-color: #333;
`;
