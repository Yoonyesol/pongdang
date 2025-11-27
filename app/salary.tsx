import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import { TossButton } from '../src/components/TossButton';
import { useDiarySalaryStore } from '../src/store/useDiarySalaryStore';
import { useShiftStore } from '../src/store/useShiftStore';
import { format } from 'date-fns';
import { useLanguageStore } from '../src/store/useLanguageStore';
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

const InputRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const Label = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const AmountInput = styled.TextInput`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-align: right;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
  padding-bottom: 4px;
  width: 120px;
`;

const TotalContainer = styled.View`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 16px;
  padding: 24px;
  align-items: center;
  margin-bottom: 24px;
`;

const TotalLabel = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
`;

const TotalAmount = styled.Text`
  font-size: 32px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.white};
`;

export default function SalaryScreen() {
  const router = useRouter();
  const { salarySettings, setSalarySettings } = useDiarySalaryStore();
  const shifts = useShiftStore((state) => state.shifts);
  const language = useLanguageStore((state) => state.language);
  const t = useTranslation(language);

  const [rates, setRates] = useState({
    day: salarySettings.dayShiftRate.toString(),
    night: salarySettings.nightShiftRate.toString(),
    evening: salarySettings.eveningShiftRate.toString(),
  });

  const currentMonth = format(new Date(), 'yyyy-MM');
  const calculateTotal = () => {
    let total = 0;
    Object.entries(shifts).forEach(([date, type]) => {
      if (date.startsWith(currentMonth)) {
        if (type === 'day') total += parseInt(rates.day) || 0;
        if (type === 'night') total += parseInt(rates.night) || 0;
        if (type === 'evening') total += parseInt(rates.evening) || 0;
      }
    });
    return total;
  };

  const handleSave = () => {
    setSalarySettings({
      ...salarySettings,
      dayShiftRate: parseInt(rates.day) || 0,
      nightShiftRate: parseInt(rates.night) || 0,
      eveningShiftRate: parseInt(rates.evening) || 0,
    });
    Alert.alert(t.salary.saved, t.salary.savedMsg);
  };

  return (
    <Container>
      <Header>
        <Title>{t.salary.title}</Title>
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <TotalContainer>
          <TotalLabel>{t.salary.estimatedSalary} ({currentMonth})</TotalLabel>
          <TotalAmount>₩ {calculateTotal().toLocaleString()}</TotalAmount>
        </TotalContainer>

        <Section>
          <SectionTitle>{t.salary.shiftRates}</SectionTitle>

          <InputRow>
            <Label>{t.salary.dayShift}</Label>
            <AmountInput
              keyboardType="numeric"
              value={rates.day}
              onChangeText={(text: string) => setRates(prev => ({ ...prev, day: text }))}
            />
          </InputRow>

          <InputRow>
            <Label>{t.salary.nightShift}</Label>
            <AmountInput
              keyboardType="numeric"
              value={rates.night}
              onChangeText={(text: string) => setRates(prev => ({ ...prev, night: text }))}
            />
          </InputRow>

          <InputRow>
            <Label>{t.salary.eveningShift}</Label>
            <AmountInput
              keyboardType="numeric"
              value={rates.evening}
              onChangeText={(text: string) => setRates(prev => ({ ...prev, evening: text }))}
            />
          </InputRow>
        </Section>

        <TossButton title={t.salary.saveSettings} onPress={handleSave} />
      </ScrollView>
    </Container>
  );
}
