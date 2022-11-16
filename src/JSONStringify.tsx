import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: '#fbfbfb',
  },
});

export const JSONStringify = ({ children }) => {
  return (
    <View style={styles.container}>
      <Text>{JSON.stringify(children, null, 2)}</Text>
    </View>
  );
};
