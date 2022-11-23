import { View, Text, StyleSheet, PlatformColor } from 'react-native';

type HeaderProps = React.PropsWithChildren<{}>;

export const Header = ({ children }: HeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 12,
  },
  text: {
    fontSize: 34,
    fontWeight: 'bold',
    color: PlatformColor('label'),
  },
});
