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
    Alert,
    Linking
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { X, CheckCircle, Calendar, Camera, Image as ImageIcon } from 'lucide-react-native';
import { COLORS, SPACING } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import { createBooking } from '../constants/bookingStore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../context/ThemeContext';
import LocationPicker from './LocationPicker';
import { geminiService } from '../services/geminiService';
import { snitch } from '../utils/snitch';

const AI_SUGGESTIONS = [
    // Motor
    { keywords: ['motor', 'pump', 'water', 'vellam', 'motar', 'plumbing', 'plumber'], text: 'Motor running, no water' },
    { keywords: ['motor', 'pump', 'water', 'vellam', 'motar', 'plumbing', 'plumber'], text: 'Motor on aavunnilla' },
    { keywords: ['motor', 'pump', 'water', 'vellam', 'motar', 'plumbing', 'plumber'], text: 'Motor making loud noise' },
    { keywords: ['motor', 'pump', 'water', 'vellam', 'motar', 'plumbing', 'plumber'], text: 'Switch spark / not starting' },
    // Fan
    { keywords: ['fan', 'ceiling', 'kat', 'kaat', 'rotate', 'electrician'], text: 'Fan speed very slow' },
    { keywords: ['fan', 'ceiling', 'kat', 'kaat', 'rotate', 'electrician'], text: 'Fan making weird sounds' },
    { keywords: ['fan', 'bldc', 'remote', 'electrician'], text: 'Remote / Board complaint' },
    { keywords: ['fan', 'ceiling', 'kat', 'kaat', 'electrician'], text: 'Fan work aavunnilla' },
    // AC
    { keywords: ['ac', 'air', 'cool', 'tannup', 'ac repair'], text: 'AC not cooling' },
    { keywords: ['ac', 'air', 'cool', 'tannup', 'ac repair'], text: 'Water leaking from AC' },
    { keywords: ['ac', 'air', 'cool', 'tannup', 'ac repair'], text: 'AC auto-turning off' },
    // Light / Switch / General
    { keywords: ['light', 'bulb', 'switch', 'current', 'wire', 'board', 'electrician', 'wiring'], text: 'Switchboard is damaged' },
    { keywords: ['light', 'bulb', 'switch', 'current', 'wire', 'board', 'electrician', 'wiring'], text: 'Power tripping / MCB issue' },
    { keywords: ['light', 'bulb', 'switch', 'current', 'wire', 'board', 'electrician', 'wiring'], text: 'Short circuit / burning smell' },
    { keywords: ['light', 'bulb', 'switch', 'current', 'wire', 'board', 'electrician', 'wiring'], text: 'Dim current / flickering' },
    // Emergency
    { keywords: ['emergency', 'urgent', 'specialist'], text: 'Current illa (Total power failure)' },
    { keywords: ['emergency', 'urgent', 'specialist'], text: 'Water motor completely dead' },
    { keywords: ['emergency', 'urgent', 'specialist'], text: 'Massive water leak / broken pipe' },
    { keywords: ['emergency', 'urgent', 'specialist'], text: 'Main board burning / fire risk' }
];

