import { Language } from '../store/useLanguageStore';

export const translations = {
    en: {
        // Home Screen
        home: {
            title: 'Shift Planner',
            subtitle: 'Manage your shifts and earnings',
            setPattern: 'Set Shift Pattern',
            salarySettings: 'Salary & Settings',
            deleteShifts: 'Delete Shifts',
            deleteShiftsAfter: 'Delete All Shifts After',
            selectDate: 'Select Date',
            confirmDelete: 'Delete Shifts',
            confirmDeleteMsg: 'Delete all shifts after this date?\n(Diary entries will be preserved)',
            deleted: 'Deleted',
            shiftsDeleted: 'Shifts have been deleted',
        },
        // Pattern Screen
        pattern: {
            title: 'Set Shift Pattern',
            subtitle: 'Choose your recurring work schedule',
            popularPatterns: 'Popular Patterns',
            pongdang: 'Pongdang (Day / Off)',
            threeShift: '3-Shift (Day / Eve / Night / Off)',
            twoTwo: '2-2 Pattern (2Day / 2Night / 2Off)',
            applyPattern: 'Apply Pattern',
            selectPattern: 'Select a pattern',
            selectPatternMsg: 'Please choose a shift pattern first.',
            success: 'Success',
            patternApplied: 'Shift pattern applied!',
            ok: 'OK',
            dateRange: 'Date Range',
            fromToday: 'From Today (6 months)',
            thisMonthOnly: 'This Month Only',
            customRange: 'Custom Range',
            startDate: 'Start Date',
            endDate: 'End Date',
        },
        // Diary Screen
        diary: {
            title: 'Diary',
            placeholder: 'Write about your day...',
            saveEntry: 'Save Entry',
            saved: 'Saved',
            savedMsg: 'Diary entry saved successfully!',
            shiftType: 'Shift Type',
            selectShift: 'Select Shift',
        },
        // Salary Screen
        salary: {
            title: 'Salary Management',
            estimatedSalary: 'Estimated Salary',
            shiftRates: 'Shift Rates (KRW)',
            dayShift: 'Day Shift',
            nightShift: 'Night Shift',
            eveningShift: 'Evening Shift',
            saveSettings: 'Save Settings',
            saved: 'Saved',
            savedMsg: 'Salary settings updated!',
        },
        // Settings Screen
        settings: {
            title: 'Settings',
            language: 'Language',
            english: 'English',
            korean: '한국어',
            selectLanguage: 'Select Language',
        },
    },
    ko: {
        // Home Screen
        home: {
            title: '근무 일정 관리',
            subtitle: '근무와 수익을 한눈에 관리하세요',
            setPattern: '근무 패턴 설정',
            salarySettings: '급여 및 설정',
            deleteShifts: '근무 삭제',
            deleteShiftsAfter: '특정 날짜 이후 근무 삭제',
            selectDate: '날짜 선택',
            confirmDelete: '근무 삭제',
            confirmDeleteMsg: '이 날짜 이후의 모든 근무를 삭제할까요?\n(일기는 보존됩니다)',
            deleted: '삭제됨',
            shiftsDeleted: '근무가 삭제되었습니다',
        },
        // Pattern Screen
        pattern: {
            title: '근무 패턴 설정',
            subtitle: '반복되는 근무 일정을 선택하세요',
            popularPatterns: '인기 패턴',
            pongdang: '퐁당퐁당 (주간 / 휴무)',
            threeShift: '3교대 (주간 / 이브닝 / 야간 / 휴무)',
            twoTwo: '주주야야휴휴 (주간2 / 야간2 / 휴무2)',
            applyPattern: '패턴 적용',
            selectPattern: '패턴을 선택하세요',
            selectPatternMsg: '먼저 근무 패턴을 선택해 주세요.',
            success: '성공',
            patternApplied: '근무 패턴이 적용되었습니다!',
            ok: '확인',
            dateRange: '기간 설정',
            fromToday: '오늘부터 (6개월)',
            thisMonthOnly: '이번 달만',
            customRange: '직접 지정',
            startDate: '시작일',
            endDate: '종료일',
        },
        // Diary Screen
        diary: {
            title: '일기',
            placeholder: '오늘 하루를 기록해 보세요...',
            saveEntry: '저장하기',
            saved: '저장됨',
            savedMsg: '일기가 성공적으로 저장되었습니다!',
            shiftType: '근무 타입',
            selectShift: '근무 선택',
        },
        // Salary Screen
        salary: {
            title: '급여 관리',
            estimatedSalary: '예상 급여',
            shiftRates: '근무별 급여 (원)',
            dayShift: '주간 근무',
            nightShift: '야간 근무',
            eveningShift: '이브닝 근무',
            saveSettings: '설정 저장',
            saved: '저장됨',
            savedMsg: '급여 설정이 업데이트되었습니다!',
        },
        // Settings Screen
        settings: {
            title: '설정',
            language: '언어',
            english: 'English',
            korean: '한국어',
            selectLanguage: '언어 선택',
        },
    },
};

export const useTranslation = (lang: Language) => {
    return translations[lang];
};
