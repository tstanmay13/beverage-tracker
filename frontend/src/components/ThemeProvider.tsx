import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#0ea5e9', // Tailwind primary-500
      light: '#38bdf8', // Tailwind primary-400
      dark: '#0284c7', // Tailwind primary-600
    },
    secondary: {
      main: '#d946ef', // Tailwind secondary-500
      light: '#e879f9', // Tailwind secondary-400
      dark: '#c026d3', // Tailwind secondary-600
    },
    background: {
      default: '#f9fafb', // Tailwind gray-50
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '0.5rem',
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '1rem',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        },
      },
    },
  },
});

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
} 