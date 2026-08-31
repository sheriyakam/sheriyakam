import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';

export const Carousel = ({
    items = [],
    renderItem,
    itemWidth = Dimensions.get('window').width - 32,
    autoPlay = false,
    interval = 4000,
    showDots = true,
    showArrows = false,
    style,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollRef = useRef(null);

    const handleScroll = (event) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / itemWidth);
        setActiveIndex(index);
    };

    const scrollToIndex = (index) => {
        const targetIndex = Math.max(0, Math.min(items.length - 1, index));
        if (scrollRef.current) {
            scrollRef.current.scrollTo({ x: targetIndex * itemWidth, animated: true });
            setActiveIndex(targetIndex);
        }
    };

    useEffect(() => {
        if (!autoPlay || items.length <= 1) return;
        const timer = setInterval(() => {
            const nextIndex = (activeIndex + 1) % items.length;
            scrollToIndex(nextIndex);
        }, interval);
        return () => clearInterval(timer);
    }, [autoPlay, interval, activeIndex, items.length]);

    return (
        <View style={[styles.container, style]}>
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                decelerationRate="fast"
                snapToInterval={itemWidth}
                snapToAlignment="center"
                style={styles.scrollView}
            >
                {items.map((item, index) => (
                    <View key={index} style={{ width: itemWidth }}>
                        {renderItem({ item, index, isActive: activeIndex === index })}
                    </View>
                ))}
            </ScrollView>

            {showArrows ? (
                <>
                    <TouchableOpacity
                        onPress={() => scrollToIndex(activeIndex - 1)}
                        disabled={activeIndex === 0}
                        style={[
                            styles.arrowBtn,
                            styles.arrowLeft,
                            {
                                backgroundColor: isDark ? '#27272AE0' : '#FFFFFFE0',
                                opacity: activeIndex === 0 ? 0.3 : 1,
                            }
                        ]}
                    >
                        <ChevronLeft size={18} color={colors.textPrimary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => scrollToIndex(activeIndex + 1)}
                        disabled={activeIndex >= items.length - 1}
                        style={[
                            styles.arrowBtn,
                            styles.arrowRight,
                            {
                                backgroundColor: isDark ? '#27272AE0' : '#FFFFFFE0',
                                opacity: activeIndex >= items.length - 1 ? 0.3 : 1,
                            }
                        ]}
                    >
                        <ChevronRight size={18} color={colors.textPrimary} />
                    </TouchableOpacity>
                </>
            ) : null}

            {showDots && items.length > 1 ? (
                <View style={styles.dotsContainer}>
                    {items.map((_, index) => {
                        const isActive = activeIndex === index;
                        return (
                            <TouchableOpacity
                                key={index}
                                onPress={() => scrollToIndex(index)}
                                style={[
                                    styles.dot,
                                    {
                                        width: isActive ? 20 : 6,
                                        backgroundColor: isActive ? colors.accent : isDark ? '#3F3F46' : '#D4D4D8',
                                    }
                                ]}
                            />
                        );
                    })}
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        width: '100%',
        marginVertical: 8,
    },
    scrollView: {
        width: '100%',
    },
    arrowBtn: {
        position: 'absolute',
        top: '42%',
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    arrowLeft: {
        left: 8,
    },
    arrowRight: {
        right: 8,
    },
    dotsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 10,
    },
    dot: {
        height: 6,
        borderRadius: 3,
    },
});
