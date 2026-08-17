import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated } from 'react-native';
import { X } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const Drawer = ({
    visible = false,
    onClose,
    position = 'bottom', // 'bottom' or 'right' or 'left'
    title,
    children,
    size = '60%',
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    const animValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(animValue, {
                toValue: 1,
                tension: 65,
                friction: 9,
                useNativeDriver: true,
            }).start();
        } else {
            animValue.setValue(0);
        }
    }, [visible]);

    const getTransform = () => {
        if (position === 'bottom') {
            return {
                transform: [{
                    translateY: animValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [500, 0],
                    })
                }]
            };
        } else if (position === 'right') {
            return {
                transform: [{
                    translateX: animValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [400, 0],
                    })
                }]
            };
        } else {
            return {
                transform: [{
                    translateX: animValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-400, 0],
                    })
                }]
            };
        }
    };

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <View style={[
                styles.backdrop,
                position === 'bottom' ? styles.alignBottom : position === 'right' ? styles.alignRight : styles.alignLeft
            ]}>
                <TouchableOpacity 
                    style={styles.backdropTouch} 
                    activeOpacity={1} 
                    onPress={onClose} 
                />

                <Animated.View style={[
                    styles.drawerCard,
                    getTransform(),
                    position === 'bottom' ? { height: size, borderTopLeftRadius: 24, borderTopRightRadius: 24 } : { width: size, height: '100%' },
                    {
                        backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                        borderColor: isDark ? '#27272A' : '#E4E4E7',
                    }
                ]}>
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={20} color={colors.textTertiary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        {children}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.65)',
    },
    backdropTouch: {
        ...StyleSheet.absoluteFillObject,
    },
    alignBottom: {
        justifyContent: 'flex-end',
    },
    alignRight: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    alignLeft: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    drawerCard: {
        borderWidth: 1,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 25,
        elevation: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(150,150,150,0.1)',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    closeBtn: {
        padding: 6,
    },
    content: {
        flex: 1,
    },
});
