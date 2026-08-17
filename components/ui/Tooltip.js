import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const Tooltip = ({
    content,
    children,
    position = 'top',
    style,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';
    const [isVisible, setIsVisible] = useState(false);

    return (
        <View style={[styles.container, style]}>
            <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => setIsVisible(!isVisible)}
            >
                {children}
            </TouchableOpacity>

            {isVisible ? (
                <View style={[
                    styles.popover,
                    position === 'top' ? styles.topPos : styles.bottomPos,
                    {
                        backgroundColor: isDark ? '#27272A' : '#18181B',
                        borderColor: isDark ? '#3F3F46' : '#3F3F46',
                    }
                ]}>
                    <Text style={styles.text}>{content}</Text>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignSelf: 'flex-start',
    },
    popover: {
        position: 'absolute',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        zIndex: 100,
        minWidth: 120,
        maxWidth: 220,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },
    topPos: {
        bottom: '100%',
        marginBottom: 6,
        left: 0,
    },
    bottomPos: {
        top: '100%',
        marginTop: 6,
        left: 0,
    },
    text: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '500',
        lineHeight: 16,
    },
});
