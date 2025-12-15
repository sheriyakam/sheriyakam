import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import { COLORS } from '../constants/theme';

export default function JobMap({ latitude, longitude, customer, service, address }) {

    const handleDirections = () => {
        const query = encodeURIComponent(address || `${latitude},${longitude}`);
        const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
        Linking.openURL(url);
    };

    return (
        <TouchableOpacity style={styles.webMapPlaceholder} onPress={handleDirections}>
            <Text style={{ color: COLORS.accent }}>Open in Google Maps</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    webMapPlaceholder: {
        height: 150,
        backgroundColor: '#eee',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 12,
        marginBottom: 24, // SPACING.xl
    },
});
