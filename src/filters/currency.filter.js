export default function currencyFilter(value, currency = 'KZT') {
  return Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
  }).format(value);
}
