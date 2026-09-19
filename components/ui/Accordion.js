import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const AccordionItem = ({
    title,
    children,
    isOpen: controlledIsOpen,
    defaultOpen = false,
    onToggle,
    icon: Icon,
    style,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const isControlled = typeof controlledIsOpen === 'boolean';
    const isOpen = isControlled ? controlledIsOpen : internalOpen;

    const handlePress = () => {
        if (onToggle) {
            onToggle();
        }
        if (!isControlled) {
            setInternalOpen(prev => !prev);
        }
    };

    return (
        <View style={[
            styles.itemContainer,
            {
                backgroundColor: isDark ? '#18181B' : '#FAFAFA',
                borderColor: isOpen ? (colors.accent || '#3B82F6') : (isDark ? '#27272A' : '#E4E4E7'),
            },
            style
        ]}>
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.7}
                style={styles.header}
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
                accessibilityLabel={title}
            >
                <View style={styles.headerLeft}>
                    {Icon ? (
                        <Icon size={18} color={colors.accent} style={{ marginRight: 10 }} />
                    ) : null}
                    <Text style={[styles.title, { color: colors.textPrimary }]}>
                        {title}
                    </Text>
                </View>

                <View style={[
                    styles.chevronWrap,
                    isOpen && { transform: [{ rotate: '180deg' }] }
                ]}>
                    <ChevronDown size={18} color={isOpen ? colors.accent : colors.textTertiary} />
                </View>
            </TouchableOpacity>

            {isOpen ? (
                <View style={[
                    styles.body,
                    {
                        borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : '#E4E4E7',
                        backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : '#FFFFFF'
                    }
                ]}>
                    {typeof children === 'string' ? (
                        <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                            {children}
                        </Text>
                    ) : (
                        children
                    )}
                </View>
            ) : null}
        </View>
    );
};

export const Accordion = ({
    items, // [{ id, title, content, icon }]
    children,
    allowMultiple = false,
    defaultOpenId,
    style,
}) => {
    const [openIds, setOpenIds] = useState(
        defaultOpenId ? (Array.isArray(defaultOpenId) ? defaultOpenId : [defaultOpenId]) : []
    );

    const handleToggle = (id) => {
        if (allowMultiple) {
            setOpenIds((prev) => 
                prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
            );
        } else {
            setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
        }
    };

    if (children) {
        return (
            <View style={[styles.accordion, style]}>
                {children}
            </View>
        );
    }

    return (
        <View style={[styles.accordion, style]}>
            {(items || []).map((item, index) => {
                const itemId = item.id || String(index);
                const isOpen = openIds.includes(itemId);
                return (
                    <AccordionItem
                        key={itemId}
                        title={item.title}
                        isOpen={isOpen}
                        icon={item.icon}
                        onToggle={() => handleToggle(itemId)}
                    >
                        {item.content}
                    </AccordionItem>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    accordion: {
        gap: 10,
        width: '100%',
    },
    itemContainer: {
        borderRadius: 14,
        borderWidth: 1,
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    title: {
        fontSize: 15,
        fontWeight: '700',
        flex: 1,
    },
    chevronWrap: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    body: {
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderTopWidth: 1,
    },
    bodyText: {
        fontSize: 14,
        lineHeight: 22,
    },
});
