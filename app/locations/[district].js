import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import DistrictLandingView from '../../components/DistrictLandingView';

export default function DynamicDistrictScreen() {
    const { district } = useLocalSearchParams();
    return <DistrictLandingView districtKey={district || 'kozhikode'} />;
}
