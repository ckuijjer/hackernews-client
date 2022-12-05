import { LogBox } from 'react-native';
import Constants from 'expo-constants';

const ignoreErrorAndWarningNotifications = () => {
  LogBox.ignoreAllLogs();

  // hide warning messages in the console
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
};

export const configureLogging = () => {
  if (Constants.expoConfig?.extra?.ignoreErrorAndWarningNotifications) {
    ignoreErrorAndWarningNotifications();
  }
};
