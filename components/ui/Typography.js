import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const Heading1 = ({ children, style, color, align = 'left', ...props }) => {
    const { colors } = useTheme() || { colors: COLORS };
    return (
        <RNText 
            style={[styles.h1, { color: color || colors.textPrimary, textAlign: align }, style]} 
            {...props}
        >
            {children}
        </RNText>
    );
};

export const Heading2 = ({ children, style, color, align = 'left', ...props }) => {
    const { colors } = useTheme() || { colors: COLORS };
    return (
        <RNText 
            style={[styles.h2, { color: color || colors.textPrimary, textAlign: align }, style]} 
            {...props}
        >
            {children}
        </RNText>
    );
};

export const Heading3 = ({ children, style, color, align = 'left', ...props }) => {
    const { colors } = useTheme() || { colors: COLORS };
    return (
        <RNText 
            style={[styles.h3, { color: color || colors.textPrimary, textAlign: align }, style]} 
            {...props}
        >
            {children}
        </RNText>
    );
};

export const Heading4 = ({ children, style, color, align = 'left', ...props }) => {
    const { colors } = useTheme() || { colors: COLORS };
    return (
        <RNText 
            style={[styles.h4, { color: color || colors.textPrimary, textAlign: align }, style]} 
            {...props}
        >
            {children}
        </RNText>
    );
};

export const Text = ({ children, style, color, weight = '400', size = 15, align = 'left', ...props }) => {
    const { colors } = useTheme() || { colors: COLORS };
    return (
        <RNText 
            style={[
                styles.body, 
                { 
                    color: color || colors.textPrimary, 
                    fontWeight: weight, 
                    fontSize: size,
                    textAlign: align 
                }, 
                style
            ]} 
            {...props}
        >
            {children}
        </RNText>
    );
};

export const Subtext = ({ children, style, color, align = 'left', ...props }) => {
    const { colors } = useTheme() || { colors: COLORS };
    return (
        <RNText 
            style={[styles.subtext, { color: color || colors.textSecondary, textAlign: align }, style]} 
            {...props}
        >
            {children}
        </RNText>
    );
};

export const Caption = ({ children, style, color, align = 'left', ...props }) => {
    const { colors } = useTheme() || { colors: COLORS };
    return (
        <RNText 
            style={[styles.caption, { color: color || colors.textTertiary, textAlign: align }, style]} 
            {...props}
        >
            {children}
        </RNText>
    );
};

export const Mono = ({ children, style, color, ...props }) => {
    const { colors } = useTheme() || { colors: COLORS };
    return (
        <RNText 
            style={[styles.mono, { color: color || colors.textPrimary, backgroundColor: colors.bgTertiary + '80' }, style]} 
            {...props}
        >
            {children}
        </RNText>
    );
};

export const Lead = ({ children, style, color, ...props }) => {
    const { colors } = useTheme() || { colors: COLORS };
    return (
        <RNText 
            style={[styles.lead, { color: color || colors.textSecondary }, style]} 
            {...props}
        >
            {children}
        </RNText>
    );
};

const styles = StyleSheet.create({
    h1: {
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -0.8,
        lineHeight: 40,
    },
    h2: {
        fontSize: 24,
        fontWeight: '700',
        letterSpacing: -0.5,
        lineHeight: 32,
    },
    h3: {
        fontSize: 19,
        fontWeight: '700',
        letterSpacing: -0.3,
        lineHeight: 26,
    },
    h4: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: -0.2,
        lineHeight: 22,
    },
    body: {
        fontSize: 15,
        lineHeight: 22,
    },
    subtext: {
        fontSize: 14,
        lineHeight: 20,
    },
    caption: {
        fontSize: 12,
        lineHeight: 16,
        letterSpacing: 0.2,
    },
    mono: {
        fontFamily: 'monospace',
        fontSize: 13,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    lead: {
        fontSize: 18,
        lineHeight: 28,
        fontWeight: '400',
    },
});
