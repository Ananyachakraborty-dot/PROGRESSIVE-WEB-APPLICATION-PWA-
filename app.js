if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => {
      console.log('Service Worker registered', reg);
    })
    .catch(err => console.error('Service Worker registration failed:', err));
}
// STEP 7: Request notification permission
Notification.requestPermission().then(permission => {
  if (permission === "granted") {
    console.log("Notifications allowed");
  } else {
    console.warn("Notification permission denied");
  }
});

// STEP 7: Subscribe to Push Notifications
navigator.serviceWorker.ready.then(registration => {
  registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array('<YOUR_VAPID_PUBLIC_KEY>')
  }).then(subscription => {
    console.log('Push subscription:', JSON.stringify(subscription));
    // Here you'd send the subscription to your backend
  }).catch(error => {
    console.error('Subscription failed:', error);
  });
});

// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}