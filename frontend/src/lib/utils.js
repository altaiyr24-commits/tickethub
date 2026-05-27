import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, isPast } from 'date-fns';
import { ru } from 'date-fns/locale';

export const cn = (...inputs) => twMerge(clsx(inputs));

export const formatPrice = (price) => {
  const num = parseFloat(price);
  if (isNaN(num)) return '—';
  return new Intl.NumberFormat('ru-KZ', { style: 'currency', currency: 'KZT', maximumFractionDigits: 0 }).format(num);
};

const safeDate = (date) => {
  if (!date) return null;
  const d = new Date(date);
  return isNaN(d.getTime()) ? null : d;
};

export const formatDate = (date, fmt = 'd MMMM yyyy') => {
  const d = safeDate(date);
  if (!d) return 'Дата уточняется';
  return format(d, fmt, { locale: ru });
};

export const formatDateTime = (date) => {
  const d = safeDate(date);
  if (!d) return 'Дата уточняется';
  return format(d, 'd MMMM yyyy, HH:mm', { locale: ru });
};

export const timeUntil = (date) => {
  const d = safeDate(date);
  if (!d) return '';
  return formatDistanceToNow(d, { locale: ru, addSuffix: true });
};

export const isEventPast = (date) => {
  const d = safeDate(date);
  if (!d) return false;
  return isPast(d);
};

export const getEventStatusColor = (status) => ({
  PUBLISHED: 'text-green-400 bg-green-400/10',
  DRAFT:     'text-yellow-400 bg-yellow-400/10',
  CANCELLED: 'text-red-400 bg-red-400/10',
  COMPLETED: 'text-gray-400 bg-gray-400/10',
}[status] || 'text-gray-400 bg-gray-400/10');

export const getSeatColor = (status, type) => {
  if (status === 'SOLD')      return '#374151';
  if (status === 'RESERVED')  return '#F59E0B';
  if (type === 'VIP')         return '#8B5CF6';
  if (type === 'PREMIUM')     return '#EC4899';
  return '#10B981';
};

export const truncate = (str, n) => str?.length > n ? str.slice(0, n) + '...' : str;
