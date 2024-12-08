import { View } from "react-native";
import styled from "styled-components/native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { IconButton, Text } from "react-native-paper";
import { COLORS } from "@/constants/color_wheel";

export const EyePageContainer = styled(View)`
  flex: 1;
`;

export const EyePageControllerContainer = styled(View)`
  position: fixed;
  left: 16px;
  top: 72px;
  gap: 8px;
  width: 170px;
`;

export const BottomSheetComponent = styled(BottomSheet)`
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
`;

export const BottomSheetViewComponent = styled(BottomSheetView)`
  padding: 10px 16px;
  padding-bottom: 20px;
`;

export const BottomSheetHeaderContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
`;

export const Heading = styled(Text)`
  font-size: 18px;
  color: ${COLORS.primaryText};
  font-weight: bold;
  flex-direction: row;
`;

export const ModeName = styled(Text)`
background-color: #000000aa;
border-radius: 10px;
padding: 4px 8px;
`;

export const ResultText = styled(Text)`
  font-size: 18px;
  color: ${COLORS.primaryText};
  margin-vertical: 10px;
  line-height: 24px;
`;

export const CameraButtonsContainer = styled(View)`
  position: absolute;
  right: 16px;
  top: 100px;
  gap: 8px;
`;

export const IconButtonComponent = styled(IconButton)`
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  padding: 10px;
`;
export const InitVoiceIconComponent = styled(IconButton)`
  background-color: ${COLORS.primary};
  border-radius: 50px;
  width: 60px;
  height: 60px;
  position:relative;
  top: -16px;
`;

export const IconButtonModeComponent = styled(IconButton)`
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 50px;
  padding: 10px;
`;
