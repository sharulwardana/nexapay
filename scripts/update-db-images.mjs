import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const imageMapping = {
  'mobile-legends': '/images/games/mobile-legends.webp',
  'free-fire': '/images/games/free-fire.webp',
  'free-fire-max': '/images/games/free-fire-max.webp',
  'pubg-mobile': '/images/games/pubg-mobile.webp',
  'honkai-star-rail': '/images/games/honkai-star-rail.webp',
  'call-of-duty-mobile': '/images/games/cod-mobile.webp',
  'roblox': '/images/games/roblox.webp',
  'arena-of-valor': '/images/games/aov.webp',
  'wild-rift': '/images/games/wild-rift.webp',
  'zenless-zone-zero': '/images/games/zzz.webp',
  'genshin-impact': '/images/games/genshin-impact.webp',
};

async function main() {
  console.log('Updating DB Product images to local HD webp files...');
  for (const [slug, imagePath] of Object.entries(imageMapping)) {
    const updated = await prisma.product.updateMany({
      where: { slug },
      data: {
        image: imagePath,
        bannerImage: imagePath,
      },
    });
    console.log(`Updated ${slug}: ${updated.count} row(s) => ${imagePath}`);
  }
  console.log('Done updating DB product images!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
