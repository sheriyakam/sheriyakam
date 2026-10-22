import React from 'react';
import { View, Image, TouchableOpacity, Linking, Platform, StyleSheet } from 'react-native';

export default function CodeHypeBadge({ style }) {
  const badgeUrl = 'https://www.codehype.ai/product/sheriyakam?utm_source=codehype_badge';
  const imgUrl = 'https://www.codehype.ai/badges/sheriyakam.svg?variant=find-us&v=20';

  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, style]}>
        <a
          href={badgeUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: 'inline-block', border: 0, textDecoration: 'none' }}
        >
          <img
            src={imgUrl}
            alt="Featured on CodeHype"
            width={180}
            height={65}
            loading="lazy"
            decoding="async"
            style={{
              display: 'inline-block',
              border: 0,
              width: '100%',
              maxWidth: 180,
              height: 'auto',
              maxHeight: 65,
            }}
          />
        </a>
      </View>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => Linking.openURL(badgeUrl)}
      style={[styles.container, style]}
      accessibilityRole="link"
      accessibilityLabel="Featured on CodeHype"
    >
      <Image
        source={{ uri: imgUrl }}
        style={styles.image}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  image: {
    width: 180,
    height: 65,
  },
});
