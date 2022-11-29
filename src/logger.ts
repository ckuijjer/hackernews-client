import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

console.warn = () => {};
console.error = () => {};
