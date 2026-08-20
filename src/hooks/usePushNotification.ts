'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotification() {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check support and current subscription status on mount
  useEffect(() => {
    const checkSupportAndSubscription = async () => {
      if (
        typeof window === 'undefined' ||
        !('serviceWorker' in navigator) ||
        !('PushManager' in window) ||
        !('Notification' in window)
      ) {
        setIsSupported(false);
        setIsLoading(false);
        return;
      }

      setIsSupported(true);
      setPermission(Notification.permission);

      try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      } catch (err) {
        console.error('Error checking push subscription:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkSupportAndSubscription();
  }, []);

  const subscribe = useCallback(async () => {
    if (!isSupported) {
      toast.error('Browser ini tidak mendukung Web Push Notification.');
      return false;
    }

    setIsLoading(true);
    try {
      // 1. Request browser notification permission
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm !== 'granted') {
        toast.warning('Izin notifikasi ditolak atau dibatalkan.');
        setIsLoading(false);
        return false;
      }

      // 2. Fetch VAPID public key
      const keyRes = await fetch('/api/push/vapid-key');
      const keyData = await keyRes.json();

      if (!keyData.publicKey) {
        throw new Error('VAPID public key tidak tersedia');
      }

      // 3. Register service worker if needed & subscribe to pushManager
      const registration = await navigator.serviceWorker.ready;
      const applicationServerKey = urlBase64ToUint8Array(keyData.publicKey);

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      // 4. Save subscription to backend database
      const subJson = subscription.toJSON();
      const saveRes = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: subJson.keys,
        }),
      });

      if (!saveRes.ok) {
        throw new Error('Gagal menyimpan langganan notifikasi ke server');
      }

      setIsSubscribed(true);
      toast.success('Notifikasi Web Push Berhasil Diaktifkan! 🔔', {
        description: 'Anda akan menerima update otomatis saat transaksi berhasil.',
      });

      return true;
    } catch (err: any) {
      console.error('Failed to subscribe to push notifications:', err);
      toast.error('Gagal mengaktifkan notifikasi: ' + (err.message || 'Error'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    if (!isSupported) return false;

    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        const endpoint = subscription.endpoint;
        await subscription.unsubscribe();

        // Remove from database
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint }),
        });
      }

      setIsSubscribed(false);
      toast.info('Notifikasi Web Push Dimatikan.');
      return true;
    } catch (err: any) {
      console.error('Failed to unsubscribe from push notifications:', err);
      toast.error('Gagal mematikan notifikasi: ' + (err.message || 'Error'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const sendTestNotification = useCallback(async () => {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      const res = await fetch('/api/push/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Notifikasi tes berhasil dikirim! Periksa layar Anda. 🚀');
      } else {
        toast.warning(data.message || 'Gagal mengirim notifikasi tes.');
      }
    } catch (err: any) {
      toast.error('Gagal mengirim notifikasi tes: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isSupported,
    permission,
    isSubscribed,
    isLoading,
    subscribe,
    unsubscribe,
    sendTestNotification,
  };
}
