import { COLORS } from "@/constants/color_wheel";
import { View } from "react-native";
import { Text } from "react-native-paper";
import styled from "styled-components/native";



export const SettingsContainer = styled(View)`
  padding: 00px 16px;
  flex-direction: column;
  gap: 16px;

`;

export const SettingsItem = styled(View)`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-bottom-width: 1px;
    border-bottom-color: ${COLORS.secondaryFill};
    padding: 24px 0;

`;

export const SettingsItemText = styled(Text)`
    font-size: 16px;
    font-weight: bold;
`;