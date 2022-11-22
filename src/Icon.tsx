import { Text, StyleSheet, PlatformColor } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

type IconProps = { name: string; children?: React.ReactNode };

export const Icon = ({ name, children }: IconProps) => {
  return (
    <Text style={styles.text}>
      <Ionicons name={name} size={15} color={PlatformColor('secondaryLabel')} />{' '}
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: PlatformColor('secondaryLabel'),
    fontSize: 15,
    lineHeight: 20,
  },
});
