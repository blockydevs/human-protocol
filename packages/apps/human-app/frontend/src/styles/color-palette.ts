export const commonColors = {
  primary: '#320A8D',
  primaryLight: '#6309FF',
  primaryLightSoft: '#8409FF',
  white: '#FFFFFF',
  grey: '#CBCFE6',
  black: '#000000',
} as const;

export const colorPalette = {
  text: {
    primary: commonColors.primary,
    secondary: '#858EC6',
    disabled: '#CBCFE6',
  },
  primary: {
    main: commonColors.primary,
    light: commonColors.primaryLight,
    dark: '#100735',
    contrastText: '#F9FAFF',
  },
  secondary: {
    main: commonColors.primaryLight,
    dark: '#4506B2',
    light: commonColors.primaryLightSoft,
    contrastText: commonColors.white,
  },
  error: {
    main: '#FA2A75',
    dark: '#F20D5F',
    light: '#FF5995',
    contrastText: commonColors.white,
  },
  success: {
    main: '#0AD397',
    dark: '#0E976E',
    light: '#00EDA6',
    contrastText: commonColors.white,
  },
  // for 'warning', 'info' native colors from MUI were pointed as expected
} as const;
