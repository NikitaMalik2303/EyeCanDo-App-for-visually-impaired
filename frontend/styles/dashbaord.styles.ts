import { COLORS } from "@/constants/color_wheel";
import styled from "styled-components/native";
import { View, Text } from "react-native";
import { Button } from "react-native-paper";

export const SafeAreaView = styled.SafeAreaView`
  background-color: ${COLORS.background};
  min-height: 100%;
`;

export const HeaderContainer = styled(View)``;

export const HeaderNavigation = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const DashboardHeaderContainer = styled(View)`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  padding: 19px 0px;
`;

export const DashboardTitleContainer = styled(View)``;

export const DashboardPageContainer = styled(View)`
  padding: 0 16px;
`;

export const DashboardQuickLinksContainer = styled(View)`
  margin-top: 32px;
`;

export const StepsCard = styled(View)`
  background: ${COLORS.secondaryBackground};
  padding: 32px 24px;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
`;

export const StepsContent = styled(View)`
  margin-left: 32px;
  gap: 5px;
`;

export const StepsCount = styled(Text)`
  font-size: 34px;
  font-weight: 700;
  color: #14b8a6;
`;

export const StepsKey = styled(Text)`
  font-size: 16px;
  font-weight: 600;
  color: ${COLORS.secondaryText};
`;

export const SectionText = styled(Text)`
  font-size: 15px;
  font-weight: 600;
  color: ${COLORS.secondaryText};
  padding: 0px 16px;
`;

export const HeaderTitle = styled(Text)`
  font-size: 34px;
  font-weight: 700;
  color: ${COLORS.primaryText};
  padding: 10px 16px;
`;

export const HeaderText = styled(Text)`
  font-size: 15px;
  font-weight: 600;
  color: ${COLORS.secondaryText};
  padding: 0px 16px;
`;

export const ProfileContainer = styled(View)`
  padding: 0px 16px;
`;

export const CardButtonContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 16px;
`;

export const AddButton = styled(Button)`
  color: #007aff;
`;

export const CardButton = styled(View)`
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
  padding: 10px 8px;
`;

export const CardButtonText = styled(Text)`
  font-size: 10px;
  font-weight: 600;
  color: ${COLORS.secondaryText};
  padding: 0px 16px;
`;

export const VolunteerButton = styled(Button)`
  height: 60px;
  background-color: ${COLORS.blue};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 12px;
`;

export const VolunteerButtonDanger = styled(Button)`
  height: 60px;
  background-color: ${COLORS.error};
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  margin-top: 16px;
`;
