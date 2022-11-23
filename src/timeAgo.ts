import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

TimeAgo.setDefaultLocale(en.locale);
TimeAgo.addLocale(en);

const t = new TimeAgo('en-US');

export const timeAgo = (date: Date) => t.format(date, 'mini');
