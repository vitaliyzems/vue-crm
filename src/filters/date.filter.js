import store from '@/store';

export default function dateFilter(value, format = 'date') {
  const options = {};
  const locale = store.getters.info.locale || 'ru-RU';

  if (format.includes('date')) {
    options.year = 'numeric';
    options.month = 'long';
    options.day = '2-digit';
  }

  if (format.includes('time')) {
    options.hour = '2-digit';
    options.minute = '2-digit';
    options.second = '2-digit';
  }

  const result = Intl.DateTimeFormat(locale, options).format(new Date(value));

  return result;
}
