/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Отключаем строгий режим React
    productionBrowserSourceMaps: true, // Включаем Source Maps для продакшена
    images: {
        remotePatterns: [
            {
              protocol: 'https', // Протокол (обычно https)
              hostname: 'raw.githubusercontent.com', // Домен, с которого разрешена загрузка
              // pathname: '/path/to/images/', // (Необязательно) Путь к папке с изображениями на домене
              // search: '?query=...', // (Необязательно) Строка запроса для фильтрации
            },
          ],
    },
};

export default nextConfig;
