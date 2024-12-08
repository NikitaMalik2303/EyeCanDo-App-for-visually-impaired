import styled from "styled-components/native";
import { Text, ImageBackground, View, Image } from "react-native";

export const Container = styled(ImageBackground)`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: ${(props) => props.theme.colors.background};
`;

export const LogoImage = styled(Image)`
  width: 32px;
  height: 32px;
  margin-bottom: 12px;
`;

export const LogoText = styled(Text)`
  font-size: 16px;
  font-weight: 700;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 32px;
`;

export const SubtitleText = styled(Text)`
  font-size: 26px;
  text-align: center;
  font-weight: 600;
  padding: 0 20px;
  color: ${(props) => props.theme.colors.text};
  margin-bottom: 50px;
`;

export const ButtonContainer = styled(View)`
  width: 100%;
  gap: 10px;
  align-items: center;
  position: absolute;
  bottom: 52px;
`;
