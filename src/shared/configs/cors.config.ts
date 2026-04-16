export const getCorsConfig = () => ({
  // Не блокирует запросы с фронтенда на бэкенд если они на разных доменах
  origin: [process.env.CLIENT_URL], // разрешаем только наш фронт

  // HttpOnly кука с refresh_token будет автоматически прилетать с каждым запросом с фронта
  credentials: true, //  Без этого браузер не отправляет куки в cross-origin запросах

  exposedHeaders: 'set-cookie', // Без этого фронтенд не увидит что кука была установлена
})
