import fs from 'fs';
import path from 'path';
import https from 'https';

const gameIcons = [
  {
    filename: 'mobile-legends.webp',
    urls: [
      'https://play-lh.googleusercontent.com/r0s-e2E6C-E5aRkX-tS5T2uK6vFz9z7nS8M_x9K0j1L2m3n4o5=w512-h512',
      'https://raw.githubusercontent.com/sharulwardana/nexapay/main/public/images/games/mobile-legends.webp'
    ]
  },
  {
    filename: 'genshin-impact.webp',
    urls: [
      'https://play-lh.googleusercontent.com/So12_5P42r3jW9h7O5V4Cg3V3lE-0E2zZ4Y8T5y=w512-h512',
      'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/Genshin_Impact_tile.png'
    ]
  },
  {
    filename: 'honkai-star-rail.webp',
    urls: [
      'https://cdn.unipin.com/images/icon_product_pages/1710829444-icon-Oversea%20Icon-1024_11zon.png'
    ]
  },
  {
    filename: 'free-fire.webp',
    urls: [
      'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/free_fire_tile.png'
    ]
  },
  {
    filename: 'roblox.webp',
    urls: [
      'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/roblox_tile.png'
    ]
  },
  {
    filename: 'aov.webp',
    urls: [
      'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/aov_tile.png'
    ]
  },
  {
    filename: 'cod-mobile.webp',
    urls: [
      'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/codm_tile.png'
    ]
  },
  {
    filename: 'zzz.webp',
    urls: [
      'https://cdn1.codashop.com/S/content/mobile/images/product-tiles/ZZZ_tile.png'
    ]
  }
];

// Let's test standard HD PlayStore icon URLs with fetch
const playStorePackageMap = {
  'mobile-legends.webp': 'com.mobile.legends',
  'genshin-impact.webp': 'com.miHoYo.GenshinImpact',
  'free-fire.webp': 'com.dts.freefireth',
  'free-fire-max.webp': 'com.dts.freefiremax',
  'pubg-mobile.webp': 'com.tencent.ig',
  'honkai-star-rail.webp': 'com.HoYoverse.hkrpgoversea',
  'cod-mobile.webp': 'com.garena.game.codm',
  'roblox.webp': 'com.roblox.client',
  'aov.webp': 'com.garena.game.kgid',
  'wild-rift.webp': 'com.riotgames.league.wildrift',
  'zzz.webp': 'com.HoYoverse.Nap'
};

const targetDir = path.join(process.cwd(), 'public', 'images', 'games');

async function fetchPlayStoreIcon(pkg) {
  try {
    const res = await fetch(`https://play.google.com/store/apps/details?id=${pkg}&hl=id`);
    if (!res.ok) return null;
    const html = await res.text();
    // Extract icon URL from PlayStore meta tag or img src
    const match = html.match(/https:\/\/play-lh\.googleusercontent\.com\/[a-zA-Z0-9_\-=]+/);
    if (match) {
      return `${match[0]}=w512-h512-rw`;
    }
  } catch (e) {
    // ignore
  }
  return null;
}

async function downloadUrlToFile(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(dest, buffer);
}

async function main() {
  console.log('Scraping 512x512 HD Official Icons directly from Google PlayStore...');
  for (const [filename, pkg] of Object.entries(playStorePackageMap)) {
    const dest = path.join(targetDir, filename);
    try {
      const iconUrl = await fetchPlayStoreIcon(pkg);
      if (iconUrl) {
        await downloadUrlToFile(iconUrl, dest);
        console.log(`[SUCCESS 512x512 HD] ${filename}`);
      } else {
        console.log(`[SKIPPED] ${filename} - PlayStore icon not found`);
      }
    } catch (err) {
      console.error(`[FAILED] ${filename}:`, err.message);
    }
  }
  console.log('Done downloading 512x512 HD PlayStore Icons!');
}

main();
