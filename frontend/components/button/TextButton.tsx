import React from 'react';
import { BackButtonComponent } from '@/styles/button.styles';


const TextButton = ({ children, onPress, icon, color, fontSize }: any) => {

    return (
        <BackButtonComponent
            mode="text"
            labelStyle={{
                color: color || '#fff',
                fontSize: fontSize || 14,
                fontWeight: 'bold',
            }}
            icon={icon}
            onPress={onPress}
        >
            {children}
        </BackButtonComponent>
    );
};

export default TextButton;
