import 'styled-components/native';

declare module 'styled-components/native' {
    export interface DefaultTheme {
        colors: {
            primary: string;
            primaryDark: string;
            background: string;
            surface: string;
            text: string;
            textSecondary: string;
            textTertiary: string;
            danger: string;
            success: string;
            warning: string;
            border: string;
            white: string;
        };
        spacing: {
            xs: string;
            s: string;
            m: string;
            l: string;
            xl: string;
        };
        borderRadius: {
            s: string;
            m: string;
            l: string;
            xl: string;
        };
    }
}
