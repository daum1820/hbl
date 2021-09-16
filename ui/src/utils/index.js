import { useLocation } from "react-router-dom";

import momentTz from 'moment-timezone';
momentTz.tz.setDefault(process.env.REACT_APP_TZ);

export const baseURL = process.env.REACT_APP_BASE_URL;
export const appName = process.env.REACT_APP_NAME;
export const appVersion = process.env.REACT_APP_VERSION;
export const env = process.env.NODE_ENV;
export const moment = momentTz;

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function formatCurrency(amount, isDebit = false) {
  amount *= isDebit ? -1 : 1;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
}

export function formatFullDate(date) {
  return `${formatDate(date)} - ${formatHour(date)}`;
}

export function formatDate(date) {
  if (typeof date === 'string' ) {
    date = new Date(date);
  }
  return moment(date.getTime()).format('DD/MM/YYYY');
}

export function formatHour(date) {
  if (typeof date === 'string' ) {
    date = new Date(date);
  }
  return moment(date.getTime()).format('hh:mm');
}

export function formatPrice(value = '') {
  return parseFloat(`${value}`.replace('R$ ', '').replace('R$ ', '').replace('.', '').replace(',', '.'))
}

export function formatInt(value = '') {
  return parseInt(`${value}`.replace('.', ''))
}