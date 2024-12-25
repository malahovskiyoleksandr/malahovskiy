/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false, // Отключаем строгий режим React
    productionBrowserSourceMaps: true, // Включаем Source Maps для продакшена
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'i.imgur.com', // Разрешаем загрузку изображений с i.imgur.com
                pathname: '/**',        // Разрешаем все пути
            },
        ],
    },
};

export default nextConfig;
