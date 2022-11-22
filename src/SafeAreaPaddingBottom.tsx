import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const SafeBottomView = () => {
  const insets = useSafeAreaInsets();

  return <View style={{ paddingBottom: insets.bottom }} />;
};
