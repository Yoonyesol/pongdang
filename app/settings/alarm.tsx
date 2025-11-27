import React from 'react';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

const IconContainer = styled.View`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background-color: ${({ theme }) => theme.colors.surface};
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 12px;
  text-align: center;
`;

const Description = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  line-height: 24px;
  margin-bottom: 32px;
  padding: 0 20px;
`;

const InfoBox = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
`;

const InfoText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 20px;
`;

export default function AlarmPlaceholder() {
    const router = useRouter();

    return (
        <Container>
            <IconContainer>
                <Ionicons name="notifications-outline" size={50} color="#999" />
            </IconContainer>

            <Title>알람 기능 준비 중</Title>

            <Description>
                교대 근무에 맞춘 자동 알람 기능은{'\n'}
                개발 빌드(Development Build)에서 사용할 수 있습니다.
            </Description>

            <InfoBox>
                <InfoText>
                    💡 Expo Go에서는 네이티브 알림 기능이 제한됩니다.{'\n\n'}
                    실제 기기에서 테스트하려면 Development Build를 생성해주세요.{'\n\n'}
                    자세한 내용: docs.expo.dev/develop/development-builds
                </InfoText>
            </InfoBox>
        </Container>
    );
}
