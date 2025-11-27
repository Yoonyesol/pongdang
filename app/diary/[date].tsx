import React, { useState, useEffect } from 'react';
import { View, Alert, TouchableOpacity, Modal } from 'react-native';
import styled from 'styled-components/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TossButton } from '../../src/components/TossButton';
import { useDiarySalaryStore } from '../../src/store/useDiarySalaryStore';
import { useLanguageStore } from '../../src/store/useLanguageStore';
import { useTranslation } from '../../src/translations';
import { useShiftStore, ShiftType } from '../../src/store/useShiftStore';
import { Calendar } from 'react-native-calendars';

const Container = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: 20px;
`;

const Header = styled.View`
  margin-top: 40px;
  margin-bottom: 20px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
`;

const DateText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 4px;
`;

const Section = styled.View`
  margin-bottom: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 12px;
`;

const PatternInfoCard = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
`;

const PatternInfoText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 4px;
`;

const PatternDateText = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const ShiftButtonsRow = styled.View`
  flex-direction: row;
  gap: 8px;
  margin-bottom: 20px;
`;

const ShiftButton = styled(TouchableOpacity) <{ selected: boolean; shiftType: string }>`
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  align-items: center;
  background-color: ${({ selected, shiftType }) => {
    if (!selected) return '#F5F5F5';
    switch (shiftType) {
      case 'day': return '#FFB300';
      case 'night': return '#5B6EFF';
      case 'evening': return '#FF8A00';
      case 'off': return '#E5E8EB';
      default: return '#F5F5F5';
    }
  }};
  border: 2px solid ${({ selected, shiftType }) => {
    if (!selected) return 'transparent';
    switch (shiftType) {
      case 'day': return '#D68000';
      case 'night': return '#3D4DBF';
      case 'evening': return '#D66800';
      case 'off': return '#9E9E9E';
      default: return 'transparent';
    }
  }};
`;

const ShiftButtonText = styled.Text<{ selected: boolean }>`
  font-size: 14px;
  font-weight: ${({ selected }) => selected ? 'bold' : '600'};
  color: ${({ selected }) => selected ? '#FFF' : '#666'};
`;

const DiaryInput = styled.TextInput`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  min-height: 200px;
  text-align-vertical: top;
`;

const ModalContainer = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: 20px;
  padding: 20px;
  width: 90%;
  max-width: 400px;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;
`;

const DatePickerRow = styled.View`
  margin-bottom: 12px;
`;

const DateLabel = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 8px;
`;

const DateButton = styled(TouchableOpacity)`
  padding: 12px;
  background-color: #F5F5F5;
  border-radius: 8px;
`;

