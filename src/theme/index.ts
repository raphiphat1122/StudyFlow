export type ThemeMode = 'light' | 'dark' | 'system';
export const lightColors = {
  primary: '#8B5CF6', secondary: '#A78BFA', background: '#FAF8FF', card: '#FFFFFF',
  text: '#35205F', muted: '#6F5F94', border: '#E8DDFB', soft: '#F1EAFE',
  danger: '#DC2626', success: '#16A34A', warning: '#D97706', onPrimary: '#FFFFFF',
};
export type Colors = typeof lightColors;
export const darkColors: Colors = {
  primary: '#A78BFA', secondary: '#8B5CF6', background: '#17102B', card: '#241A3F',
  text: '#F3EEFF', muted: '#B9AADB', border: '#3A2D5E', soft: '#2D2250',
  danger: '#F87171', success: '#4ADE80', warning: '#FBBF24', onPrimary: '#1B1033',
};
export const radius = { sm: 10, md: 16, lg: 24, pill: 999 };
export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const font = { regular: 'Mali-Regular', medium: 'Mali-Medium', semibold: 'Mali-SemiBold', bold: 'Mali-Bold' };
