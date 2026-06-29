const SHADES = {
    primary: '#0a192f', // Premium Brand Navy
    accent: '#4f46e5', // Vibrant Indigo Accent
    accentGlow: 'rgba(79, 70, 229, 0.4)',
    gold: '#eab308', // Warm Amber Gold
    danger: '#f43f5e', // Rose Red
    success: '#10b981', // Emerald Green
};

export const darkTheme = {
    bgPrimary: '#09090b',
    bgSecondary: '#18181b',
    bgTertiary: '#27272a',
    primary: SHADES.primary,
    textPrimary: '#ffffff',
    textSecondary: '#a1a1aa',
    textTertiary: '#71717a',
    accent: SHADES.accent,
    accentGlow: SHADES.accentGlow,
    gold: SHADES.gold,
    border: '#27272a',
    danger: SHADES.danger,
    success: SHADES.success,
    mode: 'dark',
};

export const lightTheme = {
    bgPrimary: '#ffffff',
    bgSecondary: '#f8f9fa',
    bgTertiary: '#e9ecef',
    primary: SHADES.primary,
    textPrimary: '#09090b',
    textSecondary: '#4b5563',
    textTertiary: '#9ca3af',
    accent: SHADES.accent,
    accentGlow: 'rgba(79, 70, 229, 0.2)',
    gold: SHADES.gold,
    border: '#e4e4e7',
    danger: SHADES.danger,
    success: SHADES.success,
    mode: 'light',
};

// Default export for backward compatibility
export const COLORS = darkTheme;

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    25: 100,
};
