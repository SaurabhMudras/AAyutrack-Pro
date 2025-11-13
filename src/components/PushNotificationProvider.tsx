"use client";

import { useEffect } from 'react';
import { useFirebase } from '@/firebase/provider';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { useToast } from '@/hooks/use-toast';
import { addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';

export default function PushNotificationProvider({ children }: { children: React.ReactNode }) {
  const { firebaseApp, user, firestore } = useFirebase();
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker registration successful, scope is:', registration.scope);
        })
        .catch((err) => {
          console.error('Service Worker registration failed:', err);
        });
    }
  }, []);

  useEffect(() => {
    if (!firebaseApp || !user || !firestore) return;

    const messaging = getMessaging(firebaseApp);

    // Request permission and get token
    async function requestPermission() {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('Notification permission granted.');

          const currentToken = await getToken(messaging, {
            vapidKey: 'YOUR_VAPID_KEY', // Replace with your VAPID key from Firebase Console
          });

          if (currentToken) {
            console.log('FCM Token:', currentToken);
            // Save the token to Firestore
            const tokensCollection = collection(firestore, 'users', user.uid, 'fcmTokens');
            addDocumentNonBlocking(tokensCollection, { token: currentToken, createdAt: new Date() });
            
          } else {
            console.log('No registration token available. Request permission to generate one.');
          }
        } else {
          console.log('Unable to get permission to notify.');
        }
      } catch (err) {
        console.error('An error occurred while retrieving token. ', err);
      }
    }

    requestPermission();

    // Handle incoming messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      toast({
        title: payload.notification?.title,
        description: payload.notification?.body,
      });
    });

    return () => {
      unsubscribe();
    };
  }, [firebaseApp, user, firestore, toast]);

  return <>{children}</>;
}

    