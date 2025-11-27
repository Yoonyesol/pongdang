import { View, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { CalendarView } from '../src/components/CalendarView';
import { useShiftStore } from '../src/store/useShiftStore';
import { TossButton } from '../src/components/TossButton';
import { router } from 'expo-router';
import { useLanguageStore } from '../src/store/useLanguageStore';
import { useTranslation } from '../src/translations';
import { Ionicons } from '@expo/vector-icons';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding-top: 60px;
`;

const Header = styled.View`
  padding: 20px;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
`;

const HeaderTextContainer = styled.View`
  flex: 1;
`;

const Title = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 4px;
`;

const SettingsButton = styled(TouchableOpacity)`
  padding: 8px;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: 0 20px;
`;

const ButtonGroup = styled.View`
  gap: 12px;
  margin-top: 20px;
  margin-bottom: 10px;
`;

export default function Home() {
    const shifts = useShiftStore((state) => state.shifts);
    const language = useLanguageStore((state) => state.language);
    const t = useTranslation(language);

    const handleDayPress = (day: any) => {
        router.push(`/diary/${day.dateString}`);
    };

    return (
        <Container>
            <Header>
                <HeaderTextContainer>
                    <Title>{t.home.title}</Title>
                    <Subtitle>{t.home.subtitle}</Subtitle>
                </HeaderTextContainer>
                <SettingsButton onPress={() => router.push('/settings')}>
                    <Ionicons name="settings-outline" size={28} color="#666" />
                </SettingsButton>
            </Header>

            <Content showsVerticalScrollIndicator={false}>
                <CalendarView onDayPress={handleDayPress} />

                <ButtonGroup>
                    <TossButton
                        title={t.home.setPattern}
                        onPress={() => router.push('/pattern')}
                    />

                    <TossButton
                        title={t.home.salarySettings}
                        onPress={() => router.push('/salary')}
                        variant="secondary"
                    />
                </ButtonGroup>
            </Content>
        </Container>
    );
}
