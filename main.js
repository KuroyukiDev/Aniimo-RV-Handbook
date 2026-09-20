if ('serviceWorker' in navigator) {
const registerServiceWorker = () => {
    navigator.serviceWorker.register('/Aniimo-RV-Handbook/sw.js', { scope: '/Aniimo-RV-Handbook/' })
    .then((reg) => {
        console.log('[PWA] Service Worker active with scope:', reg.scope);
    })
    .catch((err) => {
        console.error('[PWA] Service Worker registration failed:', err);
    });
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', registerServiceWorker);
} else {
    registerServiceWorker();
}
}

let pwaDeferredPrompt = null;
window.addEventListener('beforeinstallprompt', (event) => {
console.log('[PWA] beforeinstallprompt fired! Application is installable.');
pwaDeferredPrompt = event;
});
