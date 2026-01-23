# Repository Guidelines

## Project Structure & Module Organization
This is a Next.js (App Router) frontend. Key paths:
- `app/` routes, layouts, and server/client components.
- `components/` shared UI components.
- `hooks/` custom React hooks.
- `context/` React context providers.
- `lib/` utilities, API helpers, and shared logic.
- `types/` TypeScript types and interfaces.
- `public/` static assets.
- `sanity/` Sanity CMS configuration and helpers.
- `api/` local API helpers used by the frontend.

## Build, Test, and Development Commands
Use `pnpm` (lockfile: `pnpm-lock.yaml`).
- `pnpm dev` запускает локальный Next.js dev server.
- `pnpm build` собирает production build.
- `pnpm start` запускает production server после сборки.
- `pnpm lint` проверка ESLint.
- `pnpm format` форматирует код через Prettier.

## Coding Style & Naming Conventions
- TypeScript + React 19, Next.js 16.
- Форматирование: Prettier (`.prettierrc`). Не форматируйте вручную — используйте `pnpm format`.
- Линтинг: ESLint (`eslint.config.mjs`) + `eslint-config-next`.
- Стиль файлов: `PascalCase` для компонентов, `camelCase` для утилит и хуков.
- Tailwind CSS v4 используется через `tailwind.config.ts`.

## Testing Guidelines
В репозитории нет настроенных тестов или test runner. Новые тесты следует документировать в этом файле вместе с командой запуска (например, `pnpm test`) и соглашениями по именованию (`*.test.tsx`).

## Commit & Pull Request Guidelines
- В истории коммитов нет единого стандарта. Рекомендуется короткое, повелительное описание (например: `fix bonus parsing`, `add user bonus view`).
- Если есть задача/issue, добавляйте ссылку в описание PR и/или сообщение коммита.
- PR должен включать: краткое описание, список изменений, скриншоты UI-изменений (если применимо), и шаги проверки.

## Security & Configuration Tips
- Конфиги окружения храните в `.env` и не коммитьте секреты.
- При добавлении новых переменных среды обновляйте документацию здесь.
