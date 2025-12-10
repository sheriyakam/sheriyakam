import React from 'react';
import { useRouter } from 'expo-router';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    Switch
} from 'react-native';
import { X, User, LogIn, UserPlus, Info, FileText, ChevronRight, Moon, Sun, LogOut } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const { width, height } = Dimensions.get('window');
const MENU_WIDTH = Math.min(width * 0.8, 320);

const MenuModal = ({ visible, onClose }) => {
    const router = useRouter();
    const { theme, toggleTheme, colors } = useTheme(); // Get dynamic colors
    const { user, logout } = useAuth();
    const isDark = theme === 'dark';

    const handleLogout = () => {
        logout();
        onClose();
    };

    const MenuItem = ({ icon: Icon, label, onPress, color }) => {
        const iconColor = color || colors.textPrimary;
        return (
            <TouchableOpacity style={styles.menuItem} onPress={onPress}>
                <View style={styles.menuItemLeft}>
                    <Icon size={20} color={iconColor} />
                    <Text style={[styles.menuItemText, { color: iconColor }]}>{label}</Text>
                </View>
                <ChevronRight size={16} color={colors.textTertiary} />
            </TouchableOpacity>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="fade"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>

                <View style={[styles.menuContainer, { backgroundColor: colors.bgPrimary, borderColor: isDark ? colors.border : 'transparent' }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={[styles.title, { color: colors.textPrimary }]}>Menu</Text>
                            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{user ? `Welcome, ${user.name}` : 'Welcome Guest'}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    {/* Divider */}
                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    {/* Menu Items */}
                    {!user && (
                        <View style={[styles.section, { borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Account</Text>
                            <MenuItem icon={LogIn} label="Login or Sign Up" onPress={() => { router.push('/auth/login'); onClose(); }} />
                        </View>
                    )}

                    {user && (
                        <View style={[styles.section, { borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                            <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Dashboard</Text>
                            <MenuItem icon={User} label="Profile" onPress={() => { router.push('/profile'); onClose(); }} />
                            <MenuItem icon={FileText} label="Booking Details" onPress={() => { router.push('/bookings'); onClose(); }} />
                        </View>
                    )}

                    <View style={[styles.section, { borderBottomWidth: 0 }]}>
                        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>App</Text>
                        <MenuItem icon={Info} label="About" onPress={() => { router.push('/about'); onClose(); }} />
                    </View>

                    <View style={[styles.section, { borderBottomWidth: 0 }]}>
                        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Partner</Text>
                        <MenuItem icon={LogIn} label="Partner Access" onPress={() => { router.push('/partner/auth'); onClose(); }} />
                    </View>

                    <View style={[styles.section, { borderBottomWidth: 0 }]}>
                        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>Appearance</Text>
                        <View style={styles.menuItem}>
                            <View style={styles.menuItemLeft}>
                                <View style={{ width: 24, alignItems: 'center' }}>
                                    {isDark ? (
                                        <Moon size={20} color={colors.textPrimary} />
                                    ) : (
                                        <Sun size={20} color={colors.textPrimary} />
                                    )}
                                </View>
                                <Text style={[styles.menuItemText, { color: colors.textPrimary }]}>{isDark ? "Dark Mode" : "Light Mode"}</Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#767577", true: colors.accent }}
                                thumbColor={isDark ? "#fff" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleTheme}
                                value={isDark}
                            />
                        </View>
                    </View>

                    {user && (
                        <View style={[styles.section, { borderBottomWidth: 0 }]}>
                            <MenuItem
                                icon={LogOut}
                                label="Logout"
                                onPress={handleLogout}
                                color={colors.danger}
                            />
                        </View>
                    )}

                    <View style={styles.footer}>
                        <Text style={[styles.version, { color: colors.textTertiary }]}>Version 1.0.0</Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        flexDirection: 'row',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    menuContainer: {
        width: MENU_WIDTH,
        height: '100%',
        backgroundColor: COLORS.bgPrimary,
        padding: SPACING.lg,
        borderRightWidth: 1,
        borderColor: COLORS.border,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
        marginTop: SPACING.md,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    closeBtn: {
        padding: 4,
    },
    divider: {
        height: 1,
        backgroundColor: COLORS.border,
        marginBottom: SPACING.lg,
    },
    section: {
        marginBottom: SPACING.lg,
        paddingBottom: SPACING.md,
        borderBottomWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textTertiary,
        textTransform: 'uppercase',
        marginBottom: SPACING.md,
        letterSpacing: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderRadius: 8,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        marginTop: 'auto',
        alignItems: 'center',
    },
    version: {
        color: COLORS.textTertiary,
        fontSize: 12,
    },
});

export default MenuModal;
