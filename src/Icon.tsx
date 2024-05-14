import { Text, StyleSheet, PlatformColor } from 'react-native';
import { SymbolView, SFSymbol } from 'expo-symbols';

import React from 'react';

type IconProps = { name: SFSymbol; children?: React.ReactNode };

export const Icon = ({ name, children }: IconProps) => {
  return (
    <Text style={styles.text}>
      <SymbolView name={name} style={styles.symbol} type="monochrome" />
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  symbol: {
    tintColor: PlatformColor('secondaryLabel'),
    width: 12,
    height: 12,
    marginRight: 2,
  },
  text: {
    color: PlatformColor('secondaryLabel'),
    fontSize: 15,
    lineHeight: 20,
  },
});
