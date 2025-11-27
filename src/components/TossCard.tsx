import styled from 'styled-components/native';

export const TossCard = styled.View`
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.l};
  padding: ${({ theme }) => theme.spacing.l};
  margin-bottom: ${({ theme }) => theme.spacing.m};
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.05;
  shadow-radius: 8px;
  elevation: 2;
`;

export const CardTitle = styled.Text`
  font-size: ${({ theme }) => theme.typography.h2.fontSize};
  font-weight: ${({ theme }) => theme.typography.h2.fontWeight};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.s};
`;

export const CardContent = styled.Text`
  font-size: ${({ theme }) => theme.typography.body2.fontSize};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.body2.lineHeight};
`;
