/\*_ @type {import('next').NextConfig} _/
const nextConfig = {
output: 'export',
basePath: process.env.NODE_ENV === 'production' ? '/Attractions_Viewer' : '',
assetPrefix: './',
};

export default nextConfig;
