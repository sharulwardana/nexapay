import webpush from 'web-push';
import prisma from '@/lib/prisma';

const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || '';
const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:support@nexapay.com';

if (vapidPublicKey && vapidPrivateKey) {
  try {
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);
  } catch (err) {
    console.error('[WebPush] Error configuring VAPID details:', err);
  }
}

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  image?: string;
  url?: string;
  tag?: string;
}

export interface DirectPushSubscription {
  endpoint: string;
  keys?: {
    p256dh: string;
    auth: string;
  };
  p256dh?: string;
  auth?: string;
}

interface WebPushError extends Error {
  statusCode?: number;
}

/**
 * Send a web push notification to all active devices registered by a specific User ID.
 */
export async function sendPushToUser(userId: string, payload: PushNotificationPayload) {
  if (!userId || !vapidPublicKey || !vapidPrivateKey) return { success: false, sentCount: 0 };

  try {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId },
    });

    if (!subscriptions || subscriptions.length === 0) {
      return { success: true, sentCount: 0 };
    }

    const payloadString = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/favicon.ico',
      image: payload.image,
      url: payload.url || '/',
      tag: payload.tag || `user-notif-${Date.now()}`,
    });

    const sendPromises = subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      try {
        await webpush.sendNotification(pushSubscription, payloadString);
        return { id: sub.id, success: true };
      } catch (error: unknown) {
        const wpError = error as WebPushError;
        // If the subscription is expired or unregistered (HTTP 410 Gone / 404 Not Found), remove from DB
        if (wpError.statusCode === 410 || wpError.statusCode === 404) {
          console.log(`[WebPush] Removing expired push subscription: ${sub.id}`);
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        } else {
          console.error(`[WebPush] Error sending push to subscription ${sub.id}:`, wpError.message || wpError);
        }
        return { id: sub.id, success: false };
      }
    });

    const results = await Promise.all(sendPromises);
    const sentCount = results.filter((r) => r.success).length;

    return { success: true, sentCount };
  } catch (error) {
    console.error('[WebPush] General error in sendPushToUser:', error);
    return { success: false, sentCount: 0, error };
  }
}

/**
 * Broadcast a push notification to all active push subscriptions in the database.
 */
export async function broadcastPush(payload: PushNotificationPayload) {
  if (!vapidPublicKey || !vapidPrivateKey) return { success: false, sentCount: 0 };

  try {
    const subscriptions = await prisma.pushSubscription.findMany();

    if (!subscriptions || subscriptions.length === 0) {
      return { success: true, sentCount: 0 };
    }

    const payloadString = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon || '/favicon.ico',
      image: payload.image,
      url: payload.url || '/',
      tag: payload.tag || `broadcast-${Date.now()}`,
    });

    const sendPromises = subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      try {
        await webpush.sendNotification(pushSubscription, payloadString);
        return { id: sub.id, success: true };
      } catch (error: unknown) {
        const wpError = error as WebPushError;
        if (wpError.statusCode === 410 || wpError.statusCode === 404) {
          await prisma.pushSubscription.delete({ where: { id: sub.id } }).catch(() => {});
        }
        return { id: sub.id, success: false };
      }
    });

    const results = await Promise.all(sendPromises);
    const sentCount = results.filter((r) => r.success).length;

    return { success: true, sentCount };
  } catch (error) {
    console.error('[WebPush] Broadcast error:', error);
    return { success: false, sentCount: 0, error };
  }
}

/**
 * Send a direct push notification to an explicit subscription object.
 */
export async function sendDirectPush(subscription: DirectPushSubscription, payload: PushNotificationPayload) {
  if (!vapidPublicKey || !vapidPrivateKey) return { success: false, error: 'VAPID keys not configured' };

  const payloadString = JSON.stringify({
    title: payload.title,
    body: payload.body,
    icon: payload.icon || '/favicon.ico',
    image: payload.image,
    url: payload.url || '/',
    tag: payload.tag || `direct-${Date.now()}`,
  });

  const p256dh = subscription.keys?.p256dh || subscription.p256dh;
  const auth = subscription.keys?.auth || subscription.auth;

  if (!subscription.endpoint || !p256dh || !auth) {
    return { success: false, error: 'Invalid subscription object: missing endpoint or keys' };
  }

  const pushSub = {
    endpoint: subscription.endpoint,
    keys: {
      p256dh,
      auth,
    },
  };

  try {
    await webpush.sendNotification(pushSub, payloadString);
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown push error';
    console.error('[WebPush] Error in sendDirectPush:', message);
    return { success: false, error: message };
  }
}

