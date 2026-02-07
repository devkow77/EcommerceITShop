import prismaClient from '../src/prisma';
import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcrypt';

const prisma = prismaClient as unknown as PrismaClient;

async function main() {
  const password = 'Haslo12345.';
  const hashedPassword = await bcrypt.hash(password, 10);

  // 1. SEEDOWANIE UŻYTKOWNIKÓW
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

  // 2. SEEDOWANIE KATEGORII
  // Tworzymy kategorie i zapisujemy je do mapy, żeby łatwo przypisać ID
  const categoriesData = [
    { name: 'Laptopy', slug: 'laptopy' },
    { name: 'Smartfony', slug: 'smartfony' },
    { name: 'Akcesoria', slug: 'akcesoria' },
  ];

  const createdCategories: Record<string, number> = {};

  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = category.id;
  }
  console.log('Categories seeded!');

  // 3. SEEDOWANIE PRODUKTÓW Z KATEGORIAMI
  const products = [
    // LAPTOPY
    {
      name: 'MacBook Air 13',
      slug: 'macbook-air-13',
      price: 549900,
      cat: 'laptopy',
    },
    {
      name: 'Lenovo Legion 5',
      slug: 'lenovo-legion-5',
      price: 480000,
      cat: 'laptopy',
    },
    { name: 'Dell XPS 15', slug: 'dell-xps-15', price: 899900, cat: 'laptopy' },
    {
      name: 'ASUS Zenbook',
      slug: 'asus-zenbook',
      price: 420000,
      cat: 'laptopy',
    },
    { name: 'HP Pavilion', slug: 'hp-pavilion', price: 310000, cat: 'laptopy' },
    {
      name: 'Acer Nitro 5',
      slug: 'acer-nitro-5',
      price: 390000,
      cat: 'laptopy',
    },
    {
      name: 'Microsoft Surface',
      slug: 'surface-pro',
      price: 520000,
      cat: 'laptopy',
    },

    // SMARTFONY
    { name: 'iPhone 15', slug: 'iphone-15', price: 420000, cat: 'smartfony' },
    {
      name: 'Samsung S23',
      slug: 'samsung-s23',
      price: 350000,
      cat: 'smartfony',
    },
    { name: 'Xiaomi 13T', slug: 'xiaomi-13t', price: 249900, cat: 'smartfony' },
    {
      name: 'Google Pixel 8',
      slug: 'pixel-8',
      price: 360000,
      cat: 'smartfony',
    },
    { name: 'OnePlus 12', slug: 'oneplus-12', price: 410000, cat: 'smartfony' },
    {
      name: 'Nothing Phone 2',
      slug: 'nothing-phone-2',
      price: 299900,
      cat: 'smartfony',
    },
    { name: 'Huawei P60', slug: 'huawei-p60', price: 380000, cat: 'smartfony' },

    // AKCESORIA
    {
      name: 'Logitech G502',
      slug: 'logitech-g502',
      price: 29900,
      cat: 'akcesoria',
    },
    {
      name: 'Sony WH-1000XM5',
      slug: 'sony-xm5',
      price: 159000,
      cat: 'akcesoria',
    },
    {
      name: 'Keychron K2',
      slug: 'keychron-k2',
      price: 45000,
      cat: 'akcesoria',
    },
    {
      name: 'Razer DeathAdder',
      slug: 'razer-deathadder',
      price: 25000,
      cat: 'akcesoria',
    },
    {
      name: 'Powerbank 20k',
      slug: 'powerbank-20k',
      price: 19900,
      cat: 'akcesoria',
    },
    {
      name: 'SteelSeries Arctis',
      slug: 'ss-arctis',
      price: 59900,
      cat: 'akcesoria',
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        price: p.price,
        description: `Świetny produkt z kategorii ${p.cat}`,
        stock: 50,
        categoryId: createdCategories[p.cat], // Tutaj łączymy produkt z kategorią
        imageUrl: '', // Twoja nowa tablica (domyślnie pusta)
      },
    });
  }

  console.log('Products seeded!');

  // 4. SEEDOWANIE PRZYKŁADOWYCH ZAMÓWIEŃ
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
