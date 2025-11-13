// This file must be in the public directory

importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

// Initialize the Firebase app in the service worker by passing in the messagingSenderId.
// Replace with your Firebase project's config object.
const firebaseConfig = {
    apiKey: "AIzaSyA7vCZxVTMcNxBpkWSvewPtXD8iOwUeI3c",
    authDomain: "studio-9135722525-8ebdf.firebaseapp.com",
    projectId: "studio-9135722525-8ebdf",
    storageBucket: "studio-9135722525-8ebdf.appspot.com",
    messagingSenderId: "68833685865",
    appId: "1:68833685865:web:f027e8693c26f904678df8",
    measurementId: ""
};

firebase.initializeApp(firebaseConfig);

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/logo.png", // Make sure you have a logo.png in your public folder
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

    