import styled from 'styled-components/native';
import { TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
}

const ButtonContainer = styled(TouchableOpacity) <{ variant: string; disabled: boolean }>`
  width: 100%;
  padding: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.m};
  align-items: center;
  justify-content: center;
  background-color: ${({ theme, variant, disabled }) => {
        if (disabled) return theme.colors.textTertiary;
        switch (variant) {
            case 'secondary': return theme.colors.surface;
            case 'danger': return theme.colors.danger;
            default: return theme.colors.primary;
        }
    }};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
`;

const ButtonText = styled.Text<{ variant: string }>`
  font-size: ${({ theme }) => theme.typography.body1.fontSize};
  font-weight: bold;
  color: ${({ theme, variant }) =>
        variant === 'secondary' ? theme.colors.text : theme.colors.surface};
`;

export const TossButton = ({ title, onPress, variant = 'primary', disabled = false }: ButtonProps) => {
    return (
        <ButtonContainer onPress={onPress} variant={variant} disabled={disabled} activeOpacity={0.8}>
            <ButtonText variant={variant}>{title}</ButtonText>
        </ButtonContainer>
    );
};
