import React, { useState } from 'react';
import { ScrollView, Switch } from 'react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import { useSalaryStore } from '../../src/store/useSalaryStore';
import { TossButton } from '../../src/components/TossButton';

const Container = styled.ScrollView`
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

const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const Label = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  flex: 1;
`;

const Input = styled.TextInput`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-align: right;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
  padding: 8px;
  width: 100px;
`;

const Description = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 8px;
  line-height: 20px;
`;

export default function SalarySettings() {
    const router = useRouter();
    const { settings, updateSettings } = useSalaryStore();

    const [localSettings, setLocalSettings] = useState({
        hourlyWage: settings.hourlyWage.toString(),
        dayShiftHours: settings.dayShiftHours.toString(),
        nightShiftHours: settings.nightShiftHours.toString(),
        eveningShiftHours: settings.eveningShiftHours.toString(),
        nightAllowanceRate: (settings.nightAllowanceRate * 100).toString(),
        weekendAllowanceRate: (settings.weekendAllowanceRate * 100).toString(),
        holidayAllowanceRate: (settings.holidayAllowanceRate * 100).toString(),
        weeklyWorkDays: settings.weeklyWorkDays.toString(),
        weeklyHolidayPayEnabled: settings.weeklyHolidayPayEnabled,
    });

    const handleSave = () => {
        updateSettings({
            hourlyWage: parseFloat(localSettings.hourlyWage) || 10000,
            dayShiftHours: parseFloat(localSettings.dayShiftHours) || 8,
            nightShiftHours: parseFloat(localSettings.nightShiftHours) || 8,
            eveningShiftHours: parseFloat(localSettings.eveningShiftHours) || 8,
            nightAllowanceRate: (parseFloat(localSettings.nightAllowanceRate) || 50) / 100,
            weekendAllowanceRate: (parseFloat(localSettings.weekendAllowanceRate) || 50) / 100,
            holidayAllowanceRate: (parseFloat(localSettings.holidayAllowanceRate) || 150) / 100,
            weeklyWorkDays: parseInt(localSettings.weeklyWorkDays) || 5,
            weeklyHolidayPayEnabled: localSettings.weeklyHolidayPayEnabled,
        });
        router.back();
    };

    return (
        <Container contentContainerStyle={{ paddingBottom: 40 }}>
            <Header>
                <Title>급여 설정</Title>
            </Header>

            <Section>
                <SectionTitle>기본 정보</SectionTitle>

                <InputRow>
                    <Label>시급 (원)</Label>
                    <Input
                        keyboardType="numeric"
                        value={localSettings.hourlyWage}
                        onChangeText={(text) => setLocalSettings({ ...localSettings, hourlyWage: text })}
                    />
                </InputRow>

                <InputRow>
                    <Label>주간 근무 시간</Label>
                    <Input
                        keyboardType="numeric"
                        value={localSettings.dayShiftHours}
                        onChangeText={(text) => setLocalSettings({ ...localSettings, dayShiftHours: text })}
                    />
                </InputRow>

                <InputRow>
                    <Label>야간 근무 시간</Label>
                    <Input
                        keyboardType="numeric"
                        value={localSettings.nightShiftHours}
                        onChangeText={(text) => setLocalSettings({ ...localSettings, nightShiftHours: text })}
                    />
                </InputRow>

                <InputRow>
                    <Label>이브닝 근무 시간</Label>
                    <Input
                        keyboardType="numeric"
                        value={localSettings.eveningShiftHours}
                        onChangeText={(text) => setLocalSettings({ ...localSettings, eveningShiftHours: text })}
                    />
                </InputRow>
            </Section>

            <Section>
                <SectionTitle>수당 설정</SectionTitle>

                <InputRow>
                    <Label>야간 수당률 (%)</Label>
                    <Input
                        keyboardType="numeric"
                        value={localSettings.nightAllowanceRate}
                        onChangeText={(text) => setLocalSettings({ ...localSettings, nightAllowanceRate: text })}
                    />
                </InputRow>

                <InputRow>
                    <Label>주말 수당률 (%)</Label>
                    <Input
                        keyboardType="numeric"
                        value={localSettings.weekendAllowanceRate}
                        onChangeText={(text) => setLocalSettings({ ...localSettings, weekendAllowanceRate: text })}
                    />
                </InputRow>

                <InputRow>
                    <Label>공휴일 수당률 (%)</Label>
                    <Input
                        keyboardType="numeric"
                        value={localSettings.holidayAllowanceRate}
                        onChangeText={(text) => setLocalSettings({ ...localSettings, holidayAllowanceRate: text })}
                    />
                </InputRow>

                <Description>
                    💡 수당은 기본급에 대한 비율입니다. 예: 50% = 기본급의 50% 추가 지급
                </Description>
            </Section>

            <Section>
                <SectionTitle>주휴수당 설정</SectionTitle>

                <InputRow>
                    <Label>주휴수당 포함</Label>
                    <Switch
                        value={localSettings.weeklyHolidayPayEnabled}
                        onValueChange={(value) => setLocalSettings({ ...localSettings, weeklyHolidayPayEnabled: value })}
                        trackColor={{ false: '#e0e0e0', true: '#3182f6' }}
                    />
                </InputRow>

                {localSettings.weeklyHolidayPayEnabled && (
                    <InputRow>
                        <Label>주 소정근로일수</Label>
                        <Input
                            keyboardType="numeric"
                            value={localSettings.weeklyWorkDays}
                            onChangeText={(text) => setLocalSettings({ ...localSettings, weeklyWorkDays: text })}
                        />
                    </InputRow>
                )}

                <Description>
                    💡 주휴수당: 주 5일 근무 시 유급 휴일 1일분의 임금을 추가로 지급
                </Description>
            </Section>

            <TossButton title="저장하기" onPress={handleSave} />
        </Container>
    );
}
