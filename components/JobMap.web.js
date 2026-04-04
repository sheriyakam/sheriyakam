import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import { COLORS } from '../constants/theme';

export default function JobMap({ latitude, longitude, customer, service, address }) {

    const query = encodeURIComponent(address || `${latitude},${longitude}`);
    const embedUrl = `https://maps.google.com/maps?q=${query}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

    const handleDirections = () => {
        const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
        Linking.openURL(url);
    };

    return (
        <View style={{ marginBottom: 24 }}>
            <View style={styles.webMapContainer}>
                <iframe 
                    src={embedUrl}
                    style={{ width: '100%', height: '100%', border: 'none', borderRadius: 12 }}
                    allowFullScreen
                    loading="lazy"
                />
            </View>
            <TouchableOpacity style={styles.fullScreenBtn} onPress={handleDirections}>
                <Text style={styles.fullScreenText}>Open in Google Maps App</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    webMapContainer: {
        height: 200,
        backgroundColor: '#eee',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 8,
    },
    fullScreenBtn: {
        backgroundColor: COLORS.bgSecondary,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    fullScreenText: {
        color: COLORS.accent,
        fontWeight: '600',
    }
});
