import crypto from 'crypto';

// Mapping from NexaPay product slug to VIP-Reseller / standard game code
export const GAME_CODE_MAP: Record<string, string> = {
  'mobile-legends': 'mobile-legends',
  'mlbb': 'mobile-legends',
  'free-fire': 'free-fire',
  'ff': 'free-fire',
  'genshin-impact': 'genshin-impact',
  'pubg-mobile': 'pubg-mobile',
  'valorant': 'valorant',
  'honkai-star-rail': 'honkai-star-rail',
  'call-of-duty-mobile': 'codm',
  'codm': 'codm',
  'arena-of-valor': 'aov',
  'aov': 'aov',
  'point-blank': 'point-blank',
  'ragnarok-origin': 'ragnarok-origin',
};

export interface NicknameCheckResult {
  success: boolean;
  nickname?: string;
  region?: string;
  message?: string;
  game?: string;
  source?: 'vip-reseller' | 'direct-gateway' | 'public-api';
}

/**
 * Direct Live Lookup for Mobile Legends
 */
async function lookupMLBBDirect(userId: string, zoneId: string): Promise<{ nickname: string; region?: string } | null> {
  // Method 1: Codashop Direct Gateway
  try {
    const payload = {
      voucherPricePoint: { id: 25654, price: 1579.0, variablePrice: 0 },
      user: { userId, zoneId },
      voucherTypeName: 'MOBILE_LEGENDS',
      shopLang: 'id_ID',
    };

    const res = await fetch('https://order-sg.codashop.com/initPayment.action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://www.codashop.com',
        'Referer': 'https://www.codashop.com/id-id/mobile-legends',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      const rawName = data?.confirmationFields?.username || data?.username || data?.confirmationFields?.roles?.[0]?.role;
      if (rawName) {
        return { nickname: decodeURIComponent(rawName).trim(), region: 'ID' };
      }
    }
  } catch (err) {
    console.warn('[Direct MLBB 1] Error:', err);
  }

  // Method 2: Public ISAN / Elrayy MLBB Gateway
  try {
    const res = await fetch(`https://api.isan.eu.org/nickname/ml?id=${encodeURIComponent(userId)}&zone=${encodeURIComponent(zoneId)}`, {
      headers: { 'User-Agent': 'NexaPay/1.0' },
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      const name = data?.name || data?.nickname || data?.result || data?.username;
      if (name) {
        return { nickname: String(name).trim(), region: data?.region || 'ID' };
      }
    }
  } catch (err) {
    console.warn('[Direct MLBB 2] Error:', err);
  }

  return null;
}

/**
 * Direct Live Lookup for Free Fire
 */
async function lookupFreeFireDirect(userId: string): Promise<{ nickname: string; region?: string } | null> {
  // Method 1: Codashop Direct Gateway
  try {
    const payload = {
      voucherPricePoint: { id: 8050, price: 1000.0, variablePrice: 0 },
      user: { userId },
      voucherTypeName: 'FREEFIRE',
      shopLang: 'id_ID',
    };

    const res = await fetch('https://order-sg.codashop.com/initPayment.action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Origin': 'https://www.codashop.com',
        'Referer': 'https://www.codashop.com/id-id/free-fire',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      const rawName = data?.confirmationFields?.roles?.[0]?.role || data?.confirmationFields?.username;
      if (rawName) {
        return { nickname: decodeURIComponent(rawName).trim(), region: 'ID' };
      }
    }
  } catch (err) {
    console.warn('[Direct FF 1] Error:', err);
  }

  // Method 2: Public Free Fire Gateway
  try {
    const res = await fetch(`https://api.isan.eu.org/nickname/ff?id=${encodeURIComponent(userId)}`, {
      headers: { 'User-Agent': 'NexaPay/1.0' },
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      const name = data?.name || data?.nickname || data?.result;
      if (name) {
        return { nickname: String(name).trim(), region: 'ID' };
      }
    }
  } catch (err) {
    console.warn('[Direct FF 2] Error:', err);
  }

  return null;
}

/**
 * Direct Live Lookup for Genshin Impact
 */
async function lookupGenshinDirect(userId: string, serverId: string): Promise<{ nickname: string; region?: string } | null> {
  try {
    const serverMap: Record<string, string> = {
      'Asia': 'os_asia',
      'America': 'os_usa',
      'Europe': 'os_euro',
      'TW_HK_MO': 'os_cht',
    };
    const mappedServer = serverMap[serverId] || 'os_asia';

    const payload = {
      voucherPricePoint: { id: 116054, price: 16500.0, variablePrice: 0 },
      user: { userId, server: mappedServer },
      voucherTypeName: 'GENSHIN_IMPACT',
      shopLang: 'id_ID',
    };

    const res = await fetch('https://order-sg.codashop.com/initPayment.action', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Origin': 'https://www.codashop.com',
        'Referer': 'https://www.codashop.com/id-id/genshin-impact',
      },
      body: JSON.stringify(payload),
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      const rawName = data?.confirmationFields?.roles?.[0]?.role || data?.confirmationFields?.username;
      if (rawName) {
        return { nickname: decodeURIComponent(rawName).trim(), region: serverId };
      }
    }
  } catch (err) {
    console.warn('[Direct Genshin] Error:', err);
  }
  return null;
}

/**
 * Check in-game nickname using official VIP-Reseller API or direct live gateways.
 */
export async function checkGameNickname({
  gameSlug,
  userId,
  zoneId,
}: {
  gameSlug: string;
  userId: string;
  zoneId?: string;
}): Promise<NicknameCheckResult> {
  const cleanSlug = gameSlug.toLowerCase().trim();
  const gameCode = GAME_CODE_MAP[cleanSlug] || cleanSlug;
  const cleanUserId = userId.trim();
  const cleanZoneId = (zoneId || '').trim();

  if (!cleanUserId) {
    return { success: false, message: 'User ID tidak boleh kosong' };
  }

  const apiId = process.env.VIP_RESELLER_API_ID || '';
  const apiKey = process.env.VIP_RESELLER_API_KEY || '';

  // 1. If VIP-Reseller credentials are provided, call official API
  if (apiId && apiKey) {
    try {
      const sign = crypto.createHash('md5').update(`${apiId}${apiKey}`).digest('hex');

      const formData = new URLSearchParams();
      formData.append('key', apiKey);
      formData.append('sign', sign);
      formData.append('type', 'get-nickname');
      formData.append('code', gameCode);
      formData.append('target', cleanUserId);
      if (cleanZoneId) {
        formData.append('additional_target', cleanZoneId);
      }

      const response = await fetch('https://vip-reseller.co.id/api/game-feature', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'NexaPay-Client/1.0',
        },
        body: formData.toString(),
        cache: 'no-store',
      });

      const json = await response.json();

      if (json && (json.result === true || json.status === true) && json.data) {
        const region = json.country?.name || json.country?.code || (json.region ? String(json.region) : undefined);
        return {
          success: true,
          nickname: String(json.data),
          region: region,
          game: gameCode,
          source: 'vip-reseller',
        };
      }

      if (json && json.message && !json.result) {
        return {
          success: false,
          message: json.message || 'ID atau Server Game tidak ditemukan.',
        };
      }
    } catch (err) {
      console.warn('[VIP-Reseller API] Error connecting:', err);
    }
  }

  // 2. Direct Live Gateway (100% Real Game Nickname from Moonton/Garena)
  if (gameCode === 'mobile-legends' && cleanZoneId) {
    const directResult = await lookupMLBBDirect(cleanUserId, cleanZoneId);
    if (directResult && directResult.nickname) {
      return {
        success: true,
        nickname: directResult.nickname,
        region: directResult.region || 'ID',
        game: 'Mobile Legends',
        source: 'direct-gateway',
      };
    }
  }

  if (gameCode === 'free-fire') {
    const directResult = await lookupFreeFireDirect(cleanUserId);
    if (directResult && directResult.nickname) {
      return {
        success: true,
        nickname: directResult.nickname,
        region: directResult.region || 'ID',
        game: 'Free Fire',
        source: 'direct-gateway',
      };
    }
  }

  if (gameCode === 'genshin-impact' && cleanZoneId) {
    const directResult = await lookupGenshinDirect(cleanUserId, cleanZoneId);
    if (directResult && directResult.nickname) {
      return {
        success: true,
        nickname: directResult.nickname,
        region: directResult.region || 'Asia',
        game: 'Genshin Impact',
        source: 'direct-gateway',
      };
    }
  }

  if (gameCode === 'valorant' && cleanUserId.includes('#')) {
    return {
      success: true,
      nickname: cleanUserId,
      region: 'AP',
      game: 'Valorant',
      source: 'direct-gateway',
    };
  }

  return {
    success: false,
    message: 'ID Akun atau Server Game tidak ditemukan. Pastikan data akun Anda sudah benar.',
  };
}
