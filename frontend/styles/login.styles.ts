import styled from "styled-components/native";
import { Text, ImageBackground, View } from "react-native";
import { COLORS } from "@/constants/color_wheel";
import { TextInput } from "react-native-paper";

export const Container = styled(ImageBackground)`
  background-color: ${(props) => props.theme.colors.background};
  height: 100%;
`;

export const Header = styled(View)`
  margin-top: 53px;
  flex-direction: row;
  align-items: center;
  padding: 0 6px;
`;

export const TitleText = styled(Text)`
  font-size: 42px;
  font-weight: 600;
  color: ${(props) => props.theme.colors.text};
  margin-top: 68px;
  padding: 0 16px;
  text-align: center;
  width: 100%;
`;

export const SecondaryText = styled(Text)`
  color: ${COLORS.secondaryText};
  font-size: 18px;
  margin-top: 12px;
  font-weight: 600;
  padding: 0 16px;
  text-align: center;
  width: 100%;
`;

export const FormContainer = styled(View)`
  padding: 0 16px;
  padding-top: 64px;
  gap: 18px;
`;

export const TextInputField = styled(TextInput)`
  background-color: ${COLORS.secondaryFill};
  height: 64px;
  border-radius: 8px;
`;

export const MoreText = styled.Text`
  color: ${COLORS.secondaryText};
  font-size: 15px;
  width: 100%;
  text-align: center;
`;
