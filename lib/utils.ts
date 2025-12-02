import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Утилита для объединения классов Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Форматирование чисел
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ru-RU').format(num);
}

// Форматирование даты
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

// Форматирование короткой даты
export function formatShortDate(date: string | Date): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

// Проверка на мобильное устройство
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

// Задержка
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Генерация случайного ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Обрезка текста
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

// Валидация Telegram ID
export function isValidTelegramId(id: number): boolean {
  return id > 0 && Number.isInteger(id);
}

