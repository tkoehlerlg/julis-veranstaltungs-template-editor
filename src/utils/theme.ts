import { inter, montserrat } from '@/lib/font'

const PALETTE = {
    white: '#ffffff',
    whiteOpacity: {
        100: 'rgba(255, 255, 255, 0.1)',
        200: 'rgba(255, 255, 255, 0.2)',
        300: 'rgba(255, 255, 255, 0.3)',
        400: 'rgba(255, 255, 255, 0.4)',
        500: 'rgba(255, 255, 255, 0.5)',
        600: 'rgba(255, 255, 255, 0.6)',
        700: 'rgba(255, 255, 255, 0.7)',
        800: 'rgba(255, 255, 255, 0.8)',
        900: 'rgba(255, 255, 255, 0.9)',
    },
    black: '#000000',
    transparent: 'transparent',
    transparentWhite: 'rgba(255, 255, 255, 0)',

    gray: {
        50: '#f9fafb',
        75: '#fcfcfc',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
        950: '#0a0f14',
    },

    slate: {
        50: '#f8fafc',
        100: '#f1f5f9',
        200: '#e2e8f0',
        300: '#cbd5e1',
        400: '#94a3b8',
        500: '#64748b',
        600: '#475569',
        700: '#334155',
        800: '#1e293b',
        900: '#0f172a',
        950: '#020617',
    },

    red: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
        950: '#450a0a',
    },

    template: {
        blue: '#119EE5',
        magenta: '#E5017C',
        yellow: '#FEED00',
        background: '#1E1F21',
    },
} as const

const FONT_SIZE = {
    extraTiny: '10px',
    tiny: '11px',
    extraSmall: '12px',
    small: '14px',
    regular: '16px',
    medium: '18px',
    smallLarge: '20px',
    large: '24px',
    display1: '64px',
    display2: '58px',
    display3: '52px',
    display4: '46px',
    display5: '40px',
    display6: '32px',
} as const

const FONT_FAMILY = {
    inter: inter.style.fontFamily + ', sans-serif',
    montserrat: montserrat.style.fontFamily + ', sans-serif',
} as const

const BREAKPOINTS = {
    xs: 576,
    sm: 768,
    md: 992,
    lg: 1200,
    xl: 1920,
} as const

const Z_INDEX = {
    default: 0,
    dropdown: 100,
    toast: 200,
    navigation: 300,
    modal: 400,
    tooltip: 500,
    loading: 9999,
} as const

const SHADOWS = {
    xs: '0px 1px 2px 0px rgba(16, 24, 40, 0.05)',
    sm: '0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)',
    lg: '0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)',
} as const

const BORDER_RADIUS = {
    sm: '4px',
    md: '5px',
    lg: '8px',
    xl: '12px',
} as const

const TRANSITION = {
    superfast: 'all 0.15s ease-out',
    fast: 'all 0.3s ease-out',
} as const

export const THEME = {
    palette: PALETTE,
    breakpoints: BREAKPOINTS,
    zIndex: Z_INDEX,
    shadows: SHADOWS,
    fontSize: FONT_SIZE,
    font: FONT_FAMILY,
    borderRadius: BORDER_RADIUS,
    transition: TRANSITION,
}

export type Theme = typeof THEME
