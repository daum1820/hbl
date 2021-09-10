import { useLocation } from "react-router-dom";

export const baseURL = process.env.REACT_APP_BASE_URL;
export const env = process.env.NODE_ENV;

export function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function formatCurrency(amount, isDebit = false) {
  amount *= isDebit ? -1 : 1;
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount);
}

export function formatDate(date) {
  if (typeof date === 'string' ) {
    date = new Date(date);
  }
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day.toString().padStart(2, '0')}/${ month.toString().padStart(2, '0')}/${year}`;
}

export function formatPrice(value = '') {
  return parseFloat(`${value}`.replace('R$ ', '').replace('.', '').replace(',', '.'))
}

export function formatInt(value = '') {
  return parseInt(`${value}`.replace('.', ''))
}