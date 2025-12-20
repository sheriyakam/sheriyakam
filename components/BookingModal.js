import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    TextInput,
    Image,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { X, CheckCircle, Calendar, Clock, Camera, Image as ImageIcon } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { COLORS, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

const BookingModal = ({ service, visible, onClose }) => {
    const { user } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState('Today');
    const [customDate, setCustomDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('Morning');
    const [selectedImage, setSelectedImage] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());

    // Helper to get slots
    const getAvailableSlots = (dateStr) => {
        const slotDefinitions = [
            { id: 'Morning', label: 'Morning', sub: '8 AM - 11 AM', endHour: 11 },
            { id: 'Afternoon', label: 'Afternoon', sub: '12 PM - 3 PM', endHour: 15 },
            { id: 'Evening', label: 'Evening', sub: '4 PM - 7 PM', endHour: 19 }
        ];

        if (dateStr !== 'Today') return slotDefinitions;

        const currentHour = new Date().getHours();
        return slotDefinitions.filter(slot => currentHour < slot.endHour);
    };

    // Reset state when modal opens
    React.useEffect(() => {
        if (visible) {
            setStep(1);

            const currentHour = new Date().getHours();
            // If after 7 PM (19), default to Tomorrow
            const initialDate = currentHour >= 19 ? 'Tomorrow' : 'Today';
            setSelectedDate(initialDate);

            // Auto-select first available slot
            const slots = getAvailableSlots(initialDate);
            if (slots.length > 0) {
                setSelectedSlot(slots[0].id);
            }

            setCustomDate('');
            setSelectedImage(null);
            setDate(new Date());
            setShowDatePicker(false);
        }
    }, [visible]);

    if (!service) return null;

    const isEmergency = service.name.toLowerCase().includes('emergency');

    // Determine available days
    const currentHour = new Date().getHours();
    const isTodayOver = currentHour >= 19; // 7 PM

    let availableDays = [];
    if (isEmergency) {
        availableDays = isTodayOver ? ['Tomorrow'] : ['Today'];
    } else {
        availableDays = isTodayOver ? ['Tomorrow', 'Pick Date'] : ['Today', 'Tomorrow', 'Pick Date'];
    }

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDate(selectedDate);
            const formattedDate = selectedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            setSelectedDate('Custom');
            setCustomDate(formattedDate);

            // Auto Select for Custom Date (All slots available)
            setSelectedSlot('Morning');
        }
    };

    const handleDaySelect = (day) => {
        setSelectedDate(day);
        setCustomDate('');

        // Auto select first slot
        const slots = getAvailableSlots(day);
        if (slots.length > 0) {
            setSelectedSlot(slots[0].id);
        }
    };

    const handleSubmit = () => {
        // Check if user is logged in
        if (!user) {
            // Close the booking modal
            onClose();
            // Redirect to login page
            Alert.alert(
                'Login Required',
                'Please login or sign up to confirm your booking.',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel'
                    },
                    {
                        text: 'Login / Sign Up',
                        onPress: () => router.push('/auth/login')
                    }
                ]
            );
            return;
        }

        // User is logged in, proceed with booking
        setStep(2); // Show success
    };

    const selectImage = async (useCamera) => {
        try {
            let result;
            if (useCamera) {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission needed', 'Camera permission is required to take photos.');
                    return;
                }
                result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.8,
                });
            } else {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Permission needed', 'Gallery permission is required to select photos.');
                    return;
                }
                result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.8,
                });
            }

            if (!result.canceled) {
                setSelectedImage(result.assets[0].uri);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const handleImageMock = () => {
        if (Platform.OS === 'web') {
            selectImage(false);
            return;
        }

        Alert.alert(
            "Add Photo",
            "Choose an option",
            [
                {
                    text: "Camera",
                    onPress: () => selectImage(true)
                },
                {
                    text: "Gallery",
                    onPress: () => selectImage(false)
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ]
        );
    };

    const SelectionChip = ({ label, subLabel, selected, onClick, isDate = false }) => (
        <TouchableOpacity
            onPress={onClick}
            style={[
                styles.chip,
                selected ? styles.chipSelected : styles.chipUnselected,
                isDate && styles.chipDate
            ]}
        >
            <Text style={[styles.chipText, selected ? styles.chipTextSelected : styles.chipTextUnselected]}>
                {label}
            </Text>
            {subLabel && (
                <Text style={styles.chipSubLabel}>{subLabel}</Text>
            )}
        </TouchableOpacity>
    );

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={styles.container}>
                        {/* Close Button */}
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeBtn}
                        >
                            <X size={24} color={COLORS.textSecondary} />
                        </TouchableOpacity>

                        {step === 1 ? (
                            <View style={{ flexShrink: 1 }}>
                                <ScrollView
                                    contentContainerStyle={styles.content}
                                    showsVerticalScrollIndicator={false}
                                >
                                    <Text style={styles.title}>Book Service</Text>
                                    <Text style={styles.subtitle}>
                                        Requesting: <Text style={{ color: COLORS.accent }}>{service.name}</Text>
                                    </Text>

                                    {/* Date Selection */}
                                    <View style={styles.section}>
                                        <View style={styles.labelRow}>
                                            <Calendar size={16} color={COLORS.textTertiary} />
                                            <Text style={styles.label}>Schedule Day</Text>
                                        </View>
                                        <View style={styles.chipGroup}>
                                            {availableDays.map(day => {
                                                const isCustom = day === 'Pick Date';
                                                const isSelected = isCustom ? selectedDate === 'Custom' : selectedDate === day;
                                                const label = (isCustom && selectedDate === 'Custom') ? customDate : day;

                                                return (
                                                    <SelectionChip
                                                        key={day}
                                                        label={label}
                                                        selected={isSelected}
                                                        onClick={() => {
                                                            if (isCustom) {
                                                                setShowDatePicker(true);
                                                            } else {
                                                                handleDaySelect(day);
                                                            }
                                                        }}
                                                        isDate
                                                    />
                                                );
                                            })}
                                            {showDatePicker && (
                                                <DateTimePicker
                                                    value={date}
                                                    mode="date"
                                                    display="default"
                                                    onChange={onDateChange}
                                                    minimumDate={new Date()}
                                                />
                                            )}
                                        </View>
                                    </View>

                                    {/* Time Selection */}
                                    <View style={styles.section}>
                                        <View style={styles.labelRow}>
                                            <Clock size={16} color={COLORS.textTertiary} />
                                            <Text style={styles.label}>Preferred Time</Text>
                                        </View>
                                        <View style={styles.chipGroup}>
                                            {(() => {
                                                const slots = getAvailableSlots(selectedDate);

                                                if (slots.length === 0) {
                                                    return <Text style={{ color: COLORS.textTertiary, fontStyle: 'italic' }}>No slots available for Today. Please choose Tomorrow.</Text>;
                                                }

                                                return slots.map(slot => (
                                                    <SelectionChip
                                                        key={slot.id}
                                                        label={slot.label}
                                                        // subLabel removed as per request
                                                        selected={selectedSlot === slot.id}
                                                        onClick={() => setSelectedSlot(slot.id)}
                                                    />
                                                ));
                                            })()}
                                        </View>
                                    </View>

                                    {/* Issue Details */}
                                    <View style={styles.section}>
                                        <Text style={styles.label}>Issue Details</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Describe your issue..."
                                            placeholderTextColor={COLORS.textTertiary}
                                            multiline
                                            numberOfLines={3}
                                        />

                                        {!selectedImage ? (
                                            <TouchableOpacity
                                                onPress={handleImageMock}
                                                style={styles.uploadArea}
                                            >
                                                <Camera size={24} color={COLORS.textTertiary} />
                                                <Text style={styles.uploadText}>Add Photo</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={styles.imagePreviewContainer}>
                                                <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                                                <TouchableOpacity
                                                    onPress={() => setSelectedImage(null)}
                                                    style={styles.removeImageBtn}
                                                >
                                                    <X size={16} color="#fff" />
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>

                                </ScrollView>
                                <View style={styles.footer}>
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        style={styles.confirmBtn}
                                    >
                                        <Text style={styles.confirmBtnText}>Confirm Booking</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            // Success Screen
                            <View style={[styles.content, styles.successContent]}>
                                <CheckCircle size={64} color={COLORS.success} />
                                <Text style={styles.successTitle}>Booking Confirmed!</Text>
                                <Text style={styles.successText}>
                                    Technician arriving <Text style={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>{selectedDate === 'Custom' ? customDate : selectedDate}</Text> in the <Text style={{ color: COLORS.textPrimary, fontWeight: 'bold' }}>{selectedSlot}</Text>.
                                </Text>

                                {selectedImage && (
                                    <View style={styles.imageTag}>
                                        <ImageIcon size={14} color={COLORS.accent} />
                                        <Text style={styles.imageTagText}>Image Attached</Text>
                                    </View>
                                )}

                                <Text style={styles.successSubText}>You will receive a call shortly.</Text>

                                <TouchableOpacity
                                    onPress={onClose}
                                    style={[styles.confirmBtn, styles.outlineBtn]}
                                >
                                    <Text style={[styles.confirmBtnText, { color: COLORS.textPrimary }]}>Done</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        padding: SPACING.md,
    },
    keyboardView: {
        width: '100%',
        alignItems: 'center',
    },
    container: {
        width: '100%',
        maxWidth: 500,
        alignSelf: 'center',
        backgroundColor: '#18181b',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: COLORS.border,
        overflow: 'hidden',
    },
    footer: {
        padding: SPACING.lg,
        paddingTop: 0,
        backgroundColor: '#18181b', // Ensure background consistency
    },
    closeBtn: {
        position: 'absolute',
        top: 16,
        right: 16,
        zIndex: 10,
        padding: 4,
    },
    content: {
        padding: SPACING.lg,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 8,
    },
    chipGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    chipSelected: {
        backgroundColor: COLORS.accent,
        borderColor: COLORS.accent,
    },
    chipUnselected: {
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    chipDate: {
        minWidth: 80,
        alignItems: 'center',
    },
    chipText: {
        fontWeight: '500',
        fontSize: 14,
    },
    chipTextSelected: {
        color: '#000',
        fontWeight: 'bold',
    },
    chipTextUnselected: {
        color: COLORS.textTertiary,
    },
    chipSubLabel: {
        fontSize: 10,
        color: COLORS.textTertiary, // Should ideally be handled if subLabel exists, but we removed it from usage
        marginTop: 2
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        borderRadius: 8,
        padding: 12,
        color: COLORS.textPrimary,
        textAlignVertical: 'top',
        marginBottom: 8,
    },
    uploadArea: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    uploadText: {
        color: COLORS.textTertiary,
        fontSize: 12,
    },
    imagePreviewContainer: {
        position: 'relative',
        height: 128,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    removeImageBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        padding: 4,
    },
    confirmBtn: {
        backgroundColor: COLORS.accent,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    confirmBtnText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
    },
    successContent: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    successTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginTop: 16,
        marginBottom: 8,
    },
    successText: {
        fontSize: 14,
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: 16,
    },
    successSubText: {
        fontSize: 14,
        color: COLORS.textTertiary,
        marginBottom: 24,
    },
    imageTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: 'rgba(41, 182, 246, 0.1)',
        borderRadius: 16,
        marginBottom: 16,
    },
    imageTagText: {
        color: COLORS.accent,
        fontSize: 12,
    },
    outlineBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.border,
        width: '100%',
    },
});

export default BookingModal;
