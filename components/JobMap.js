import React from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { COLORS } from '../constants/theme';

export default function JobMap({ latitude, longitude, customer, service }) {
    return (
        <View style={styles.mapContainer}>
            <MapView
                style={styles.map}
                provider={PROVIDER_DEFAULT}
                initialRegion={{
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                <Marker
                    coordinate={{ latitude: latitude, longitude: longitude }}
                    title={customer}
                    description={service}
                />
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: 24, // SPACING.xl
    },
    map: {
        width: '100%',
        height: '100%',
    },
});
