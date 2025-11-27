import { DefaultTheme } from 'styled-components/native';

export const theme: DefaultTheme = {
    colors: {
        // Primary Brand
        primary: '#3182F6', // Toss Blue
        primaryDark: '#1B64DA',

        // Backgrounds
        background: '#F2F4F6', // Light Grey Background
        surface: '#FFFFFF',

        // Text
        text: '#191F28', // Black
        textSecondary: '#8B95A1', // Grey
        textTertiary: '#B0B8C1', // Light Grey

        // Status
        danger: '#FF3B30',
        success: '#34C759',
        warning: '#FFCC00',

        // Borders & Dividers
        border: '#E5E8EB',
    },
    typography: {
        h1: {
            fontSize: '24px',
            fontWeight: '700',
            lineHeight: '34px',
        },
        h2: {
            fontSize: '20px',
            fontWeight: '700',
            lineHeight: '28px',
        },
        body1: {
            fontSize: '17px',
            fontWeight: '400',
            lineHeight: '24px',
        },
        body2: {
            fontSize: '15px',
            fontWeight: '400',
            lineHeight: '22px',
        },
        caption: {
            fontSize: '13px',
            fontWeight: '400',
            lineHeight: '18px',
        },
    },
    spacing: {
        xs: '4px',
        s: '8px',
        m: '16px',
        l: '24px',
        xl: '32px',
    },
    borderRadius: {
        s: '8px',
        m: '12px',
        l: '20px',
        xl: '24px',
    },
};
