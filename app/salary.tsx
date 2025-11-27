import React, { useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSalaryStore } from '../src/store/useSalaryStore';
import { useShiftStore } from '../src/store/useShiftStore';
import { calculateMonthlySalary } from '../src/utils/salaryCalculator';
import { TossButton } from '../src/components/TossButton';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 40px;
  margin-bottom: 24px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const SettingsButton = styled.TouchableOpacity`
  padding: 8px;
`;

const TotalCard = styled.View`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 20px;
  padding: 32px 24px;
  margin-bottom: 20px;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  elevation: 5;
`;

const TotalLabel = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
`;

const TotalAmount = styled.Text`
  font-size: 42px;
  font-weight: bold;
  color: #FFFFFF;
  margin-bottom: 16px;
`;

const BreakdownRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const BreakdownLabel = styled.Text`
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
`;

const BreakdownValue = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #FFFFFF;
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

const StatRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.border};
`;

const StatLabel = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StatValue = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const MonthSelector = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const MonthButton = styled.TouchableOpacity`
  padding: 8px 16px;
`;

const MonthText = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 20px;
`;

export default function SalaryScreen() {
  const router = useRouter();
  const { settings } = useSalaryStore();
  const shifts = useShiftStore((state) => state.shifts);

  const today = new Date();
  const [selectedYear, setSelectedYear] = React.useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = React.useState(today.getMonth() + 1);

  const monthlySalary = useMemo(() => {
    return calculateMonthlySalary(shifts, settings, selectedYear, selectedMonth);
  }, [shifts, settings, selectedYear, selectedMonth]);

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  return (
    <Container>
      <Header>
        <Title>급여 계산</Title>
        <SettingsButton onPress={() => router.push('/salary/settings')}>
          <Ionicons name="settings-outline" size={28} color="#666" />
        </SettingsButton>
      </Header>

      <ScrollView showsVerticalScrollIndicator={false}>
        <MonthSelector>
          <MonthButton onPress={handlePrevMonth}>
            <Ionicons name="chevron-back" size={24} color="#666" />
          </MonthButton>
          <MonthText>
            {selectedYear}년 {selectedMonth}월
          </MonthText>
          <MonthButton onPress={handleNextMonth}>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </MonthButton>
        </MonthSelector>

        <TotalCard>
          <TotalLabel>예상 급여</TotalLabel>
          <TotalAmount>₩ {monthlySalary.totalPay.toLocaleString()}</TotalAmount>

          <BreakdownRow>
            <BreakdownLabel>기본급</BreakdownLabel>
            <BreakdownValue>₩ {monthlySalary.basePay.toLocaleString()}</BreakdownValue>
          </BreakdownRow>
          {monthlySalary.nightAllowance > 0 && (
            <BreakdownRow>
              <BreakdownLabel>야간 수당</BreakdownLabel>
              <BreakdownValue>₩ {monthlySalary.nightAllowance.toLocaleString()}</BreakdownValue>
            </BreakdownRow>
          )}
          {monthlySalary.weekendAllowance > 0 && (
            <BreakdownRow>
              <BreakdownLabel>주말 수당</BreakdownLabel>
              <BreakdownValue>₩ {monthlySalary.weekendAllowance.toLocaleString()}</BreakdownValue>
            </BreakdownRow>
          )}
          {monthlySalary.weeklyHolidayPay > 0 && (
            <BreakdownRow>
              <BreakdownLabel>주휴수당</BreakdownLabel>
              <BreakdownValue>₩ {monthlySalary.weeklyHolidayPay.toLocaleString()}</BreakdownValue>
            </BreakdownRow>
          )}
        </TotalCard>

        <Section>
          <SectionTitle>근무 통계</SectionTitle>

          <StatRow>
            <StatLabel>총 근무일수</StatLabel>
            <StatValue>{monthlySalary.workDays}일</StatValue>
          </StatRow>

          <StatRow>
            <StatLabel>주간 근무</StatLabel>
            <StatValue>
              {monthlySalary.dayShiftCount}일 ({monthlySalary.dayShiftCount * settings.dayShiftHours}h)
            </StatValue>
          </StatRow>

          <StatRow>
            <StatLabel>야간 근무</StatLabel>
            <StatValue>
              {monthlySalary.nightShiftCount}일 ({monthlySalary.nightShiftCount * settings.nightShiftHours}h)
            </StatValue>
          </StatRow>

          <StatRow>
            <StatLabel>이브닝 근무</StatLabel>
            <StatValue>
              {monthlySalary.eveningShiftCount}일 ({monthlySalary.eveningShiftCount * settings.eveningShiftHours}h)
            </StatValue>
          </StatRow>

          <StatRow style={{ borderBottomWidth: 0 }}>
            <StatLabel>휴무</StatLabel>
            <StatValue>{monthlySalary.offDays}일</StatValue>
          </StatRow>
        </Section>

        <Section>
          <SectionTitle>급여 설정 요약</SectionTitle>

          <StatRow>
            <StatLabel>시급</StatLabel>
            <StatValue>₩ {settings.hourlyWage.toLocaleString()}</StatValue>
          </StatRow>

          <StatRow>
            <StatLabel>야간 수당률</StatLabel>
            <StatValue>{(settings.nightAllowanceRate * 100)}%</StatValue>
          </StatRow>

          <StatRow>
            <StatLabel>주말 수당률</StatLabel>
            <StatValue>{(settings.weekendAllowanceRate * 100)}%</StatValue>
          </StatRow>

          <StatRow style={{ borderBottomWidth: 0 }}>
            <StatLabel>주휴수당</StatLabel>
            <StatValue>{settings.weeklyHolidayPayEnabled ? '포함' : '미포함'}</StatValue>
          </StatRow>
        </Section>

        <TossButton
          title="급여 설정 변경"
          onPress={() => router.push('/salary/settings')}
          variant="secondary"
        />
      </ScrollView>
    </Container>
  );
}
