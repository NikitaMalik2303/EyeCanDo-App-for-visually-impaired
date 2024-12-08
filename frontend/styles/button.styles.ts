import styled from "styled-components/native";
import { Button } from "react-native-paper";

interface ButtonWrapperProps {
  primary?: boolean;
  mode: "contained" | "outlined";
}

export const ButtonWrapper = styled(Button)<ButtonWrapperProps>`
  width: 100%;
  padding: 8px 10px;
  background-color: ${(props) =>
    props.primary ? props.theme.colors.primary : "transparent"};
  border-color: ${(props) =>
    props.primary ? "transparent" : props.theme.colors.primary};
  border-width: ${(props) => (props.primary ? "0px" : "2px")};
  border-radius: 30px;
`;

export const BackButtonComponent = styled(Button)`
  justify-content: center;
`;


