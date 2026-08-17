import React from 'react';
import { View, StyleSheet } from 'react-native';

export const Container = ({ children, style, maxWidth = 1200, padding = 16 }) => {
    return (
        <View style={[styles.container, { maxWidth, paddingHorizontal: padding }, style]}>
            {children}
        </View>
    );
};

export const Row = ({ children, style, gap = 12, justify = 'flex-start', align = 'center', wrap = 'wrap' }) => {
    return (
        <View style={[
            styles.row, 
            { 
                gap, 
                justifyContent: justify, 
                alignItems: align, 
                flexWrap: wrap 
            }, 
            style
        ]}>
            {children}
        </View>
    );
};

export const Col = ({ children, style, flex = 1, gap = 8 }) => {
    return (
        <View style={[styles.col, { flex, gap }, style]}>
            {children}
        </View>
    );
};

export const Spacer = ({ size = 16, horizontal = false }) => {
    return (
        <View style={horizontal ? { width: size } : { height: size }} />
    );
};

export const Grid = ({ children, columns = 2, gap = 12, style }) => {
    return (
        <View style={[styles.grid, { gap }, style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignSelf: 'center',
    },
    row: {
        flexDirection: 'row',
    },
    col: {
        flexDirection: 'column',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});