const DateButtonText = styled.Text`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const shiftTypes: { type: ShiftType; labelEn: string; labelKo: string }[] = [
  { type: 'day', labelEn: 'Day', labelKo: '주간' },
  { type: 'night', labelEn: 'Night', labelKo: '야간' },
  { type: 'evening', labelEn: 'Evening', labelKo: '이브닝' },
  { type: 'off', labelEn: 'Off', labelKo: '휴무' },
];

export default function DiaryScreen() {
  const router = useRouter();
  const { date } = useLocalSearchParams<{ date: string }>();
  const [content, setContent] = useState('');
  const [selectedShift, setSelectedShift] = useState<ShiftType | null>(null);
  const { diaries, setDiary } = useDiarySalaryStore();
  const { shifts, setShift, findPatternGroupForDate, updatePatternGroupDates } = useShiftStore();
  const language = useLanguageStore((state) => state.language);
  const t = useTranslation(language);

  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [newStartDate, setNewStartDate] = useState<string>('');
  const [newEndDate, setNewEndDate] = useState<string>('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const patternGroup = date ? findPatternGroupForDate(date) : null;

  useEffect(() => {
    if (date) {
      if (diaries[date]) {
        setContent(diaries[date]);
      }
      if (shifts[date]) {
        setSelectedShift(shifts[date]);
      }
      if (patternGroup) {
        setNewStartDate(patternGroup.startDate);
        setNewEndDate(patternGroup.endDate);
      }
    }
  }, [date, diaries, shifts]);

  const handleSave = () => {
    if (!date) return;

    setDiary(date, content);

    if (selectedShift) {
      setShift(date, selectedShift);
    }

    Alert.alert(t.diary.saved, t.diary.savedMsg, [
      { text: t.pattern.ok, onPress: () => router.back() }
    ]);
  };

  const handleUpdatePatternDates = () => {
    if (!patternGroup || !newStartDate || !newEndDate) return;

    updatePatternGroupDates(patternGroup.id, newStartDate, newEndDate);
    setShowAdjustModal(false);

    Alert.alert(
      language === 'ko' ? '완료' : 'Done',
      language === 'ko' ? '패턴 기간이 수정되었습니다' : 'Pattern dates updated'
    );
  };

  return (
    <Container contentContainerStyle={{ paddingBottom: 20 }}>
      <Header>
        <Title>{t.diary.title}</Title>
        <DateText>{date}</DateText>
      </Header>

      {patternGroup && (
        <Section>
          <SectionTitle>
            {language === 'ko' ? '근무 패턴 정보' : 'Pattern Info'}
          </SectionTitle>
          <PatternInfoCard>
            <PatternInfoText>
              {language === 'ko' ? '패턴 기간' : 'Pattern Duration'}
            </PatternInfoText>
            <PatternDateText>
              {patternGroup.startDate} ~ {patternGroup.endDate}
            </PatternDateText>
          </PatternInfoCard>
          <TossButton
            title={language === 'ko' ? '기간 수정하기' : 'Edit Dates'}
            onPress={() => setShowAdjustModal(true)}
            variant="secondary"
          />
        </Section>
      )}

      <Section>
        <SectionTitle>{t.diary.shiftType}</SectionTitle>
        <ShiftButtonsRow>
          {shiftTypes.map(({ type, labelEn, labelKo }) => (
            <ShiftButton
              key={type}
              selected={selectedShift === type}
              shiftType={type}
              onPress={() => setSelectedShift(type)}
            >
              <ShiftButtonText selected={selectedShift === type}>
                {language === 'ko' ? labelKo : labelEn}
              </ShiftButtonText>
            </ShiftButton>
          ))}
        </ShiftButtonsRow>
      </Section>

      <DiaryInput
        multiline
        placeholder={t.diary.placeholder}
        value={content}
        onChangeText={setContent}
        placeholderTextColor="#B0B8C1"
      />

      <View style={{ marginTop: 20 }}>
        <TossButton title={t.diary.saveEntry} onPress={handleSave} />
      </View>

      <Modal
        visible={showAdjustModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAdjustModal(false)}
      >
        <ModalContainer>
          <ModalContent>
            <ModalTitle>
              {language === 'ko' ? '패턴 기간 수정' : 'Edit Pattern Dates'}
            </ModalTitle>

            <DatePickerRow>
              <DateLabel>{t.pattern.startDate}</DateLabel>
              <DateButton onPress={() => setShowStartPicker(!showStartPicker)}>
                <DateButtonText>{newStartDate}</DateButtonText>
              </DateButton>
              {showStartPicker && (
                <View style={{ marginTop: 12 }}>
                  <Calendar
                    onDayPress={(day) => {
                      setNewStartDate(day.dateString);
                      setShowStartPicker(false);
                    }}
                    markedDates={{ [newStartDate]: { selected: true } }}
                  />
                </View>
              )}
            </DatePickerRow>

            <DatePickerRow>
              <DateLabel>{t.pattern.endDate}</DateLabel>
              <DateButton onPress={() => setShowEndPicker(!showEndPicker)}>
                <DateButtonText>{newEndDate}</DateButtonText>
              </DateButton>
              {showEndPicker && (
                <View style={{ marginTop: 12 }}>
                  <Calendar
                    onDayPress={(day) => {
                      setNewEndDate(day.dateString);
                      setShowEndPicker(false);
                    }}
                    markedDates={{ [newEndDate]: { selected: true } }}
                    minDate={newStartDate}
                  />
                </View>
              )}
            </DatePickerRow>

            <View style={{ marginTop: 20, gap: 8 }}>
              <TossButton
                title={language === 'ko' ? '저장' : 'Save'}
                onPress={handleUpdatePatternDates}
              />
              <TossButton
                title={language === 'ko' ? '취소' : 'Cancel'}
                onPress={() => setShowAdjustModal(false)}
                variant="secondary"
              />
            </View>
          </ModalContent>
        </ModalContainer>
      </Modal>
    </Container>
  );
}
