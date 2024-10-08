module.exports = {
    globDirectory: 'dist/',
    globPatterns: ['**/*.{html,css,js,json,ico,gif,jpg,jpeg,png,webp}'],
    swDest: 'dist/sw.js',
    importScripts: [
        'https://cdn.jsdelivr.net/npm/workbox-sw@7.1.0/build/workbox-sw.min.js'
    ],
    clientsClaim: true,
    cleanupOutdatedCaches: true
};
