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
import { useDispatch } from "react-redux";
import { SignUpUser } from "@/services/auth.services";
import Toast from "react-native-root-toast";

const RegisterPage = () => {
    const router = useRouter();
    const [loading, setLoading] = React.useState(false);
    const [form, setForm] = React.useState({
        name: "",
        email: "",
        password: "",
    });

    const handleSignup = async () => {
        try {
            setLoading(true);
            const res = await SignUpUser({
                name: form.name,
                email: form.email,
                password: form.password,
                role: "user",
            });
            console.log(res);

            if (res.status === 200 || res.status === 201) {
                console.log("User registered successfully");
                Toast.show("User registered successfully!", {
                    duration: Toast.durations.SHORT,
                    position: Toast.positions.TOP,
                    shadow: true,
                    animation: true,
                    hideOnPress: true,
                    delay: 0,
                    backgroundColor: COLORS.success,
                    textColor: COLORS.primaryText,
                });

                router.push("/login");
            } else {
                Toast.show("User registration failed!", {
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
            Toast.show(`User registration failed! ${error?.response?.data?.message || ""}`, {
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
                    <TitleText>Sign up</TitleText>
                    <SecondaryText>Get Visual Assistance</SecondaryText>

                    <FormContainer>
                        <TextInputField 
textColor="#fff"
                            mode="outlined"
                            placeholder="Enter your Name"
                            outlineColor="#00000000"
                            activeOutlineColor={"#00000000"}
                            selectionColor="#fff"
                            onChangeText={(text) => setForm({ ...form, name: text })}
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
                            text="Register"
                            onPress={handleSignup}
                            primary
                            loading={loading}
                        />
                        <MoreText>
                            Already have an account?{" "}
                            <MoreText
                                style={{ color: COLORS.primary }}
                                onPress={() => {
                                    router.push("/login");
                                }}
                            >
                                Sign in
                            </MoreText>
                        </MoreText>
                    </FormContainer>
                </ScrollView>
            </KeyboardAvoidingView>
        </Container>
    );
};

export default RegisterPage;
