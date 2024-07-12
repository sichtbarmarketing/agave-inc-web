// Here is the code snippet to initialize Firebase Messaging in the Service
// Worker when your app is not hosted on Firebase Hosting.

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyCE4s7VCLhpGsm3xzSqN80dyvGPg_PuxOI",
    authDomain: "agave-communications.firebaseapp.com",
    databaseURL: "https://agave-communications-default-rtdb.firebaseio.com",
    projectId: "agave-communications",
    storageBucket: "agave-communications.appspot.com",
    messagingSenderId: "631706160854",
    appId: "1:631706160854:web:65d0d4dc181b0c127f8377",
    measurementId: "G-16700MM36E"
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

/*
    If you would like to customize notifications that are received in the
    background (Web app is closed or not in browser focus) then you should
    implement this optional method.
    Keep in mind that FCM will still show notification messages automatically
    and you should use data messages for custom notifications.
    For more info see: https://firebase.google.com/docs/cloud-messaging/concept-options
*/
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = payload.data?.title ?? 'Agave Community';
    const notificationOptions = {
        body: payload.data?.body ?? 'You have a new notification.',
        icon: payload.data?.image ?? '/splash_screens/icon.png'
    };

    /* FIXME: Notification will only be shown if payload contains a data object with a title property
     * This was done so as to prevent FCM from showing duplicate notifications
     * https://stackoverflow.com/questions/66697332/firebase-web-push-notifications-is-triggered-twice-when-using-onbackgroundmessag
     */
    if (payload.data && payload.data?.title) self.registration.showNotification(notificationTitle, notificationOptions);
});