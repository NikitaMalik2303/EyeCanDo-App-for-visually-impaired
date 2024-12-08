import React from 'react';
import { Container, LogoText, SubtitleText, ButtonContainer, LogoImage } from '@/styles/home.styles';
import ButtonComponent from '@/components/button/ButtonComponent';
import { useRouter } from 'expo-router';

const HomePage = () => {
    const router = useRouter();

    return (
        <Container source={require('@/assets/images/backgrounds/bg-pattern.png')}>
            <LogoImage source={require('@/assets/images/logos/logo.png')} />
            <LogoText>Eye Can Do</LogoText>
            <SubtitleText>
                Explore the world, your way. Navigate the world with confidence.
            </SubtitleText>
            <ButtonContainer>
                <ButtonComponent
                    mode="contained"
                    text="I need visual assistance"
                    onPress={() => {
                        router.push('/login');
                    }}
                    primary
                />
                <ButtonComponent
                    mode="outlined"
                    text="I’d like to volunteer"
                    onPress={() => {
                        router.push('/volunteer-login');
                    }}
                />
            </ButtonContainer>
        </Container>
    );
};

export default HomePage;
