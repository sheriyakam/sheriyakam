import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ArrowUpDown, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../constants/theme';
import { Checkbox } from './Checkbox';

export const DataTable = ({
    columns = [], // [{ key, title, width, sortable, render }]
    data = [],
    pageSize = 10,
    searchable = true,
    selectable = false,
    onRowPress,
    keyExtractor = (item, idx) => item.id || String(idx),
    style,
}) => {
    const { colors, theme } = useTheme() || { colors: COLORS, theme: 'dark' };
    const isDark = theme === 'dark';

    const [searchQuery, setSearchQuery] = useState('');
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc'); // 'asc' or 'desc'
    const [page, setPage] = useState(0);
    const [selectedKeys, setSelectedKeys] = useState([]);

    // Filter by search query
    const filteredData = useMemo(() => {
        if (!searchQuery.trim()) return data;
        const q = searchQuery.toLowerCase();
        return data.filter((row) => {
            return Object.values(row).some((val) => 
                String(val).toLowerCase().includes(q)
            );
        });
    }, [data, searchQuery]);

    // Sort data
    const sortedData = useMemo(() => {
        if (!sortKey) return filteredData;
        return [...filteredData].sort((a, b) => {
            const valA = a[sortKey];
            const valB = b[sortKey];
            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortKey, sortOrder]);

    // Paginate
    const paginatedData = useMemo(() => {
        const start = page * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, page, pageSize]);

    const totalPages = Math.ceil(sortedData.length / pageSize) || 1;

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedKeys(paginatedData.map((item, idx) => keyExtractor(item, idx)));
        } else {
            setSelectedKeys([]);
        }
    };

    const handleSelectRow = (key) => {
        setSelectedKeys((prev) => 
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };

    return (
        <View style={[
            styles.container,
            {
                backgroundColor: isDark ? '#18181B' : '#FFFFFF',
                borderColor: isDark ? '#27272A' : '#E4E4E7',
            },
            style
        ]}>
            {searchable ? (
                <View style={[styles.toolbar, { borderBottomColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                    <View style={[styles.searchWrap, { backgroundColor: isDark ? '#27272A' : '#F4F4F5' }]}>
                        <Search size={16} color={colors.textTertiary} />
                        <TextInput
                            value={searchQuery}
                            onChangeText={(t) => {
                                setSearchQuery(t);
                                setPage(0);
                            }}
                            placeholder="Filter table records..."
                            placeholderTextColor={colors.textTertiary}
                            style={[styles.searchInput, { color: colors.textPrimary }]}
                        />
                    </View>

                    <Text style={[styles.resultsCount, { color: colors.textTertiary }]}>
                        {sortedData.length} records
                    </Text>
                </View>
            ) : null}

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                    {/* Table Header */}
                    <View style={[styles.headerRow, { backgroundColor: isDark ? '#27272A60' : '#F9FAFB' }]}>
                        {selectable ? (
                            <View style={styles.selectCell}>
                                <Checkbox
                                    checked={selectedKeys.length === paginatedData.length && paginatedData.length > 0}
                                    onChange={handleSelectAll}
                                />
                            </View>
                        ) : null}

                        {columns.map((col) => (
                            <TouchableOpacity
                                key={col.key}
                                onPress={() => col.sortable && handleSort(col.key)}
                                disabled={!col.sortable}
                                style={[
                                    styles.headerCell,
                                    col.width ? { width: col.width } : { flex: 1, minWidth: 120 }
                                ]}>
                                <Text style={[styles.headerCellText, { color: colors.textSecondary }]}>
                                    {col.title}
                                </Text>
                                {col.sortable ? (
                                    <ArrowUpDown size={12} color={sortKey === col.key ? colors.accent : colors.textTertiary} style={{ marginLeft: 4 }} />
                                ) : null}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Table Body */}
                    {paginatedData.length === 0 ? (
                        <View style={styles.emptyWrap}>
                            <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                                No records matching your filter.
                            </Text>
                        </View>
                    ) : (
                        paginatedData.map((row, rowIdx) => {
                            const rowKey = keyExtractor(row, rowIdx);
                            const isSelected = selectedKeys.includes(rowKey);
                            return (
                                <TouchableOpacity
                                    key={rowKey}
                                    onPress={() => onRowPress && onRowPress(row)}
                                    activeOpacity={onRowPress ? 0.7 : 1}
                                    style={[
                                        styles.bodyRow,
                                        {
                                            borderBottomColor: isDark ? '#27272A' : '#F4F4F5',
                                            backgroundColor: isSelected ? (isDark ? '#27272A80' : '#EFF6FF80') : 'transparent',
                                        }
                                    ]}
                                >
                                    {selectable ? (
                                        <View style={styles.selectCell}>
                                            <Checkbox
                                                checked={isSelected}
                                                onChange={() => handleSelectRow(rowKey)}
                                            />
                                        </View>
                                    ) : null}

                                    {columns.map((col) => (
                                        <View
                                            key={col.key}
                                            style={[
                                                styles.bodyCell,
                                                col.width ? { width: col.width } : { flex: 1, minWidth: 120 }
                                            ]}
                                        >
                                            {col.render ? (
                                                col.render(row[col.key], row)
                                            ) : (
                                                <Text style={[styles.cellText, { color: colors.textPrimary }]}>
                                                    {row[col.key] !== undefined && row[col.key] !== null ? String(row[col.key]) : '-'}
                                                </Text>
                                            )}
                                        </View>
                                    ))}
                                </TouchableOpacity>
                            );
                        })
                    )}
                </View>
            </ScrollView>

            {/* Pagination Controls */}
            {totalPages > 1 ? (
                <View style={[styles.pagination, { borderTopColor: isDark ? '#27272A' : '#E4E4E7' }]}>
                    <Text style={[styles.pageInfo, { color: colors.textTertiary }]}>
                        Page {page + 1} of {totalPages}
                    </Text>

                    <View style={styles.pageButtons}>
                        <TouchableOpacity
                            onPress={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                            style={[styles.pageBtn, { opacity: page === 0 ? 0.4 : 1 }]}
                        >
                            <ChevronLeft size={16} color={colors.textPrimary} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1}
                            style={[styles.pageBtn, { opacity: page >= totalPages - 1 ? 0.4 : 1 }]}
                        >
                            <ChevronRight size={16} color={colors.textPrimary} />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        borderWidth: 1,
        overflow: 'hidden',
        width: '100%',
        marginVertical: 8,
    },
    toolbar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderBottomWidth: 1,
        gap: 12,
    },
    searchWrap: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderRadius: 10,
        height: 36,
    },
    searchInput: {
        flex: 1,
        fontSize: 13,
        paddingLeft: 6,
        outlineStyle: 'none',
    },
    resultsCount: {
        fontSize: 12,
        fontWeight: '500',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    selectCell: {
        width: 38,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerCell: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
    },
    headerCellText: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    bodyRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
    },
    bodyCell: {
        paddingHorizontal: 8,
        justifyContent: 'center',
    },
    cellText: {
        fontSize: 13,
    },
    emptyWrap: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 13,
    },
    pagination: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderTopWidth: 1,
    },
    pageInfo: {
        fontSize: 12,
    },
    pageButtons: {
        flexDirection: 'row',
        gap: 6,
    },
    pageBtn: {
        width: 32,
        height: 32,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
