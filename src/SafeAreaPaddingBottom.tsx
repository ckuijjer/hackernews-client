import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SafeAreaPaddingBottom = () => {
  const insets = useSafeAreaInsets();

  return <View style={{ paddingBottom: insets.bottom }} />;
};
