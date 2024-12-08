import BackButton from '@/components/button/BackButton'
import TextButton from '@/components/button/TextButton'
import { COLORS } from '@/constants/color_wheel'
import { disableFallDetection, enableFallDetection } from '@/store/user.slice'
import { HeaderContainer, HeaderNavigation, HeaderTitle, SafeAreaView } from '@/styles/dashbaord.styles'
import { SettingsContainer, SettingsItem, SettingsItemText } from '@/styles/settings.styles'
import { Feather, MaterialIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { Switch } from 'react-native-paper'
import Toast from 'react-native-root-toast'
import { useDispatch, useSelector } from 'react-redux'

const UserSettings = () => {
    const router = useRouter();
    const dispatch = useDispatch()
    const {fallDetectionEnabled} = useSelector((state: any) => state.user)

    const handleLogout = () => {
        AsyncStorage.removeItem("token")
        Toast.show("Logged out Successfully!", {
            duration: Toast.durations.SHORT,
            position: Toast.positions.TOP,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
            backgroundColor: COLORS.success,
            textColor: COLORS.primaryText,
        });
        router.push("/")

    }

    const handleToggleFallDetection = async (value: any) => {
        if (value) {
            dispatch(enableFallDetection())
        } else {
            dispatch(disableFallDetection())
        }
    }


    return (
        <SafeAreaView>
            <HeaderContainer>
                <HeaderNavigation>
                    <BackButton>Back</BackButton>
                    <TextButton
                        color={COLORS.error}
                        fontSize={16}
                        icon={() => (
                            <MaterialIcons name="logout" size={18} color={COLORS.error} />
                        )}
                        onPress={handleLogout}
                    >
                        Logout
                    </TextButton>
                </HeaderNavigation>
                <HeaderTitle>Settings</HeaderTitle>
            </HeaderContainer>
            <SettingsContainer>
                <SettingsItem>
                    <SettingsItemText>
                        Enable Fall Detection
                    </SettingsItemText>
                    <Switch
                        value={fallDetectionEnabled}
                        onValueChange={handleToggleFallDetection}
                    />
                </SettingsItem>
            </SettingsContainer>
        </SafeAreaView>
    )
}

export default UserSettings