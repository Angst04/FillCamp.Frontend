// API утилиты для взаимодействия с бэкендом

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

// Универсальная функция для API запросов
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        error: data.message || 'Произошла ошибка',
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      error: 'Ошибка сети',
      status: 500,
    };
  }
}

// Получение профиля пользователя
export async function getUserProfile(telegramId: number) {
  return fetchAPI(`/users/${telegramId}`);
}

// Обновление профиля
export async function updateUserProfile(telegramId: number, data: any) {
  return fetchAPI(`/users/${telegramId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// Получение новостей
export async function getNews(limit = 10, offset = 0) {
  return fetchAPI(`/news?limit=${limit}&offset=${offset}`);
}

// Получение товаров магазина
export async function getProducts() {
  return fetchAPI('/products');
}

// Создание заказа
export async function createOrder(telegramId: number, items: any[]) {
  return fetchAPI('/orders', {
    method: 'POST',
    body: JSON.stringify({
      telegram_id: telegramId,
      items,
    }),
  });
}

// Получение рефералов
export async function getReferrals(telegramId: number) {
  return fetchAPI(`/users/${telegramId}/referrals`);
}

// Получение статистики игры
export async function getGameStats(telegramId: number) {
  return fetchAPI(`/game/${telegramId}/stats`);
}

// Сохранение прогресса игры
export async function saveGameProgress(
  telegramId: number,
  coins: number,
  energy: number
) {
  return fetchAPI(`/game/${telegramId}/progress`, {
    method: 'POST',
    body: JSON.stringify({ coins, energy }),
  });
}

export default {
  getUserProfile,
  updateUserProfile,
  getNews,
  getProducts,
  createOrder,
  getReferrals,
  getGameStats,
  saveGameProgress,
};

