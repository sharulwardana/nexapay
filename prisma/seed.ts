import { PrismaClient } from '@prisma/client';
import { digitalProducts } from '../src/data/products';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding database...');


  for (const prod of digitalProducts) {
    const product = await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: {
        name: prod.name,
        slug: prod.slug,
        category: prod.category,
        subcategory: prod.subcategory,
        description: prod.description,
        image: prod.image || '',
        bannerImage: prod.bannerImage,
        publisher: prod.publisher,
        isActive: prod.isActive,
        isFeatured: prod.isFeatured,
        isPopular: prod.isPopular,
      }
    });

    for (const denom of prod.denominations) {
      await prisma.denomination.upsert({
        where: { id: denom.id },
        update: {},
        create: {
          id: denom.id,
          productId: product.id,
          label: denom.label,
          value: denom.value,
          price: denom.price,
          originalPrice: denom.originalPrice,
          discount: denom.discount,
          stock: denom.stock,
          isActive: denom.isActive,
          isPopular: denom.isPopular,
          isFlashSale: denom.isFlashSale,
          flashSalePrice: denom.flashSalePrice,
        }
      });
    }
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
