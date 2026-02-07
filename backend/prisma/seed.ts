import prismaClient from '../src/prisma';
import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcrypt';
import { productsData } from '../src/data/seedData';

const prisma = prismaClient as unknown as PrismaClient;

async function main() {
  const password = 'Haslo12345.';
  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. SEED UŻYTKOWNIKÓW
  const users = [
    { name: 'Admin', email: 'admin@gmail.com', role: 'ADMIN' as const },
    { name: 'Kacper', email: 'kacper@gmail.com', role: 'USER' as const },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: { ...user, password: hashedPassword },
    });
  }
  console.log('Users seeded!');

  // 2. SEED KATEGORII
  const categories = Array.from(new Set(productsData.map((p) => p.category))); // wyciągamy unikalne kategorie
  const createdCategories: Record<string, number> = {};

  for (const cat of categories) {
    const category = await prisma.category.upsert({
      where: { slug: cat.toLowerCase() },
      update: {},
      create: { name: cat, slug: cat.toLowerCase() },
    });
    createdCategories[cat] = category.id;
  }
  console.log('Categories seeded!');

  // 3. SEED PRODUKTÓW
  for (const p of productsData) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        price: p.price,
        stock: p.stock,
        categoryId: createdCategories[p.category],
        description: `Świetny produkt z kategorii ${p.category}`,
        imageUrl: p.imageUrl,
      },
    });
  }
  console.log('Products seeded!');

  // 4. SEED PRZYKŁADOWYCH ZAMÓWIEŃ
  const kacper = await prisma.user.findUnique({
    where: { email: 'kacper@gmail.com' },
  });

  if (kacper) {
    const products = await prisma.product.findMany({ take: 3 });

    for (let i = 0; i < 5; i++) {
      const product = products[i % products.length];
      const quantity = Math.floor(Math.random() * 3) + 1;

      await prisma.order.create({
        data: {
          userId: kacper.id,
          totalAmount: product.price * quantity,
          status: ['PAID', 'SHIPPED', 'COMPLETED'][i % 3] as any,
          items: {
            create: {
              productId: product.id,
              quantity,
              price: product.price,
            },
          },
        },
      });
    }
    console.log('Orders seeded!');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
