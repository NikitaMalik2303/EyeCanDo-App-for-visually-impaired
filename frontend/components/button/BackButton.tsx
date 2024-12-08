import React from 'react';
import { BackButtonComponent } from '@/styles/button.styles';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';


const BackButton = ({ children, href }: any) => {
    const router = useRouter();

    return (
        <BackButtonComponent
            mode="text"
            labelStyle={{
                color: '#fff',
                fontSize: 14,
                fontWeight: 'bold',
            }}
            icon={() => <MaterialIcons name="arrow-back-ios" size={16} color="#fff" />}
            onPress={() => {
                if (href) {
                    router.push(href);
                } else {
                    router.back();
                }
            }}
        >
            {children}
        </BackButtonComponent>
    );
};

export default BackButton;
