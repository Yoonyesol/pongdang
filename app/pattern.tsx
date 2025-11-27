import React, { useState } from 'react';
import { View, ScrollView, Alert, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { useRouter } from 'expo-router';
import { format, addMonths, startOfMonth, endOfMonth } from 'date-fns';
import { TossButton } from '../src/components/TossButton';
import { useShiftStore, ShiftType } from '../src/store/useShiftStore';
import { useLanguageStore } from '../src/store/useLanguageStore';
import { useTranslation } from '../src/translations';
import { Calendar } from 'react-native-calendars';

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
`;

const Header = styled.View`
  margin-bottom: 24px;
  margin-top: 40px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 8px;
`;

const Subtitle = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 12px;
  margin-top: 20px;
`;

const PatternButton = styled(TouchableOpacity) <{ selected: boolean }>`
  padding: 16px;
  background-color: ${({ theme, selected }) => selected ? theme.colors.primary : theme.colors.surface};
  border-radius: 12px;
  margin-bottom: 8px;
  border: 1px solid ${({ theme, selected }) => selected ? theme.colors.primary : 'transparent'};
`;

const PatternText = styled.Text<{ selected: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme, selected }) => selected ? theme.colors.white : theme.colors.text};
`;

const DateRangeButton = styled(TouchableOpacity) <{ selected: boolean }>`
  padding: 12px 16px;
  background-color: ${({ theme, selected }) => selected ? theme.colors.primary + '20' : theme.colors.surface};
  border-radius: 8px;
  margin-bottom: 8px;
  border: 2px solid ${({ theme, selected }) => selected ? theme.colors.primary : 'transparent'};
`;

const DateRangeText = styled.Text<{ selected: boolean }>`
  font-size: 14px;
  font-weight: ${({ selected }) => selected ? 'bold' : '600'};
  color: ${({ theme, selected }) => selected ? theme.colors.primary : theme.colors.text};
