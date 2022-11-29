import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();

console.log = () => {};
console.warn = () => {};
console.error = () => {};
