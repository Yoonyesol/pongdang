import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SalarySettings {
    // 기본 급여
    hourlyWage: number;              // 시급

    // 근무 시간
    dayShiftHours: number;           // 주간 근무 시간
    nightShiftHours: number;         // 야간 근무 시간
    eveningShiftHours: number;       // 이브닝 근무 시간

    // 수당 설정 (비율, 0.5 = 50%)
    nightAllowanceRate: number;      // 야간 수당률
    weekendAllowanceRate: number;    // 주말 수당률
    holidayAllowanceRate: number;    // 공휴일 수당률
    overtimeAllowanceRate: number;   // 연장근로 수당률

    // 주휴수당 설정
    weeklyHolidayPayEnabled: boolean; // 주휴수당 포함 여부
    weeklyWorkDays: number;           // 주 소정근로일수
}

interface SalaryState {
    settings: SalarySettings;
    updateSettings: (settings: Partial<SalarySettings>) => void;
    resetSettings: () => void;
}

const defaultSettings: SalarySettings = {
    hourlyWage: 10000,
    dayShiftHours: 8,
    nightShiftHours: 8,
    eveningShiftHours: 8,
    nightAllowanceRate: 0.5,
    weekendAllowanceRate: 0.5,
    holidayAllowanceRate: 1.5,
    overtimeAllowanceRate: 0.5,
    weeklyHolidayPayEnabled: true,
    weeklyWorkDays: 5,
};

export const useSalaryStore = create<SalaryState>()(
    persist(
        (set) => ({
            settings: defaultSettings,
            updateSettings: (newSettings) =>
                set((state) => ({
                    settings: { ...state.settings, ...newSettings },
                })),
            resetSettings: () => set({ settings: defaultSettings }),
        }),
        {
            name: 'salary-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
