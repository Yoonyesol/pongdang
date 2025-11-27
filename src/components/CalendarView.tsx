import React, { useEffect } from 'react';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';
import { useTheme } from 'styled-components/native';
import { useShiftStore, ShiftType } from '../store/useShiftStore';
import { View, Text, TouchableOpacity } from 'react-native';
import { useLanguageStore } from '../store/useLanguageStore';

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

const getShiftLabel = (shiftType: ShiftType) => {
    switch (shiftType) {
        case 'day': return '☀️';
        case 'night': return '🌙';
        case 'evening': return '🌤️';
        case 'off': return '✕';
        default: return '';
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
        let color = theme.colors.surface;
        let textColor = theme.colors.text;

        switch (type) {
            case 'day':
                color = '#FFF4E0';
                textColor = '#D68000';
                break;
            case 'night':
                color = '#E8EBFF';
                textColor = '#3D4DBF';
                break;
            case 'off':
                color = '#F5F5F5';
                textColor = '#9E9E9E';
                break;
            case 'evening':
                color = '#FFE8D5';
                textColor = '#D66800';
                break;
        }

        acc[date] = {
            customStyles: {
                container: {
                    backgroundColor: color,
                    borderRadius: 8,
                    borderWidth: 2,
                    borderColor: textColor,
                },
                text: {
                    color: textColor,
                    fontWeight: 'bold',
                },
            },
            marked: true,
            dotColor: textColor,
        };
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
        const shiftLabel = getShiftLabel(shiftType);

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
                <View style={{ height: 18, marginTop: 2, justifyContent: 'center' }}>
                    {shiftLabel ? (
                        <Text style={{ fontSize: 16 }}>{shiftLabel}</Text>
                    ) : (
                        <Text style={{ fontSize: 16, opacity: 0 }}>　</Text>
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
