import { EyePageControllerContainer, IconButtonModeComponent, ModeName } from '@/styles/eye.styles'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { usePathname, useRouter } from 'expo-router'
import React from 'react'
import { Text, Tooltip } from 'react-native-paper'

const EyePageController = () => {
    const router = useRouter()
    const pathname = usePathname();
    return (
        <EyePageControllerContainer
            style={{
                width: pathname === '/eye-home' ? 140 : pathname === '/eye-street' ? 152 : 168,
            }}
        >
            <ModeName>
                {pathname === '/eye-home' ? 'Home Mode (Face)' : pathname === '/eye-street' ? 'Street Mode (Depth)' : pathname === '/eye-outdoor' ? 'Outdoor Mode (Object)' : 'Home'}
            </ModeName>
            <IconButtonModeComponent
                style={{ backgroundColor: pathname === '/eye-home' ? '#14b8a6' : 'rgba(255, 255, 255, 0.3)' }}
                icon={() => (
                    <MaterialCommunityIcons name="face-recognition" size={20} color="white" />
                )}
                onPress={() => {
                    router.push('/eye-home')
                }}
            />
            <IconButtonModeComponent
                style={{ backgroundColor: pathname === '/eye-street' ? '#14b8a6' : 'rgba(255, 255, 255, 0.3)' }}

                icon={() => (
                    <MaterialCommunityIcons name="alert" size={20} color="white" />
                )}
                onPress={() => {
                    router.push('/eye-street')
                }}
            />
            <IconButtonModeComponent
                style={{ backgroundColor: pathname === '/eye-outdoor' ? '#14b8a6' : 'rgba(255, 255, 255, 0.3)' }}

                icon={() => (
                    <MaterialCommunityIcons name="information-outline" size={20} color="white" />
                )}
                onPress={() => {
                    router.push('/eye-outdoor')
                }}
            />
        </EyePageControllerContainer>
    )
}

export default EyePageController