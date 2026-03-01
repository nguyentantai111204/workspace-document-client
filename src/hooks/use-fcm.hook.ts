import { getToken, onMessage } from 'firebase/messaging';
import { messaging, VAPID_KEY } from '../common/config/firebase.config';
import { useCallback } from 'react';
import { useAppSelector } from '../redux/store.redux';
import { registerDeviceApi } from '../apis/notification/notification.api';
import { v4 as uuidv4 } from 'uuid';

export const useFcm = () => {
    const { isAuthenticated } = useAppSelector(state => state.account);

    const getOrGenerateDeviceId = useCallback(() => {
        let deviceId = localStorage.getItem('deviceId');
        if (!deviceId) {
            deviceId = uuidv4();
            localStorage.setItem('deviceId', deviceId);
        }
        return deviceId;
    }, []);

    const requestPermission = useCallback(async () => {
        if (!isAuthenticated) return null;

        try {
            if (!VAPID_KEY) {
                console.warn('VAPID_KEY is missing. Skip FCM registration.');
                return null;
            }

            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                console.log('Notification permission granted.');

                const token = await getToken(messaging, {
                    vapidKey: VAPID_KEY
                });

                if (token) {
                    console.log('FCM Token:', token);

                    const deviceId = getOrGenerateDeviceId();
                    await registerDeviceApi({
                        token,
                        deviceId,
                        deviceType: 'web'
                    });

                    return token;
                } else {
                    console.warn('No registration token available. Request permission to generate one.');
                }
            } else {
                console.warn('Unable to get permission to notify.');
            }
        } catch (error) {
            console.error('An error occurred while retrieving token. ', error);
        }
        return null;
    }, [isAuthenticated, getOrGenerateDeviceId]);

    const setupOnMessage = useCallback(() => {
        onMessage(messaging, (payload) => {
            console.log('Message received. ', payload);
        });
    }, []);

    return { requestPermission, setupOnMessage };
};