const BookingModal = ({ service, visible, onClose }) => {
    const { user } = useAuth();
    const router = useRouter();
    const { theme, colors } = useTheme();
    const isDark = theme === 'dark';
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState('Today');
    const [selectedImage, setSelectedImage] = useState(null);
    const [issues, setIssues] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiResult, setAiResult] = useState(null);

    // Reset state when modal opens
    React.useEffect(() => {
        if (visible) {
            setStep(1);

            const currentHour = new Date().getHours();
            // If after 6 PM (18), default to Tomorrow
            const initialDate = currentHour >= 18 ? 'Tomorrow' : 'Today';
            setSelectedDate(initialDate);

            setSelectedImage(null);
            setIssues('');
            setAiLoading(false);
            setAiResult(null);

            // Check and auto-enable location provider on Android when booking modal opens
            const checkLocationOnOpen = async () => {
                if (Platform.OS !== 'web') {
                    try {
                        const servicesEnabled = await Location.hasServicesEnabledAsync();
                        if (!servicesEnabled && Platform.OS === 'android') {
                            await Location.enableNetworkProviderAsync();
                        }
                    } catch (e) {
                        console.log('Failed to auto-enable location on booking modal open:', e);
                    }
                }
            };
            checkLocationOnOpen();

            // Attempt to load the last used location from AsyncStorage
            const loadLastLocation = async () => {
                try {
                    const savedLoc = await AsyncStorage.getItem('last_customer_location');
                    if (savedLoc) {
                        setSelectedLocation(JSON.parse(savedLoc));
                    } else {
                        setSelectedLocation(null);
                    }
                } catch (e) {
                    console.log('Error loading last location:', e);
                    setSelectedLocation(null);
                }
            };
            loadLastLocation();
        }
    }, [visible]);

    const runAiDiagnostic = async (imageUri) => {
        setAiLoading(true);
        setAiResult(null);
        snitch.logEvent('gemini_diagnostics_started', { category: service?.name, type: 'image' });
        try {
            const category = service?.name || 'general';
            const result = await geminiService.analyzeIssueImage(imageUri, category);
            setAiResult(result);
            if (result && result.possibleIssue) {
                snitch.logEvent('gemini_diagnostics_success', { possibleIssue: result.possibleIssue, type: 'image' });
                let updatedNotes = `[Gemini AI Diagnosis] possible issue: ${result.possibleIssue}.\n`;
                if (result.materialsNeeded) {
                    updatedNotes += `Estimated materials: ${result.materialsNeeded}.\n`;
                }
                setIssues(prev => {
                    const cleanPrev = prev.replace(/\[Gemini AI Diagnosis\][\s\S]*/, '').trim();
                    if (!cleanPrev) return updatedNotes;
                    return cleanPrev + "\n\n" + updatedNotes;
                });
            }
        } catch (error) {
            snitch.logError(error, 'Gemini image diagnostics');
            console.error("[BookingModal] Gemini diagnostic error:", error);
        } finally {
            setAiLoading(false);
        }
    };

    const runAiTextDiagnostic = async () => {
        if (!issues.trim()) {
            Alert.alert("Input Required", "Please enter some issue details first to analyze.");
            return;
        }
        setAiLoading(true);
        setAiResult(null);
        snitch.logEvent('gemini_diagnostics_started', { category: service?.name, type: 'text' });
        try {
            const category = service?.name || 'general';
            const result = await geminiService.analyzeIssueText(issues, category);
            setAiResult(result);
            if (result && result.possibleIssue) {
                snitch.logEvent('gemini_diagnostics_success', { possibleIssue: result.possibleIssue, type: 'text' });
                let updatedNotes = `[Gemini AI Diagnosis] possible issue: ${result.possibleIssue}.\n`;
                if (result.materialsNeeded) {
                    updatedNotes += `Estimated materials: ${result.materialsNeeded}.\n`;
                }
                setIssues(prev => {
                    const cleanPrev = prev.replace(/\[Gemini AI Diagnosis\][\s\S]*/, '').trim();
                    if (!cleanPrev) return updatedNotes;
                    return cleanPrev + "\n\n" + updatedNotes;
                });
            }
        } catch (error) {
            snitch.logError(error, 'Gemini text diagnostics');
            console.error("[BookingModal] Gemini text diagnostic error:", error);
        } finally {
            setAiLoading(false);
        }
    };

    // Smart AI suggestions based on service AND typing
    const getFilteredSuggestions = () => {
        if (!service) return [];
        
        let queryStr = issues.trim().toLowerCase();
        
        // If user hasn't typed anything, use the service name + type as the AI context
        if (queryStr.length === 0) {
            queryStr = `${service.name} ${service.type || ''}`.toLowerCase();
        }

        const queryWords = queryStr.split(' ').filter(w => w.length > 2);

        return AI_SUGGESTIONS.filter(s => {
            // Match if any keyword is in the query string OR if any query string word is in keywords
            const isMatch = s.keywords.some(k => queryStr.includes(k) || queryWords.some(qw => k.includes(qw)));
            return isMatch && !issues.includes(s.text);
        });
    };

    if (!service) return null;

    const isEmergency = service.name.toLowerCase().includes('emergency');

    // Determine available days
    const currentHour = new Date().getHours();
    const isTodayOver = currentHour >= 18; // 6 PM

    const availableDays = isTodayOver ? ['Tomorrow'] : ['Today', 'Tomorrow'];

    const handleSubmit = () => {
        snitch.logEvent('booking_creation_started', { service: service?.name });
        // Validation: Must have EITHER text or photo
        if (!issues.trim() && !selectedImage) {
            Alert.alert(
                'Missing Details',
                'Please either describe your issue or add a photo so the partner knows what to expect.'
            );
            return;
        }

        // Check if user is logged in
        if (!user) {
            snitch.logEvent('booking_creation_redirected_to_auth');
            // Close the booking modal
            onClose();
            // Redirect to login page
            Alert.alert(
                'Login Required',
                'Please login or sign up to confirm your booking.',
                [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Login / Sign Up', onPress: () => router.push('/auth/login') }
                ]
            );
            return;
        }

        // Create the booking object
        const newBooking = {
            customerName: user.name || 'Customer',
            customerEmail: user.email,
            customerPhone: user.mobile || '+91 00000 00000',
            service: service.name,
            serviceType: service.type || (service.name?.includes('AC') ? 'AC' : 'Electrician'),
            date: selectedDate,
            time: 'Flexible',
            price: service.price,
            notes: issues.trim() || 'Photo provided as issue detail',
            imageUrl: selectedImage,
            address: selectedLocation?.address || 'Thalassery, Kerala',
            latitude: selectedLocation?.latitude || null,
            longitude: selectedLocation?.longitude || null,
            serviceName: service.name,
        };

        try {
            // Save to store!
            createBooking(newBooking);
            snitch.logEvent('booking_creation_success', { service: service.name, date: selectedDate, hasPhoto: !!selectedImage });
        } catch (err) {
            snitch.logError(err, 'Booking store createBooking');
            Alert.alert('Error', 'Failed to create booking.');
            return;
        }

        // Auto-save this location for the next booking
        if (selectedLocation) {
            AsyncStorage.setItem('last_customer_location', JSON.stringify(selectedLocation))
                .catch(err => console.log('Error saving last location:', err));
        }

        // Show success screen
        setStep(2);
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
                const uri = result.assets[0].uri;
                setSelectedImage(uri);
                runAiDiagnostic(uri);
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
                {
                    borderColor: selected ? colors.accent : colors.border,
                    backgroundColor: selected ? colors.accent : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'),
                },
                isDate && styles.chipDate
            ]}
        >
            <Text style={[
                styles.chipText,
                {
                    color: selected ? '#ffffff' : colors.textSecondary,
                    fontWeight: selected ? 'bold' : '500',
                }
            ]}>
                {label}
            </Text>
            {subLabel && (
                <Text style={[styles.chipSubLabel, { color: colors.textTertiary }]}>{subLabel}</Text>
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
                    behavior={Platform.OS === 'ios' ? 'padding' : Platform.OS === 'web' ? undefined : 'height'}
                    style={styles.keyboardView}
                >
                    <View style={[styles.container, { backgroundColor: colors.bgSecondary, borderColor: colors.border }]}>
                        {/* Fixed Header */}
                        <View style={[styles.modalHeader, { backgroundColor: colors.bgSecondary, borderBottomColor: colors.border }]}>
                            <View style={{ flex: 1, paddingRight: 16 }}>
                                <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Book Service</Text>
                                {service && (
                                    <Text style={[styles.headerSubtitle, { color: colors.accent }]} numberOfLines={1}>
                                        {service.name}
                                    </Text>
                                )}
                            </View>
                            <TouchableOpacity
                                onPress={onClose}
                                style={[
                                    styles.headerCloseBtn,
                                    {
                                        backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
                                        borderColor: colors.border
                                    }
                                ]}
                                activeOpacity={0.7}
                            >
                                <X size={22} color={colors.textPrimary} />
                            </TouchableOpacity>
                        </View>

                        {step === 1 ? (
                            <View style={{ flex: 1 }}>
                                <ScrollView
                                    style={{ flex: 1 }}
                                    contentContainerStyle={[styles.content, { paddingTop: 8 }]}
                                    showsVerticalScrollIndicator={false}
                                    bounces={false}
                                >
                                    {/* Date Selection */}
                                    <View style={styles.section}>
                                        <View style={styles.labelRow}>
                                            <Calendar size={16} color={colors.textTertiary} />
                                            <Text style={[styles.label, { color: colors.textSecondary }]}>Schedule Day</Text>
                                        </View>
                                        <View style={styles.chipGroup}>
                                            {availableDays.map(day => {
                                                const isSelected = selectedDate === day;
                                                return (
                                                    <SelectionChip
                                                        key={day}
                                                        label={day}
                                                        selected={isSelected}
                                                        onClick={() => setSelectedDate(day)}
                                                        isDate
                                                    />
                                                );
                                            })}
                                        </View>
                                    </View>

                                    {/* Issue Details */}
                                    <View style={styles.section}>
                                        <Text style={[styles.label, { color: colors.textSecondary }]}>Issue Details</Text>
                                        <TextInput
                                            style={[
                                                styles.input,
                                                {
                                                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                                                    borderColor: colors.border,
                                                    color: colors.textPrimary
                                                }
                                            ]}
                                            placeholder={`Describe the problem for our specialist...`}
                                            placeholderTextColor={colors.textTertiary}
                                            multiline
                                            numberOfLines={3}
                                            value={issues}
                                            onChangeText={setIssues}
                                        />

                                        {/* AI Suggestions Engine */}
                                        {getFilteredSuggestions().length > 0 && (
                                            <ScrollView 
                                                horizontal 
                                                showsHorizontalScrollIndicator={false}
                                                style={{ marginTop: 8, marginBottom: 12 }}
                                                contentContainerStyle={{ paddingBottom: 4 }}
                                            >
                                                {getFilteredSuggestions().map((suggestion, idx) => (
                                                    <TouchableOpacity 
                                                        key={idx}
                                                        style={[
                                                            styles.aiChip,
                                                            {
                                                                backgroundColor: isDark ? 'rgba(79, 70, 229, 0.15)' : 'rgba(79, 70, 229, 0.08)',
                                                                borderColor: isDark ? 'rgba(79, 70, 229, 0.3)' : 'rgba(79, 70, 229, 0.15)'
                                                            }
                                                        ]}
                                                        onPress={() => setIssues(suggestion.text)}
                                                    >
                                                        <Text style={[styles.aiChipText, { color: colors.accent }]}>✨ {suggestion.text}</Text>
                                                    </TouchableOpacity>
                                                ))}
                                            </ScrollView>
                                        )}

                                        {/* Get AI Diagnostic Suggestion Button */}
                                        {issues.trim().length > 5 && (
                                            <TouchableOpacity
                                                style={{
                                                    flexDirection: 'row',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.08)',
                                                    borderColor: colors.accent,
                                                    borderWidth: 1,
                                                    borderRadius: 8,
                                                    paddingVertical: 8,
                                                    paddingHorizontal: 12,
                                                    marginTop: 8,
                                                    marginBottom: 12,
                                                }}
                                                onPress={runAiTextDiagnostic}
                                                disabled={aiLoading}
                                            >
                                                <Text style={{ color: colors.accent, fontWeight: '700', fontSize: 13 }}>
                                                    ✨ Ask Gemini AI for Diagnostics
                                                </Text>
                                            </TouchableOpacity>
                                        )}

                                        {/* Image Picker or Preview Area */}
                                        {!selectedImage ? (
                                            <TouchableOpacity
                                                onPress={handleImageMock}
                                                style={[
                                                    styles.uploadArea,
                                                    {
                                                        borderColor: colors.border,
                                                        backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'
                                                    }
                                                ]}
                                            >
                                                <Camera size={22} color={colors.textTertiary} />
                                                <Text style={[styles.uploadText, { color: colors.textTertiary }]}>Add Photo</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={styles.imagePreviewContainer}>
                                                <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setSelectedImage(null);
                                                        setAiResult(null);
                                                    }}
                                                    style={styles.removeImageBtn}
                                                >
                                                    <X size={16} color="#fff" />
                                                </TouchableOpacity>
                                            </View>
                                        )}

                                        {/* AI Diagnostic Loader */}
                                        {aiLoading && (
                                            <View style={[styles.aiDiagnosticBox, { backgroundColor: isDark ? 'rgba(99,102,241,0.08)' : 'rgba(99,102,241,0.04)', borderColor: colors.accent, marginTop: 12 }]}>
                                                <ActivityIndicator size="small" color={colors.accent} />
                                                <Text style={[styles.aiDiagnosticLoadingText, { color: colors.accent }]}>
                                                    ✨ Gemini AI diagnosing issue...
                                                </Text>
                                            </View>
                                        )}

                                        {/* AI Diagnostic Result Report */}
                                        {aiResult && !aiLoading && (
                                            <View style={[styles.aiResultBox, { backgroundColor: isDark ? 'rgba(30,41,59,0.7)' : 'rgba(241,245,249,0.7)', borderColor: colors.border, marginTop: 12 }]}>
                                                <View style={styles.aiResultHeader}>
                                                    <Text style={[styles.aiResultTitle, { color: colors.textPrimary }]}>✨ Gemini AI Diagnostic Report</Text>
                                                    {aiResult.confidence && (
                                                        <Text style={[styles.aiConfidenceBadge, { color: colors.accent, backgroundColor: isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)' }]}>
                                                            {aiResult.confidence} Match
                                                        </Text>
                                                    )}
                                                </View>

                                                <View style={styles.aiResultBody}>
                                                    <Text style={[styles.aiLabel, { color: colors.textSecondary }]}>Possible Issue:</Text>
                                                    <Text style={[styles.aiValue, { color: colors.textPrimary }]}>{aiResult.possibleIssue}</Text>

                                                    {aiResult.safetyAdvice && (
                                                        <View style={[styles.aiSafetyBox, { backgroundColor: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.2)' }]}>
                                                            <Text style={styles.aiSafetyTitle}>⚠️ Safety Advisory</Text>
                                                            <Text style={styles.aiSafetyText}>{aiResult.safetyAdvice}</Text>
                                                        </View>
                                                    )}

                                                    {aiResult.materialsNeeded && (
                                                        <View style={{ marginTop: 8 }}>
                                                            <Text style={[styles.aiLabel, { color: colors.textSecondary }]}>Expected Materials:</Text>
                                                            <Text style={[styles.aiValue, { color: colors.textPrimary, fontSize: 13 }]}>{aiResult.materialsNeeded}</Text>
                                                        </View>
                                                    )}
                                                    
                                                    {aiResult.estimatedCost && (
                                                        <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Text style={[styles.aiLabel, { color: colors.textSecondary }]}>Estimated Cost:</Text>
                                                            <Text style={[styles.aiCostValue, { color: colors.success }]}>{aiResult.estimatedCost}</Text>
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        )}
                                    </View>

                                    {/* Location Picker */}
                                    <View style={styles.section}>
                                        <LocationPicker
                                            onLocationSelected={setSelectedLocation}
                                            currentLocation={selectedLocation}
                                        />
                                    </View>

                                    {/* Price Estimator */}
                                    <View style={styles.section}>
                                        <Text style={[styles.label, { color: colors.textSecondary }]}>Service Charge</Text>
                                        <View style={[
                                            styles.priceContainer,
                                            {
                                                backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)',
                                                borderColor: colors.border
                                            }
                                        ]}>
                                            <View style={styles.priceRow}>
                                                <Text style={[styles.priceTotalText, { color: colors.textPrimary }]}>Service Fare</Text>
                                                <Text style={[styles.priceTotalValue, { color: colors.accent }]}>₹{service.price}</Text>
                                            </View>
                                        </View>
                                        <Text style={[styles.disclaimerText, { color: colors.textTertiary }]}>
                                            * Material cost (if any) will be added by the technician after the job.
                                        </Text>
                                    </View>
                                </ScrollView>
                                <View style={[styles.footer, { backgroundColor: colors.bgSecondary, borderTopWidth: 1, borderTopColor: colors.border }]}>
                                    <TouchableOpacity
                                        onPress={handleSubmit}
                                        style={[styles.confirmBtn, { backgroundColor: colors.accent }]}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[styles.confirmBtnText, { color: '#ffffff' }]}>Confirm Booking</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ) : (
                            // Success Screen
                            <View style={[styles.content, styles.successContent]}>
                                <CheckCircle size={64} color={colors.success} />
                                <Text style={[styles.successTitle, { color: colors.textPrimary }]}>Booking Confirmed!</Text>
                                <Text style={[styles.successText, { color: colors.textSecondary }]}>
                                    Technician arriving <Text style={{ color: colors.textPrimary, fontWeight: 'bold' }}>{selectedDate}</Text>.
                                </Text>

                                {selectedImage && (
                                    <View style={[
                                        styles.imageTag,
                                        {
                                            backgroundColor: isDark ? 'rgba(79, 70, 229, 0.15)' : 'rgba(79, 70, 229, 0.08)'
                                        }
                                    ]}>
                                        <ImageIcon size={14} color={colors.accent} />
                                        <Text style={[styles.imageTagText, { color: colors.accent }]}>Image Attached</Text>
                                    </View>
                                )}

                                <Text style={[styles.successSubText, { color: colors.textTertiary }]}>You will receive a call shortly.</Text>

                                <TouchableOpacity
                                    onPress={onClose}
                                    style={[styles.confirmBtn, styles.outlineBtn, { borderColor: colors.border }]}
                                    activeOpacity={0.8}
                                >
                                    <Text style={[styles.confirmBtnText, { color: colors.textPrimary }]}>Done</Text>
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
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Platform.OS === 'web' ? 24 : SPACING.md,
    },
    keyboardView: {
        width: '100%',
        alignItems: 'center',
    },
    container: {
        width: '100%',
        maxWidth: 500,
        maxHeight: '90%',
        alignSelf: 'center',
        borderRadius: 24,
        borderWidth: 1,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    headerSubtitle: {
        fontSize: 13,
        marginTop: 2,
    },
    headerCloseBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    content: {
        padding: SPACING.lg,
    },
    footer: {
        padding: SPACING.lg,
        paddingTop: 12,
    },
    section: {
        marginBottom: 20,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
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
    },
    chipDate: {
        minWidth: 80,
        alignItems: 'center',
    },
    chipText: {
        fontWeight: '500',
        fontSize: 14,
    },
    chipSubLabel: {
        fontSize: 10,
        marginTop: 2
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        textAlignVertical: 'top',
        marginBottom: 8,
        fontSize: 14,
    },
    uploadArea: {
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    uploadText: {
        fontSize: 14,
        fontWeight: '500',
    },
    imagePreviewContainer: {
        marginTop: 15,
        position: 'relative',
        borderRadius: 8,
        overflow: 'hidden',
    },
    imagePreview: {
        width: '100%',
        height: 150,
        borderRadius: 8,
    },
    removeImageBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        padding: 4,
    },
    aiChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 16,
        marginRight: 8,
        borderWidth: 1,
    },
    aiChipText: {
        fontSize: 13,
        fontWeight: '500',
    },
    confirmBtn: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    confirmBtnText: {
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
        marginTop: 16,
        marginBottom: 8,
    },
    successText: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
    },
    successSubText: {
        fontSize: 14,
        marginBottom: 24,
    },
    imageTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 16,
        marginBottom: 16,
    },
    imageTagText: {
        fontSize: 12,
        fontWeight: '600',
    },
    outlineBtn: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        width: '100%',
    },
    priceContainer: {
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        marginBottom: 8,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priceTotalText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    priceTotalValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    disclaimerText: {
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 4,
    },
    aiDiagnosticBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 10,
    },
    aiDiagnosticLoadingText: {
        fontSize: 13,
        fontWeight: '600',
    },
    aiResultBox: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 14,
        marginTop: 12,
    },
    aiResultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(128,128,128,0.15)',
        paddingBottom: 8,
        marginBottom: 8,
    },
    aiResultTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    aiConfidenceBadge: {
        fontSize: 11,
        fontWeight: 'bold',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        overflow: 'hidden',
    },
    aiResultBody: {
        gap: 6,
    },
    aiLabel: {
        fontSize: 11,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    aiValue: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    aiSafetyBox: {
        borderRadius: 8,
        borderWidth: 1,
        padding: 10,
        marginVertical: 6,
    },
    aiSafetyTitle: {
        color: '#ef4444',
        fontWeight: 'bold',
        fontSize: 12,
        marginBottom: 2,
    },
    aiSafetyText: {
        color: '#b91c1c',
        fontSize: 12,
        lineHeight: 16,
    },
    aiCostValue: {
        fontSize: 15,
        fontWeight: 'bold',
    },
});

export default BookingModal;
