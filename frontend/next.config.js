/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = {
    async rewrites() {
        return [
            {
                source: '/auth/:path*',
                destination: 'http://localhost:8080/auth/:path*',
            },
            {
                source: '/guest/:path*',
                destination: 'http://localhost:8080/guest/:path*',
            },
        ];
    },
};
