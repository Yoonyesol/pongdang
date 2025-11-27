import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple ID generator
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export type ShiftType = 'day' | 'night' | 'off' | 'evening';

export interface Shift {
    date: string; // YYYY-MM-DD
    type: ShiftType;
}

export interface PatternGroup {
    id: string;
    pattern: ShiftType[];
    startDate: string;
    endDate: string;
    createdAt: number;
}

interface ShiftState {
    shifts: Record<string, ShiftType>; // date -> type
    patternGroups: PatternGroup[];

    setShift: (date: string, type: ShiftType) => void;
    addPatternGroup: (startDate: string, endDate: string, pattern: ShiftType[]) => void;
    updatePatternGroupDates: (groupId: string, newStartDate: string, newEndDate: string) => void;
    findPatternGroupForDate: (date: string) => PatternGroup | null;
    clearShifts: () => void;
}

// Helper: Generate shifts from pattern for date range
function generateShiftsFromPattern(
    startDate: string,
    endDate: string,
    pattern: ShiftType[]
): Record<string, ShiftType> {
    const shifts: Record<string, ShiftType> = {};
    const start = new Date(startDate);
    const end = new Date(endDate);

    let currentDate = new Date(start);
    let patternIndex = 0;

    while (currentDate <= end) {
        const dateStr = currentDate.toISOString().split('T')[0];
        shifts[dateStr] = pattern[patternIndex % pattern.length];

        currentDate.setDate(currentDate.getDate() + 1);
        patternIndex++;
    }

    return shifts;
}

export const useShiftStore = create<ShiftState>()(
    persist(
        (set, get) => ({
            shifts: {},
            patternGroups: [],

            setShift: (date, type) =>
                set((state) => ({
                    shifts: { ...state.shifts, [date]: type },
                })),

            addPatternGroup: (startDate, endDate, pattern) => {
                const newGroup: PatternGroup = {
                    id: generateId(),
                    pattern,
                    startDate,
                    endDate,
                    createdAt: Date.now(),
                };

                const newShifts = generateShiftsFromPattern(startDate, endDate, pattern);

                set((state) => ({
                    patternGroups: [...state.patternGroups, newGroup],
                    shifts: { ...state.shifts, ...newShifts },
                }));
            },

            updatePatternGroupDates: (groupId, newStartDate, newEndDate) => {
                const state = get();
                const group = state.patternGroups.find(g => g.id === groupId);
                if (!group) return;

                // Remove old shifts from this pattern
                const updatedShifts = { ...state.shifts };
                const oldStart = new Date(group.startDate);
                const oldEnd = new Date(group.endDate);
                let current = new Date(oldStart);

                while (current <= oldEnd) {
                    const dateStr = current.toISOString().split('T')[0];
                    delete updatedShifts[dateStr];
                    current.setDate(current.getDate() + 1);
                }

                // Generate new shifts
                const newShifts = generateShiftsFromPattern(newStartDate, newEndDate, group.pattern);

                // Update pattern group
                const updatedGroups = state.patternGroups.map(g =>
                    g.id === groupId
                        ? { ...g, startDate: newStartDate, endDate: newEndDate }
                        : g
                );

                set({
                    patternGroups: updatedGroups,
                    shifts: { ...updatedShifts, ...newShifts },
                });
            },

            findPatternGroupForDate: (date) => {
                const state = get();
                return state.patternGroups.find(group => {
                    return date >= group.startDate && date <= group.endDate;
                }) || null;
            },

            clearShifts: () => set({ shifts: {}, patternGroups: [] }),
        }),
        {
            name: 'shift-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
