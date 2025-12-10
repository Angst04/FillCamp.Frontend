# API для фронтенда (актуальное состояние)

## Коротко о проекте

Бэкенд Telegram Mini App лагеря: пользователи, баланс бонусов, игра-кликер, магазин с правилами лояльности, рефералка, новости, интеграция с AmoCRM и Telegram-бот.

## Аутентификация

- Заголовок обязателен: `X-Telegram-Id: <tg_user_id>`
- Дополнительно (опционально, только на первом заходе нового пользователя): `X-Referral-Code: <код>` — если код валиден, пользователь создаётся как `child` и привязывается к пригласившему; иначе создаётся как `parent`.
- При отсутствии пользователя он создаётся автоматически, фиксируется последнее взаимодействие.

## Подключённые роутеры

- `/health`
- `/api/user`
- `/api/game` (HTTP + WebSocket)
- `/api/shop`
- `/api/profile`
- `/api/referrals`
- `/api/news`
- `/api/v1/amocrm`
- Есть файл `referral_router.py` (`/api/referral/generate`), но он **не подключён в main.py** — эндпоинт недоступен до подключения роутера.

## Эндпоинты и ответы

### Health

- `GET /health` → `{ "status": "healthy" }`

### User

- `POST /api/user`
  - Тело: `telegram_id`, `first_name`, `last_name`, `username`, `phone_number`
  - Ответ: `phone_number`

### Profile

- `GET /api/profile/me`
  - Headers: `X-Telegram-Id`
  - Ответ: `id`, `tg_id`, `full_name`, `username`, `avatar_url`, `role` (`child|parent`), `linked_parent_tg_id`, `linked_child_tg_id`, `bonus_balance`

### Game (кликер)

- `POST /api/game/click`
  - Только `role=child`
  - Ответ: `{ "new_bonus_balance": int, "current_energy": int }`
- `WS /api/game/ws`
  - Headers: `X-Telegram-Id` (в заголовке WebSocket)
  - Запрос: `{"type":"click"}`
  - Ответ: `{"event":"click","new_bonus_balance":int, "current_energy": int}`

### Shop

- `POST /api/shop/orders`
  - Ограничение: сейчас только **1 товар** в заказе
  - Тело: `{ items:[{item,quantity}], pay_with_bonus:boolean,  price: number, bonuses: number}`
  - Лояльность: списание/начисление бонусов по категории товара
  - Способы оплаты: `bonus_only | card_only | mixed`
  - Ответ: `id`, `items`, `total_bonus`, `total_money`, `status`
  - При ошибке баланса: `400 Not enough bonus balance`

### Referrals (просмотр)

- `GET /api/referrals/me`
  - Headers: `X-Telegram-Id`
  - Ответ: `referral_link`, `invited_count`, `bonus_earned`, `invited_users[{full_name,tg_id, date}]`
  - Примечание: `referral_link` использует заглушку `your_bot_username` — заменить на реальный username бота.

### Referral (генерация кода)

- Файл `api/routes/referral_router.py` предоставляет `POST /api/referral/generate` (генерация кода и ссылки вида `https://t.me/<bot>/app?ref=<code>`), но роутер не смонтирован в `main.py`. Подключить, если нужно фронту.

### AmoCRM (`/api/v1/amocrm`)

- `GET /oauth/start` — ссылка на авторизацию
- `GET /oauth/callback?code=...` — обмен кода на токены
- `POST /webhooks/transaction` — приём webhook транзакций (фоновая обработка)
- `POST /orders/{order_id}/send` — отправка заказа в AmoCRM
- Тест: `POST /test-order/send`, `POST /test-flow/user-6/full`

## Бизнес-логика / данные

- Роли: `parent`, `child`, `admin`
- Баланс/транзакции: типы `game_click`, `referral`, `shop_purchase`, `admin_adjust`, `amocrm_bonus`, `other`
- Лояльность (категории → списание/начисление): в `loyalty_service.py`
  - Смены: `camp_china`, `camp_sochi`, `camp_moscow_city`, `camp_izumrud`, `camp_rozendorf`, `camp_turkey`
  - Услуги: `merch`, `lessons`, `photosession`, `transfer` (можно списать 100%, начисление 0)
- Игра: 1 бонус за клик, хранится прогресс (total, today)
- Рефералы: у пользователя есть `referral_code`; можно передать `X-Referral-Code` при первом запросе

## Ошибки (формат)

`{ "detail": "..." }`

- 400 — неверный запрос/правила лояльности/недостаточно бонусов
- 401 — нет `X-Telegram-Id`
- 403 — роль не подходит (например, игра не для `parent`)
- 404 — не найдено
- 500 — внутренняя ошибка

## Что передать фронтенду

- Заголовок `X-Telegram-Id` обязателен для всех защищённых ручек.
- При первичной установке по реферальной ссылке можно добавить `X-Referral-Code` — чтобы сразу привязать ребёнка к пригласившему.
- Игра доступна только детям, WebSocket требует тот же заголовок.
- Магазин: пока только один товар за заказ; оплата бонусами/картой/смешанная; бонусные правила зависят от `category`.
- Реферальная ссылка в ответах пока с заглушкой `your_bot_username` — фронту нужен реальный username бота.
- Эндпоинт генерации рефкода есть в коде, но роутер не подключён — если нужен в фронте, смонтировать в `main.py`.

## Примеры запросов

```http
GET /api/profile/me
X-Telegram-Id: 123456789
```

```http
POST /api/shop/orders
X-Telegram-Id: 123456789
Content-Type: application/json

{
  "items": [{ "item_id": 1, "quantity": 1 }],
  "pay_with_bonus": true
}
```

WebSocket:

```
wss://<host>/api/game/ws
Header: X-Telegram-Id: 123456789
Send: {"type":"click"}
Recv: {"event":"click","new_bonus_balance":..., "game_progress":...}
```
