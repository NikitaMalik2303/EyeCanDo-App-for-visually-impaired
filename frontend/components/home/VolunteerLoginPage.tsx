import React from "react";
import {
    Container,
    Header,
    TitleText,
    SecondaryText,
    FormContainer,
    TextInputField,
    MoreText,
} from "@/styles/login.styles";
import ButtonComponent from "@/components/button/ButtonComponent";
import BackButton from "@/components/button/BackButton";
import { useRouter } from "expo-router";
import { COLORS } from "@/constants/color_wheel";
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { SignInUser } from "@/services/auth.services";
import { login } from "@/store/user.slice";
import { useDispatch } from "react-redux";
import Toast from "react-native-root-toast";
import AsyncStorage from "@react-native-async-storage/async-storage";

const VolunteerLoginPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = React.useState(false);
    const [form, setForm] = React.useState({
        email: "",
        password: "",
    });

    const handleSignIn = async () => {
        try {
            setLoading(true);
            const res = await SignInUser(form);
            console.log(res);

            if (res.status === 200 || res.status === 201) {
                console.log("token", res.data.token);
                console.log("user", res.data.user);
                dispatch(
                    login({
                        token: res.data.token,
                        user: res.data.user,
                    })
                );

                await AsyncStorage.setItem("token", res.data.token);

                Toast.show("Login Succcessfull!", {
                    duration: Toast.durations.SHORT,
                    position: Toast.positions.TOP,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                    backgroundColor: COLORS.success,
                    textColor: COLORS.primaryText,
                });

                if (res.data.user.role === "volunteer") {
                    router.push("/volunteer-dashboard");
                } else {
                    router.push("/dashboard");
                }
            } else {
                Toast.show("Login failed!", {
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
            Toast.show(`Login failed! ${error?.response?.data?.message || ""}`, {
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
    return (
        <Container source={require("@/assets/images/backgrounds/bg-pattern.png")}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <Header>
                        <BackButton>Back</BackButton>
                    </Header>
                    <TitleText>Be a Volunteer</TitleText>
                    <SecondaryText>Welcome back</SecondaryText>

                    <FormContainer>
                        <TextInputField 
textColor="#fff"
                            mode="outlined"
                            placeholder="Enter your email"
                            outlineColor="#00000000"
                            activeOutlineColor={"#00000000"}
                            selectionColor="#fff"
                            onChangeText={(text) => setForm({ ...form, email: text })}
                            theme={{
                                colors: {
                                    text: "#fff",
                                    placeholder: COLORS.secondaryText,
                                    outlineColor: "transparent",
                                },
                            }}
                        />
                        <TextInputField 
textColor="#fff"
                            mode="outlined"
                            value={form.password}
                            onChangeText={(text) => setForm({ ...form, password: text })}
                            placeholder="Enter your password"
                            outlineColor="#00000000"
                            activeOutlineColor={"#00000000"}
                            selectionColor="#fff"
                            theme={{
                                colors: {
                                    text: "#fff",
                                    placeholder: COLORS.secondaryText,
                                    outlineColor: "transparent",
                                },
                            }}
                            style={{ marginBottom: 20 }}
                        />
                        <ButtonComponent
                            mode="contained"
                            text="Login"
                            onPress={handleSignIn}
                            primary
                            loading={loading}
                        />
                        <MoreText>
                            Dont have an account?{" "}
                            <MoreText
                                style={{ color: COLORS.primary }}
                                onPress={() => {
                                    router.push("/volunteer-register");
                                }}
                            >
                                Sign up
                            </MoreText>
                        </MoreText>
                    </FormContainer>
                </ScrollView>
            </KeyboardAvoidingView>
        </Container>
    );
};

export default VolunteerLoginPage;
