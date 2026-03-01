importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyAIDrPI47ZGtGUoeFqf_yrd8TfWCQCtlUQ",
    authDomain: "documents-workspace.firebaseapp.com",
    projectId: "documents-workspace",
    storageBucket: "documents-workspace.firebasestorage.app",
    messagingSenderId: "734074645124",
    appId: "1:734074645124:web:1ad5cfe9e22a4e36c9f0d1"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/firebase-logo.png' // Add an icon path here
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
