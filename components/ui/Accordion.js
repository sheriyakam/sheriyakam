import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const AccordionItem = ({
    title,
    children,
    isOpen = false,
    onToggle,
    icon: Icon,
    style,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    return (
        <View style={[
            styles.itemContainer,
            {
                backgroundColor: isDark ? '#18181B' : '#FAFAFA',
                borderColor: isDark ? '#27272A' : '#E4E4E7',
            },
            style
        ]}>
            <TouchableOpacity
                onPress={onToggle}
                activeOpacity={0.7}
                style={styles.header}
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
                    <ChevronDown size={18} color={colors.textTertiary} />
                </View>
            </TouchableOpacity>

            {isOpen ? (
                <View style={[styles.body, { borderTopColor: isDark ? '#27272A' : '#E4E4E7' }]}>
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
    items = [], // [{ id, title, content, icon }]
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

    return (
        <View style={[styles.accordion, style]}>
            {items.map((item, index) => {
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
        gap: 8,
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
        paddingRight: 10,
    },
    title: {
        fontSize: 15,
        fontWeight: '600',
        lineHeight: 20,
    },
    chevronWrap: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    body: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        paddingTop: 12,
        borderTopWidth: 1,
    },
    bodyText: {
        fontSize: 14,
        lineHeight: 22,
    },
});
