import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface DiaryEntry {
    date: string;
    content: string;
}

export interface SalarySettings {
    dayShiftRate: number;
    nightShiftRate: number;
    eveningShiftRate: number;
    offShiftRate: number; // Usually 0, but maybe for paid leave
}

interface DiarySalaryState {
    diaries: Record<string, string>; // date -> content
    salarySettings: SalarySettings;
    setDiary: (date: string, content: string) => void;
    setSalarySettings: (settings: SalarySettings) => void;
}

export const useDiarySalaryStore = create<DiarySalaryState>()(
    persist(
        (set) => ({
            diaries: {},
            salarySettings: {
                dayShiftRate: 100000, // Default example
                nightShiftRate: 150000,
                eveningShiftRate: 120000,
                offShiftRate: 0,
            },
            setDiary: (date, content) =>
                set((state) => ({
                    diaries: { ...state.diaries, [date]: content },
                })),
            setSalarySettings: (settings) =>
                set((state) => ({
                    salarySettings: { ...state.salarySettings, ...settings },
                })),
        }),
        {
            name: 'diary-salary-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
