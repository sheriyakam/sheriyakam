import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LocationMap = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Map not supported on Web</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    text: {
        color: '#666',
        fontSize: 16,
    }
});

export default LocationMap;
