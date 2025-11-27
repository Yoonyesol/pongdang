import { ShiftType } from '../store/useShiftStore';
import { SalarySettings } from '../store/useSalaryStore';

export interface DailySalary {
    date: string;
    shiftType: ShiftType;
    basePay: number;          // 기본급
    nightAllowance: number;   // 야간수당
    weekendAllowance: number; // 주말수당
    holidayAllowance: number; // 공휴일수당
    totalPay: number;         // 해당일 총 급여
}

export interface MonthlySalary {
    totalPay: number;           // 총 급여
    basePay: number;            // 기본급 합계
    nightAllowance: number;     // 야간수당 합계
    weekendAllowance: number;   // 주말수당 합계
    holidayAllowance: number;   // 공휴일수당 합계
    weeklyHolidayPay: number;   // 주휴수당
    workDays: number;           // 총 근무일수
    dayShiftCount: number;      // 주간 근무 일수
    nightShiftCount: number;    // 야간 근무 일수
    eveningShiftCount: number;  // 이브닝 근무 일수
    offDays: number;            // 휴무 일수
}

/**
 * 특정 날짜가 주말(토요일 또는 일요일)인지 확인
 */
function isWeekend(dateStr: string): boolean {
    const date = new Date(dateStr);
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
}

/**
 * 일별 급여 계산
 */
export function calculateDailySalary(
    dateStr: string,
    shiftType: ShiftType,
    settings: SalarySettings
): DailySalary {
    const { hourlyWage, dayShiftHours, nightShiftHours, eveningShiftHours } = settings;

    let basePay = 0;
    let nightAllowance = 0;
    let weekendAllowance = 0;
    let holidayAllowance = 0;

    // 근무 형태별 기본급 계산
    switch (shiftType) {
        case 'day':
            basePay = hourlyWage * dayShiftHours;
            break;
        case 'night':
            basePay = hourlyWage * nightShiftHours;
            nightAllowance = basePay * settings.nightAllowanceRate;
            break;
        case 'evening':
            basePay = hourlyWage * eveningShiftHours;
            break;
        case 'off':
            // 휴무는 급여 없음
            break;
    }

    // 주말 수당 계산 (off 제외)
    if (shiftType !== 'off' && isWeekend(dateStr)) {
        weekendAllowance = basePay * settings.weekendAllowanceRate;
    }

    const totalPay = basePay + nightAllowance + weekendAllowance + holidayAllowance;

    return {
        date: dateStr,
        shiftType,
        basePay,
        nightAllowance,
        weekendAllowance,
        holidayAllowance,
        totalPay,
    };
}

/**
 * 월별 급여 계산
 */
export function calculateMonthlySalary(
    shifts: Record<string, ShiftType>,
    settings: SalarySettings,
    year: number,
    month: number
): MonthlySalary {
    const targetMonth = `${year}-${String(month).padStart(2, '0')}`;

    let totalPay = 0;
    let basePay = 0;
    let nightAllowance = 0;
    let weekendAllowance = 0;
    let holidayAllowance = 0;

    let workDays = 0;
    let dayShiftCount = 0;
    let nightShiftCount = 0;
    let eveningShiftCount = 0;
    let offDays = 0;

    // 해당 월의 모든 날짜에 대해 급여 계산
    Object.entries(shifts).forEach(([dateStr, shiftType]) => {
        if (dateStr.startsWith(targetMonth)) {
            const daily = calculateDailySalary(dateStr, shiftType, settings);

            totalPay += daily.totalPay;
            basePay += daily.basePay;
            nightAllowance += daily.nightAllowance;
            weekendAllowance += daily.weekendAllowance;
            holidayAllowance += daily.holidayAllowance;

            if (shiftType !== 'off') {
                workDays++;
            } else {
                offDays++;
            }

            if (shiftType === 'day') dayShiftCount++;
            if (shiftType === 'night') nightShiftCount++;
            if (shiftType === 'evening') eveningShiftCount++;
        }
    });

    // 주휴수당 계산
    let weeklyHolidayPay = 0;
    if (settings.weeklyHolidayPayEnabled && workDays > 0) {
        const totalWorkHours =
            dayShiftCount * settings.dayShiftHours +
            nightShiftCount * settings.nightShiftHours +
            eveningShiftCount * settings.eveningShiftHours;

        const weeksInMonth = Math.ceil(workDays / settings.weeklyWorkDays);
        weeklyHolidayPay = (totalWorkHours / settings.weeklyWorkDays) * settings.hourlyWage * weeksInMonth;
    }

    totalPay += weeklyHolidayPay;

    return {
        totalPay: Math.round(totalPay),
        basePay: Math.round(basePay),
        nightAllowance: Math.round(nightAllowance),
        weekendAllowance: Math.round(weekendAllowance),
        holidayAllowance: Math.round(holidayAllowance),
        weeklyHolidayPay: Math.round(weeklyHolidayPay),
        workDays,
        dayShiftCount,
        nightShiftCount,
        eveningShiftCount,
        offDays,
    };
}