`;

type RangeType = 'today' | 'month' | 'custom';

const patternConfigs: { key: 'pongdang' | '3shift' | '22pattern'; pattern: ShiftType[] }[] = [
    { key: 'pongdang', pattern: ['day', 'off'] },
    { key: '3shift', pattern: ['day', 'evening', 'night', 'off'] },
    { key: '22pattern', pattern: ['day', 'day', 'night', 'night', 'off', 'off'] },
];

export default function PatternScreen() {
    const router = useRouter();
    const { addPatternGroup } = useShiftStore();
    const language = useLanguageStore((state) => state.language);
    const t = useTranslation(language);

    const [selectedPattern, setSelectedPattern] = useState<'pongdang' | '3shift' | '22pattern' | null>(null);
    const [rangeType, setRangeType] = useState<RangeType>('today');
    const [customStartDate, setCustomStartDate] = useState<string>('');
    const [customEndDate, setCustomEndDate] = useState<string>('');
    const [showStartCalendar, setShowStartCalendar] = useState(false);
    const [showEndCalendar, setShowEndCalendar] = useState(false);

    const handleApply = () => {
        if (!selectedPattern) {
            Alert.alert(t.pattern.selectPattern, t.pattern.selectPatternMsg);
            return;
        }

        let startDate: string;
        let endDate: string;
        const today = new Date();

        switch (rangeType) {
            case 'today':
                startDate = format(today, 'yyyy-MM-dd');
                endDate = format(addMonths(today, 6), 'yyyy-MM-dd');
                break;
            case 'month':
                startDate = format(startOfMonth(today), 'yyyy-MM-dd');
                endDate = format(endOfMonth(today), 'yyyy-MM-dd');
                break;
            case 'custom':
                if (!customStartDate || !customEndDate) {
                    Alert.alert(t.pattern.selectPattern, '시작일과 종료일을 선택해 주세요.');
                    return;
                }
                startDate = customStartDate;
                endDate = customEndDate;
                break;
            default:
                return;
        }

        const patternConfig = patternConfigs.find(p => p.key === selectedPattern);
        if (!patternConfig) return;

        addPatternGroup(startDate, endDate, patternConfig.pattern);

        Alert.alert(t.pattern.success, t.pattern.patternApplied, [
            { text: t.pattern.ok, onPress: () => router.back() }
        ]);
    };

    return (
        <Container>
            <Header>
                <Title>{t.pattern.title}</Title>
                <Subtitle>{t.pattern.subtitle}</Subtitle>
            </Header>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
                <SectionTitle>{t.pattern.popularPatterns}</SectionTitle>

                <PatternButton
                    selected={selectedPattern === 'pongdang'}
                    onPress={() => setSelectedPattern('pongdang')}
                >
                    <PatternText selected={selectedPattern === 'pongdang'}>
                        {t.pattern.pongdang}
                    </PatternText>
                </PatternButton>

                <PatternButton
                    selected={selectedPattern === '3shift'}
                    onPress={() => setSelectedPattern('3shift')}
                >
                    <PatternText selected={selectedPattern === '3shift'}>
                        {t.pattern.threeShift}
                    </PatternText>
                </PatternButton>

                <PatternButton
                    selected={selectedPattern === '22pattern'}
                    onPress={() => setSelectedPattern('22pattern')}
                >
                    <PatternText selected={selectedPattern === '22pattern'}>
                        {t.pattern.twoTwo}
                    </PatternText>
                </PatternButton>

                <SectionTitle>{t.pattern.dateRange}</SectionTitle>

                <DateRangeButton
                    selected={rangeType === 'today'}
                    onPress={() => setRangeType('today')}
                >
                    <DateRangeText selected={rangeType === 'today'}>
                        {t.pattern.fromToday}
                    </DateRangeText>
                </DateRangeButton>

                <DateRangeButton
                    selected={rangeType === 'month'}
                    onPress={() => setRangeType('month')}
                >
                    <DateRangeText selected={rangeType === 'month'}>
                        {t.pattern.thisMonthOnly}
                    </DateRangeText>
                </DateRangeButton>

                <DateRangeButton
                    selected={rangeType === 'custom'}
                    onPress={() => setRangeType('custom')}
                >
                    <DateRangeText selected={rangeType === 'custom'}>
                        {t.pattern.customRange}
                        {customStartDate && customEndDate && ` (${customStartDate} ~ ${customEndDate})`}
                    </DateRangeText>
                </DateRangeButton>

                {rangeType === 'custom' && (
                    <View style={{ marginTop: 16, marginBottom: 16 }}>
                        <TouchableOpacity
                            style={{ marginBottom: 12, padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8 }}
                            onPress={() => setShowStartCalendar(!showStartCalendar)}
                        >
                            <DateRangeText selected={false}>
                                {t.pattern.startDate}: {customStartDate || t.pattern.selectPattern}
                            </DateRangeText>
                        </TouchableOpacity>

                        {showStartCalendar && (
                            <Calendar
                                onDayPress={(day) => {
                                    setCustomStartDate(day.dateString);
                                    setShowStartCalendar(false);
                                }}
                                markedDates={customStartDate ? { [customStartDate]: { selected: true } } : {}}
                            />
                        )}

                        <TouchableOpacity
                            style={{ marginTop: 12, padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8 }}
                            onPress={() => setShowEndCalendar(!showEndCalendar)}
                        >
                            <DateRangeText selected={false}>
                                {t.pattern.endDate}: {customEndDate || t.pattern.selectPattern}
                            </DateRangeText>
                        </TouchableOpacity>

                        {showEndCalendar && (
                            <Calendar
                                onDayPress={(day) => {
                                    setCustomEndDate(day.dateString);
                                    setShowEndCalendar(false);
                                }}
                                markedDates={customEndDate ? { [customEndDate]: { selected: true } } : {}}
                                minDate={customStartDate}
                            />
                        )}
                    </View>
                )}

                <View style={{ marginTop: 40 }}>
                    <TossButton
                        title={t.pattern.applyPattern}
                        onPress={handleApply}
                        disabled={!selectedPattern}
                    />
                </View>
            </ScrollView>
        </Container>
    );
}
