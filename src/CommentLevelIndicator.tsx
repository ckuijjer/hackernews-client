import React from 'react';
import { View, StyleSheet, PlatformColor } from 'react-native';

type CommentLevelIndicatorProps = {
  level: number;
};

export const CommentLevelIndicator = ({
  level,
}: CommentLevelIndicatorProps) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: level })
        .fill(0)
        .map((_, index) => {
          return <View key={index} style={styles.line} />;
        })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  line: {
    width: 8,
    borderLeftWidth: 2,
    borderLeftColor: PlatformColor('systemFill'),
  },
});
