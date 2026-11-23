export const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
export type ScaleStep = (typeof SCALE_STEPS)[number];

export interface ColorValue {
  oklch: string;
  hex: string;
}

export type PaletteScale = Readonly<Record<ScaleStep, ColorValue>>;
export type ScaleName = 'brand' | 'accent' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';

/** OKLCH scales of the Balcão brand; the hex is the same color (chroma was reduced to fit sRGB). */
export const palette: Readonly<Record<ScaleName, PaletteScale>> = {
  brand: {
    50: { oklch: 'oklch(0.975 0.016 312)', hex: '#faf4ff' },
    100: { oklch: 'oklch(0.94 0.04 313.6)', hex: '#f5e4ff' },
    200: { oklch: 'oklch(0.88 0.08 315.2)', hex: '#ecc8fc' },
    300: { oklch: 'oklch(0.8 0.13 316.8)', hex: '#dfa3f5' },
    400: { oklch: 'oklch(0.71 0.17 318.4)', hex: '#cd7be5' },
    500: { oklch: 'oklch(0.61 0.195 320)', hex: '#b452ca' },
    600: { oklch: 'oklch(0.515 0.2 321.6)', hex: '#992faa' },
    700: { oklch: 'oklch(0.45 0.18 323.2)', hex: '#81228d' },
    800: { oklch: 'oklch(0.385 0.15 324.8)', hex: '#681b6f' },
    900: { oklch: 'oklch(0.32 0.12 326.4)', hex: '#501452' },
    950: { oklch: 'oklch(0.255 0.09 328)', hex: '#380e38' },
  },
  accent: {
    50: { oklch: 'oklch(0.985 0.013 80)', hex: '#fff9f1' },
    100: { oklch: 'oklch(0.96 0.033 76.8)', hex: '#ffefda' },
    200: { oklch: 'oklch(0.92 0.064 73.6)', hex: '#ffdfb6' },
    300: { oklch: 'oklch(0.87 0.1 70.4)', hex: '#ffc98a' },
    400: { oklch: 'oklch(0.81 0.146 67.2)', hex: '#ffad4c' },
    500: { oklch: 'oklch(0.75 0.169 64)', hex: '#f69304' },
    600: { oklch: 'oklch(0.665 0.154 60.8)', hex: '#d67903' },
    700: { oklch: 'oklch(0.56 0.134 57.6)', hex: '#ad5c02' },
    800: { oklch: 'oklch(0.47 0.117 54.4)', hex: '#8b4500' },
    900: { oklch: 'oklch(0.39 0.1 51.2)', hex: '#6d3202' },
    950: { oklch: 'oklch(0.29 0.075 48)', hex: '#481d03' },
  },
  neutral: {
    50: { oklch: 'oklch(0.985 0.004 70)', hex: '#fcfaf7' },
    100: { oklch: 'oklch(0.967 0.006 60.5)', hex: '#f7f3f0' },
    200: { oklch: 'oklch(0.925 0.008 51)', hex: '#ebe5e1' },
    300: { oklch: 'oklch(0.87 0.01 41.5)', hex: '#dad2cf' },
    400: { oklch: 'oklch(0.715 0.012 32)', hex: '#aaa09e' },
    500: { oklch: 'oklch(0.56 0.013 22.5)', hex: '#7c7271' },
    600: { oklch: 'oklch(0.455 0.013 13)', hex: '#5e5454' },
    700: { oklch: 'oklch(0.38 0.013 3.5)', hex: '#494042' },
    800: { oklch: 'oklch(0.285 0.013 354)', hex: '#30282a' },
    900: { oklch: 'oklch(0.215 0.012 344.5)', hex: '#1e171b' },
    950: { oklch: 'oklch(0.16 0.011 335)', hex: '#100c0f' },
  },
  success: {
    50: { oklch: 'oklch(0.975 0.02 155)', hex: '#edfbf1' },
    100: { oklch: 'oklch(0.945 0.045 154.5)', hex: '#d6f6e0' },
    200: { oklch: 'oklch(0.895 0.085 154)', hex: '#b1eec3' },
    300: { oklch: 'oklch(0.82 0.13 153.5)', hex: '#7cdd9c' },
    400: { oklch: 'oklch(0.73 0.16 153)', hex: '#42c476' },
    500: { oklch: 'oklch(0.64 0.166 152.5)', hex: '#03a857' },
    600: { oklch: 'oklch(0.55 0.144 152)', hex: '#028844' },
    700: { oklch: 'oklch(0.47 0.125 151.5)', hex: '#006e34' },
    800: { oklch: 'oklch(0.4 0.107 151)', hex: '#015727' },
    900: { oklch: 'oklch(0.33 0.089 150.5)', hex: '#01411b' },
    950: { oklch: 'oklch(0.26 0.065 150)', hex: '#052c12' },
  },
  warning: {
    50: { oklch: 'oklch(0.985 0.018 90)', hex: '#fffaed' },
    100: { oklch: 'oklch(0.96 0.044 86.5)', hex: '#fff1d1' },
    200: { oklch: 'oklch(0.92 0.08 83)', hex: '#ffe1a8' },
    300: { oklch: 'oklch(0.87 0.122 79.5)', hex: '#ffcb72' },
    400: { oklch: 'oklch(0.81 0.165 76)', hex: '#fdb01c' },
    500: { oklch: 'oklch(0.75 0.16 72.5)', hex: '#eb9b01' },
    600: { oklch: 'oklch(0.665 0.144 69)', hex: '#cc8105' },
    700: { oklch: 'oklch(0.56 0.125 65.5)', hex: '#a56300' },
    800: { oklch: 'oklch(0.47 0.108 62)', hex: '#854a00' },
    900: { oklch: 'oklch(0.39 0.09 58.5)', hex: '#683704' },
    950: { oklch: 'oklch(0.29 0.065 55)', hex: '#432105' },
  },
  danger: {
    50: { oklch: 'oklch(0.975 0.012 22)', hex: '#fff4f3' },
    100: { oklch: 'oklch(0.945 0.027 22.5)', hex: '#ffe6e5' },
    200: { oklch: 'oklch(0.895 0.054 23)', hex: '#ffcfcc' },
    300: { oklch: 'oklch(0.82 0.1 23.5)', hex: '#ffaba5' },
    400: { oklch: 'oklch(0.73 0.166 24)', hex: '#ff7873' },
    500: { oklch: 'oklch(0.64 0.2 24.5)', hex: '#ed4a4b' },
    600: { oklch: 'oklch(0.55 0.21 25)', hex: '#d01c29' },
    700: { oklch: 'oklch(0.47 0.19 25.5)', hex: '#ac0218' },
    800: { oklch: 'oklch(0.4 0.16 26)', hex: '#8a0410' },
    900: { oklch: 'oklch(0.33 0.125 26.5)', hex: '#670a0d' },
    950: { oklch: 'oklch(0.26 0.09 27)', hex: '#460a09' },
  },
  info: {
    50: { oklch: 'oklch(0.975 0.013 240)', hex: '#eff8ff' },
    100: { oklch: 'oklch(0.945 0.029 241)', hex: '#dcf0ff' },
    200: { oklch: 'oklch(0.895 0.056 242)', hex: '#bde2ff' },
    300: { oklch: 'oklch(0.82 0.098 243)', hex: '#8bccff' },
    400: { oklch: 'oklch(0.73 0.14 244)', hex: '#4eb0f9' },
    500: { oklch: 'oklch(0.64 0.16 245)', hex: '#0593e6' },
    600: { oklch: 'oklch(0.55 0.141 246)', hex: '#0176be' },
    700: { oklch: 'oklch(0.47 0.123 247)', hex: '#015e9b' },
    800: { oklch: 'oklch(0.4 0.107 248)', hex: '#014a7e' },
    900: { oklch: 'oklch(0.33 0.091 249)', hex: '#003761' },
    950: { oklch: 'oklch(0.26 0.073 250)', hex: '#002545' },
  },
};

export const white: ColorValue = { oklch: 'oklch(1 0 0)', hex: '#ffffff' };
