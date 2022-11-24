import { View, Text, StyleSheet, PlatformColor } from 'react-native';

export const Loading = ({ style = null }) => (
  <View style={[styles.container, style]}>
    <Text style={styles.text}>Checking for Updates...</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: PlatformColor('secondarySystemBackground'),
    paddingTop: 2 * 44,
  },
  text: {
    fontSize: 15,
    color: PlatformColor('secondaryLabel'),
  },
});
