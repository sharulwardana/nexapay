declare module 'web-push' {
  export interface PushSubscription {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  }

  export interface SendResult {
    statusCode: number;
    body: string;
    headers: Record<string, string>;
  }

  export interface VapidKeys {
    publicKey: string;
    privateKey: string;
  }

  export interface RequestOptions {
    headers?: Record<string, string>;
    gcmAPIKey?: string;
    vapidDetails?: {
      subject: string;
      publicKey: string;
      privateKey: string;
    };
    TTL?: number;
    contentEncoding?: string;
    urgency?: 'very-low' | 'low' | 'normal' | 'high';
    topic?: string;
    proxy?: string;
  }

  export function setVapidDetails(
    subject: string,
    publicKey: string,
    privateKey: string
  ): void;

  export function setGCMAPIKey(apiKey: string | null): void;

  export function generateVAPIDKeys(): VapidKeys;

  export function sendNotification(
    customPushSubscription: PushSubscription | { endpoint: string; keys?: { p256dh?: string; auth?: string } },
    payload?: string | Buffer | null,
    options?: RequestOptions
  ): Promise<SendResult>;

  export interface WebPushError extends Error {
    statusCode: number;
    headers: Record<string, string>;
    body: string;
    endpoint: string;
  }

  const webpush: {
    setVapidDetails: typeof setVapidDetails;
    setGCMAPIKey: typeof setGCMAPIKey;
    generateVAPIDKeys: typeof generateVAPIDKeys;
    sendNotification: typeof sendNotification;
  };

  export default webpush;
}
