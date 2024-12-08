import React from 'react';
import { ButtonWrapper } from '@/styles/button.styles';
import { Feather } from '@expo/vector-icons';

interface ButtonComponentProps {
    mode: 'contained' | 'outlined';
    text: string;
    onPress: () => void;
    primary?: boolean;
    icon?: string;
    loading?: boolean;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ mode, text, onPress, primary, icon, loading }) => {
    return (
        <ButtonWrapper
            mode={mode}
            onPress={onPress}
            primary={primary}
            labelStyle={{
                color: primary ? '#000' : '#fff',
                fontSize: 14,
                fontWeight: 'bold',
            }}
            icon={icon}
            loading={loading ? true : false}
            disabled={loading ? true : false}
        >
            {text}
        </ButtonWrapper>
    );
};

export default ButtonComponent;
