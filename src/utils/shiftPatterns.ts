import { addDays, format, differenceInDays, parseISO } from 'date-fns';
import { ShiftType } from '../store/useShiftStore';

export const generatePongdangPattern = (startDate: string, endDate: string): Record<string, ShiftType> => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const days = differenceInDays(end, start);
    const shifts: Record<string, ShiftType> = {};

    for (let i = 0; i <= days; i++) {
        const currentDate = addDays(start, i);
        const dateString = format(currentDate, 'yyyy-MM-dd');
        // Pongdang: Work (Day) -> Off -> Work (Day) -> Off ...
        // You might want to allow choosing the "Work" type (Day/Night/Evening)
        shifts[dateString] = i % 2 === 0 ? 'day' : 'off';
    }

    return shifts;
};

export const generateCustomPattern = (
    startDate: string,
    endDate: string,
    pattern: ShiftType[]
): Record<string, ShiftType> => {
    if (pattern.length === 0) return {};

    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const days = differenceInDays(end, start);
    const shifts: Record<string, ShiftType> = {};

    for (let i = 0; i <= days; i++) {
        const currentDate = addDays(start, i);
        const dateString = format(currentDate, 'yyyy-MM-dd');
        const patternIndex = i % pattern.length;
        shifts[dateString] = pattern[patternIndex];
    }

    return shifts;
};
