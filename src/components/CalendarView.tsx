import React, { useEffect } from 'react';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { useTheme } from 'styled-components/native';
import { useShiftStore, ShiftType } from '../store/useShiftStore';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLanguageStore } from '../store/useLanguageStore';
import styled from 'styled-components/native';

// Configure Korean locale
LocaleConfig.locales['ko'] = {
  monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  today: '오늘'
};

LocaleConfig.locales['en'] = {
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
  today: 'Today'
};

LocaleConfig.defaultLocale = 'ko';

interface CalendarViewProps {
  onDayPress: (date: DateData) => void;
}

const Badge = styled.View<{ backgroundColor: string }>`
  background-color: ${({ backgroundColor }) => backgroundColor};
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 2px;
  min-width: 24px;
  align-items: center;
  justify-content: center;
`;

const BadgeText = styled.Text<{ color: string }>`
  color: ${({ color }) => color};
  font-size: 12px;
  font-weight: bold;
`;

const getShiftConfig = (shiftType: ShiftType, language: 'ko' | 'en') => {
  const isKo = language === 'ko';
  switch (shiftType) {
    case 'day': 
      return { 
        text: isKo ? '주' : 'D', 
        bg: '#FFF4E0', 
        color: '#D68000' 
      };
    case 'night': 
      return { 
        text: isKo ? '야' : 'N', 
        bg: '#E8EBFF', 
        color: '#3D4DBF' 
      };
    case 'evening': 
      return { 
        text: isKo ? '이' : 'E', 
        bg: '#FFE8D5', 
        color: '#D66800' 
      };
    case 'off': 
      return { 
        text: isKo ? '휴' : 'O', 
        bg: '#F5F5F5', 
        color: '#9E9E9E' 
      };
    default: 
      return null;
  }
};

export const CalendarView = ({ onDayPress }: CalendarViewProps) => {
  const theme = useTheme();
  const shifts = useShiftStore((state) => state.shifts);
  const language = useLanguageStore((state) => state.language);

  useEffect(() => {
    LocaleConfig.defaultLocale = language;
  }, [language]);

  const markedDates = Object.keys(shifts).reduce((acc, date) => {
    const type = shifts[date];
    const config = getShiftConfig(type, language);
    
    if (config) {
      acc[date] = {
        customStyles: {
          container: {
            backgroundColor: config.bg,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: config.bg, // Use bg color for border to look seamless
          },
          text: {
            color: theme.colors.text,
            fontWeight: 'bold',
          },
        },
        marked: true,
      };
    }
    return acc;
  }, {} as any);

  const renderHeader = (date: any) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const monthName = LocaleConfig.locales[language].monthNames[date.getMonth()];

    if (language === 'ko') {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text }}>
            {year}년 {month}월
          </Text>
        </View>
      );
    } else {
      return (
        <View style={{ flexDirection: 'row', justifyContent: 'center', paddingVertical: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.colors.text }}>
            {monthName} {year}
          </Text>
        </View>
      );
    }
  };

  const dayComponent = ({ date, state }: any) => {
    const dateString = date.dateString;
    const shiftType = shifts[dateString];
    const config = getShiftConfig(shiftType, language);
    
    let textColor = '#333';
    if (state === 'disabled') {
      textColor = '#d9e1e8';
    } else if (state === 'today') {
      textColor = '#0066FF';
    }

    return (
      <TouchableOpacity 
        onPress={() => onDayPress(date)}
        style={{ height: 56, width: 48, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={{ fontSize: 16, fontWeight: state === 'today' ? 'bold' : '600', color: textColor }}>
          {date.day}
        </Text>
        <View style={{ height: 20, marginTop: 2, justifyContent: 'center' }}>
          {config ? (
            <Badge backgroundColor={config.bg}>
              <BadgeText color={config.color}>{config.text}</BadgeText>
            </Badge>
          ) : (
            <View style={{ height: 20 }} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Calendar
      onDayPress={onDayPress}
      markingType={'custom'}
      markedDates={markedDates}
      renderHeader={renderHeader}
      dayComponent={dayComponent}
      theme={{
        backgroundColor: theme.colors.surface,
        calendarBackground: theme.colors.surface,
        textSectionTitleColor: theme.colors.textSecondary,
        selectedDayBackgroundColor: theme.colors.primary,
        selectedDayTextColor: theme.colors.white,
        todayTextColor: theme.colors.primary,
        dayTextColor: theme.colors.text,
        textDisabledColor: theme.colors.textTertiary,
        dotColor: theme.colors.primary,
        selectedDotColor: theme.colors.white,
        arrowColor: theme.colors.primary,
        monthTextColor: theme.colors.text,
        indicatorColor: theme.colors.primary,
        textDayFontFamily: 'System',
        textMonthFontFamily: 'System',
        textDayHeaderFontFamily: 'System',
        textDayFontWeight: '600' as any,
        textMonthFontWeight: 'bold' as any,
        textDayHeaderFontWeight: '500' as any,
        textDayFontSize: 16,
        textMonthFontSize: 20,
        textDayHeaderFontSize: 14,
      }}
      style={{
        borderRadius: 20,
        paddingBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
      }}
    />
  );
};
