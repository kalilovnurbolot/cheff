// ─────────────────────────────────────────────────────────────────────────────
// Google OAuth Client ID
//
// Как получить:
//   1. Открой https://console.cloud.google.com/
//   2. Создай проект (или выбери существующий)
//   3. APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID
//   4. Тип приложения: "Web application"
//   5. Authorized JavaScript origins: http://localhost:5173 и твой прод-домен
//   6. Скопируй "Client ID" и вставь ниже
// ─────────────────────────────────────────────────────────────────────────────

export const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID_HERE'
