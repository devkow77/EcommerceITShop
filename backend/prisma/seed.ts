import prismaClient from '../src/prisma';
import { PrismaClient } from '../generated/prisma';
import bcrypt from 'bcrypt';
 
const prisma = prismaClient as unknown as PrismaClient;
 
async function main() {
  const password = 'Haslo12345.';
  const hashedPassword = await bcrypt.hash(password, 10);
 
  const users = [
    { name: 'Admin', email: 'admin@gmail.com', role: 'ADMIN' as const },
    { name: 'Kacper', email: 'kacper@gmail.com', role: 'USER' as const },
    { name: 'Anna', email: 'anna@gmail.com', role: 'USER' as const },
    { name: 'Jakub', email: 'jakub@gmail.com', role: 'USER' as const },
  ];
 
  console.log('Seeding users...');
  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email },
    });
 
    if (!existingUser) {
      await prisma.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
        },
      });
      console.log(`${user.role} ${user.email} created`);
    } else {
      console.log(`${user.role} ${user.email} already exists`);
    }
  }
 
  // // =========================
  // // PRODUCTS
  // // =========================
  const products = [
    { name: 'MacBook Air 13', slug: 'macbook-air-13', price: 549900 },
    { name: 'iPhone 15', slug: 'iphone-15', price: 420000 },
    { name: 'Logitech G502', slug: 'logitech-g502', price: 29900 },
    { name: 'Lenovo Legion 5', slug: 'lenovo-legion-5', price: 480000 },
    { name: 'Samsung S23', slug: 'samsung-s23', price: 350000 },
    { name: 'Sony WH-1000XM5', slug: 'sony-xm5', price: 159000 },
    { name: 'Dell XPS 15', slug: 'dell-xps-15', price: 899900 },
    { name: 'Xiaomi 13T', slug: 'xiaomi-13t', price: 249900 },
    { name: 'Keychron K2', slug: 'keychron-k2', price: 45000 },
    { name: 'ASUS Zenbook', slug: 'asus-zenbook', price: 420000 },
    { name: 'Google Pixel 8', slug: 'pixel-8', price: 360000 },
    { name: 'Razer DeathAdder', slug: 'razer-deathadder', price: 25000 },
    { name: 'HP Pavilion', slug: 'hp-pavilion', price: 310000 },
    { name: 'OnePlus 12', slug: 'oneplus-12', price: 410000 },
    { name: 'Powerbank 20k', slug: 'powerbank-20k', price: 19900 },
    { name: 'Acer Nitro 5', slug: 'acer-nitro-5', price: 390000 },
    { name: 'Nothing Phone 2', slug: 'nothing-phone-2', price: 299900 },
    { name: 'SteelSeries Arctis', slug: 'ss-arctis', price: 59900 },
    { name: 'Microsoft Surface', slug: 'surface-pro', price: 520000 },
    { name: 'Huawei P60', slug: 'huawei-p60', price: 380000 },
  ];
 
  console.log('Seeding products...');
  for (const product of products) {
    await prisma.product.create({
      data: {
        name: product.name,
        slug: product.slug,
        price: product.price,
        description: 'Opis produktu',
        stock: 50,
        isAvailable: true,
      },
    });
    console.log(`Product ${product.name} created`);
  }
 
  console.log('Seed finished successfully!');
}
 
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });