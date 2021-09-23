import moment from 'moment-timezone';

moment.tz.setDefault('Brazil/East');

export function hr(doc, y, start = 50, end = 565) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(start, y)
    .lineTo(end, y)
    .stroke();
}

export function vr(doc, x, y, size = 20) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(x, y)
    .lineTo(x, y + size)
    .stroke();
}

export function formatCurrency(amount: number, isDebit: boolean = false) {
  amount *= isDebit ? -1 : 1;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
}

export function formatInt(amount: number) {
  return (new Intl.NumberFormat('pt-BR').format(amount)).split(',').join('.');
}

export function formatFullDate(date: Date) {
    return `${formatDate(date)} - ${formatHour(date)}`;
}

export function formatDate(date: Date) {
  return moment(date.getTime()).format('DD/MM/YYYY');
}

export function formatHour(date: Date) {
  return moment(date.getTime()).format('HH:mm');
}
