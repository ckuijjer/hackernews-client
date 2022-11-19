import React from 'react';
import { View, StyleSheet, PlatformColor } from 'react-native';

const styles = StyleSheet.create({
  icon: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: PlatformColor('systemBlue'),
  },
});

export const UnreadIcon = () => {
  return <View style={styles.icon} />;
};
