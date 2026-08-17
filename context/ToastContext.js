import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { useTheme } from './ThemeContext';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    const showToast = useCallback(({ 
        type = 'success', 
        title, 
        message, 
        duration = 3500,
        actionLabel,
        onAction
    }) => {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
        const newToast = { id, type, title, message, duration, actionLabel, onAction };

        setToasts((prev) => [...prev.slice(-3), newToast]); // keep max 4 on screen

        if (duration > 0) {
            setTimeout(() => {
                hideToast(id);
            }, duration);
        }
        return id;
    }, []);

    const hideToast = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast, hideToast, success: (msg, title) => showToast({ type: 'success', message: msg, title }), error: (msg, title) => showToast({ type: 'error', message: msg, title }), info: (msg, title) => showToast({ type: 'info', message: msg, title }), warning: (msg, title) => showToast({ type: 'warning', message: msg, title }) }}>
            {children}
            <View style={styles.toastContainer} pointerEvents="box-none">
                {toasts.map((toast) => (
                    <ToastItem 
                        key={toast.id} 
                        toast={toast} 
                        onClose={() => hideToast(toast.id)} 
                        colors={colors}
                        isDark={isDark}
                    />
                ))}
            </View>
        </ToastContext.Provider>
    );
};

const ToastItem = ({ toast, onClose, colors, isDark }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(-20)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
            }),
            Animated.spring(translateY, {
                toValue: 0,
                tension: 80,
                friction: 8,
                useNativeDriver: true,
            })
        ]).start();
    }, []);

    const getIcon = () => {
        switch (toast.type) {
            case 'success':
                return <CheckCircle2 size={20} color="#10B981" />;
            case 'error':
                return <AlertCircle size={20} color="#EF4444" />;
            case 'warning':
                return <AlertTriangle size={20} color="#F59E0B" />;
            case 'info':
            default:
                return <Info size={20} color="#3B82F6" />;
        }
    };

    const getBorderColor = () => {
        switch (toast.type) {
            case 'success': return '#10B98133';
            case 'error': return '#EF444433';
            case 'warning': return '#F59E0B33';
            default: return '#3B82F633';
        }
    };

    return (
        <Animated.View style={[
            styles.toastCard,
            {
                opacity,
                transform: [{ translateY }],
                backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                borderColor: getBorderColor(),
                shadowColor: '#000',
            }
        ]}>
            <View style={styles.iconWrap}>{getIcon()}</View>
            <View style={styles.textWrap}>
                {toast.title ? (
                    <Text style={[styles.toastTitle, { color: isDark ? '#FFFFFF' : '#111827' }]}>
                        {toast.title}
                    </Text>
                ) : null}
                {toast.message ? (
                    <Text style={[styles.toastMessage, { color: isDark ? '#A1A1AA' : '#4B5563' }]}>
                        {toast.message}
                    </Text>
                ) : null}
            </View>

            {toast.actionLabel && toast.onAction ? (
                <TouchableOpacity 
                    style={styles.actionBtn}
                    onPress={() => {
                        toast.onAction();
                        onClose();
                    }}
                >
                    <Text style={styles.actionText}>{toast.actionLabel}</Text>
                </TouchableOpacity>
            ) : null}

            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={16} color={isDark ? '#71717A' : '#9CA3AF'} />
            </TouchableOpacity>
        </Animated.View>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        return {
            showToast: () => {},
            hideToast: () => {},
            success: () => {},
            error: () => {},
            info: () => {},
            warning: () => {},
        };
    }
    return context;
};

const styles = StyleSheet.create({
    toastContainer: {
        position: 'absolute',
        top: Platform.OS === 'web' ? 24 : 54,
        left: 16,
        right: 16,
        zIndex: 9999,
        alignItems: 'center',
        gap: 8,
    },
    toastCard: {
        width: '100%',
        maxWidth: 440,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 14,
        borderWidth: 1.5,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
        elevation: 10,
    },
    iconWrap: {
        marginRight: 10,
    },
    textWrap: {
        flex: 1,
    },
    toastTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 2,
    },
    toastMessage: {
        fontSize: 13,
        lineHeight: 18,
    },
    actionBtn: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: 'rgba(79, 70, 229, 0.12)',
        borderRadius: 8,
        marginLeft: 8,
    },
    actionText: {
        color: '#6366F1',
        fontSize: 12,
        fontWeight: '700',
    },
    closeBtn: {
        padding: 4,
        marginLeft: 6,
    },
});
