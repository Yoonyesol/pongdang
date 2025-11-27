import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'ko';

interface LanguageState {
    language: Language;
    setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>()(
    persist(
        (set) => ({
            language: 'ko',
            setLanguage: (lang) => set({ language: lang }),
        }),
        {
            name: 'language-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
