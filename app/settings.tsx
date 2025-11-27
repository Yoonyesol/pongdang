import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import { useLanguageStore, Language } from '../src/store/useLanguageStore';
import { useTranslation } from '../src/translations';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
`;

const Header = styled.View`
  margin-top: 40px;
  margin-bottom: 24px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const Section = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
`;

const LanguageOption = styled(TouchableOpacity) <{ selected: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: ${({ theme, selected }) =>
        selected ? theme.colors.primary + '20' : 'transparent'};
  border-radius: 12px;
  margin-bottom: 8px;
  border: 2px solid ${({ theme, selected }) =>
        selected ? theme.colors.primary : 'transparent'};
`;

const LanguageText = styled.Text<{ selected: boolean }>`
  font-size: 16px;
  font-weight: ${({ selected }) => selected ? 'bold' : 'normal'};
  color: ${({ theme, selected }) =>
        selected ? theme.colors.primary : theme.colors.text};
`;

const CheckMark = styled.Text`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.primary};
`;

export default function SettingsScreen() {
    const router = useRouter();
    const { language, setLanguage } = useLanguageStore();
    const t = useTranslation(language);

    const handleLanguageChange = (lang: Language) => {
        setLanguage(lang);
    };

    return (
        <Container>
            <Header>
                <Title>{t.settings.title}</Title>
            </Header>

            <Section>
                <SectionTitle>{t.settings.language}</SectionTitle>

                <LanguageOption
                    selected={language === 'en'}
                    onPress={() => handleLanguageChange('en')}
                >
                    <LanguageText selected={language === 'en'}>
                        {t.settings.english}
                    </LanguageText>
                    {language === 'en' && <CheckMark>✓</CheckMark>}
                </LanguageOption>

                <LanguageOption
                    selected={language === 'ko'}
                    onPress={() => handleLanguageChange('ko')}
                >
                    <LanguageText selected={language === 'ko'}>
                        {t.settings.korean}
                    </LanguageText>
                    {language === 'ko' && <CheckMark>✓</CheckMark>}
                </LanguageOption>
            </Section>
        </Container>
    );
}
