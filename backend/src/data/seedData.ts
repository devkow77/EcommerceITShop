export interface SeedProduct {
  name: string;
  slug: string;
  price: number;
  stock: number;
  category: string;
  imageUrl: string;
  categoryId?: number | string;
  description?: string;
}

export let productsData: SeedProduct[] = [
  // ---------------- TELEFONY ----------------
  {
    name: 'iPhone 15',
    slug: 'iphone-15',
    price: 4199,
    stock: 25,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'Samsung S23',
    slug: 'samsung-s23',
    price: 3599,
    stock: 18,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'Xiaomi 13T',
    slug: 'xiaomi-13t',
    price: 2499,
    stock: 32,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'Google Pixel 8',
    slug: 'pixel-8',
    price: 3650,
    stock: 20,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'OnePlus 12',
    slug: 'oneplus-12',
    price: 3999,
    stock: 15,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'Nothing Phone 2',
    slug: 'nothing-phone-2',
    price: 2999,
    stock: 28,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'Huawei P60',
    slug: 'huawei-p60',
    price: 3799,
    stock: 22,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    price: 4999,
    stock: 12,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'Samsung S23 Ultra',
    slug: 'samsung-s23-ultra',
    price: 5899,
    stock: 10,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'Xiaomi 13 Pro',
    slug: 'xiaomi-13-pro',
    price: 3299,
    stock: 17,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'Google Pixel 8 Pro',
    slug: 'pixel-8-pro',
    price: 4200,
    stock: 14,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'OnePlus 12 Pro',
    slug: 'oneplus-12-pro',
    price: 4499,
    stock: 16,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'Nothing Phone 2 Pro',
    slug: 'nothing-phone-2-pro',
    price: 3399,
    stock: 21,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'Huawei P60 Pro',
    slug: 'huawei-p60-pro',
    price: 4399,
    stock: 19,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'iPhone 15 Mini',
    slug: 'iphone-15-mini',
    price: 3799,
    stock: 23,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'Samsung S23 Mini',
    slug: 'samsung-s23-mini',
    price: 2999,
    stock: 25,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'Xiaomi 13T Lite',
    slug: 'xiaomi-13t-lite',
    price: 2199,
    stock: 30,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'Google Pixel 8 Lite',
    slug: 'pixel-8-lite',
    price: 3050,
    stock: 27,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'OnePlus 12 Lite',
    slug: 'oneplus-12-lite',
    price: 3599,
    stock: 22,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'Nothing Phone 2 Lite',
    slug: 'nothing-phone-2-lite',
    price: 2799,
    stock: 28,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'Huawei P60 Lite',
    slug: 'huawei-p60-lite',
    price: 3199,
    stock: 25,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'iPhone SE 3',
    slug: 'iphone-se-3',
    price: 2399,
    stock: 30,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'Samsung A54',
    slug: 'samsung-a54',
    price: 1999,
    stock: 35,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'Xiaomi Redmi Note 13',
    slug: 'xiaomi-redmi-note-13',
    price: 1499,
    stock: 40,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },
  {
    name: 'Google Pixel 7a',
    slug: 'pixel-7a',
    price: 2299,
    stock: 28,
    category: 'Telefony',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770653651/jagmf9sf5x0acjavf4uc.png',
    categoryId: '6',
  },

  // ---------------- LAPTOPY ----------------
  {
    name: 'MacBook Air 13',
    slug: 'macbook-air-13',
    price: 5499,
    stock: 12,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'Lenovo Legion 5',
    slug: 'lenovo-legion-5',
    price: 4799,
    stock: 20,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'Dell XPS 15',
    slug: 'dell-xps-15',
    price: 8999,
    stock: 8,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'ASUS Zenbook',
    slug: 'asus-zenbook',
    price: 4299,
    stock: 18,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'HP Pavilion',
    slug: 'hp-pavilion',
    price: 3199,
    stock: 25,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'Acer Nitro 5',
    slug: 'acer-nitro-5',
    price: 3899,
    stock: 16,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'Microsoft Surface',
    slug: 'surface-pro',
    price: 5199,
    stock: 10,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'MacBook Pro 14',
    slug: 'macbook-pro-14',
    price: 8499,
    stock: 14,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'Lenovo ThinkPad X1',
    slug: 'lenovo-thinkpad-x1',
    price: 6999,
    stock: 12,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'Dell Inspiron 16',
    slug: 'dell-inspiron-16',
    price: 4199,
    stock: 18,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'ASUS ROG Strix',
    slug: 'asus-rog-strix',
    price: 7499,
    stock: 10,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'HP Envy 13',
    slug: 'hp-envy-13',
    price: 4299,
    stock: 20,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'Acer Swift 3',
    slug: 'acer-swift-3',
    price: 3899,
    stock: 16,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'Microsoft Surface Laptop 4',
    slug: 'surface-laptop-4',
    price: 4999,
    stock: 12,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'MacBook Pro 16',
    slug: 'macbook-pro-16',
    price: 12499,
    stock: 6,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'Lenovo Yoga 9i',
    slug: 'lenovo-yoga-9i',
    price: 6299,
    stock: 12,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'Dell Latitude 7420',
    slug: 'dell-latitude-7420',
    price: 5799,
    stock: 10,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'ASUS VivoBook 15',
    slug: 'asus-vivobook-15',
    price: 3399,
    stock: 18,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'HP Spectre x360',
    slug: 'hp-spectre-x360',
    price: 6499,
    stock: 12,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'Acer Predator Helios',
    slug: 'acer-predator-helios',
    price: 7499,
    stock: 8,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'Microsoft Surface Pro 9',
    slug: 'surface-pro-9',
    price: 5499,
    stock: 10,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'MacBook Air 15',
    slug: 'macbook-air-15',
    price: 5999,
    stock: 10,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'Lenovo Legion 7',
    slug: 'lenovo-legion-7',
    price: 7999,
    stock: 8,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'Dell XPS 17',
    slug: 'dell-xps-17',
    price: 9999,
    stock: 6,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },
  {
    name: 'ASUS ROG Zephyrus',
    slug: 'asus-rog-zephyrus',
    price: 8499,
    stock: 10,
    category: 'Laptopy',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770497436/mgu7nxbxwke5jlqkru5u.png',
    categoryId: 1,
  },

  // ---------------- TABLETY ----------------
  {
    name: 'iPad Pro 12',
    slug: 'ipad-pro-12',
    price: 4500,
    stock: 22,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'Samsung Galaxy Tab S8',
    slug: 'galaxy-tab-s8',
    price: 3200,
    stock: 18,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'Huawei MatePad 11',
    slug: 'matepad-11',
    price: 2800,
    stock: 25,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'Lenovo Tab P11',
    slug: 'tab-p11',
    price: 2100,
    stock: 30,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'Microsoft Surface Go',
    slug: 'surface-go',
    price: 3500,
    stock: 12,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'Samsung Galaxy Tab A8',
    slug: 'tab-a8',
    price: 1800,
    stock: 28,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'iPad Mini 6',
    slug: 'ipad-mini-6',
    price: 2200,
    stock: 15,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'iPad Air 5',
    slug: 'ipad-air-5',
    price: 3300,
    stock: 20,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'Samsung Tab S7+',
    slug: 'samsung-tab-s7-plus',
    price: 4000,
    stock: 30,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'Huawei MatePad Pro',
    slug: 'matepad-pro',
    price: 4000,
    stock: 12,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'Lenovo Tab M10',
    slug: 'tab-m10',
    price: 2100,
    stock: 25,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'Microsoft Surface Pro 8',
    slug: 'surface-pro-8',
    price: 4700,
    stock: 14,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'iPad Pro 11',
    slug: 'ipad-pro-11',
    price: 4300,
    stock: 20,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'Samsung Galaxy Tab S6',
    slug: 'galaxy-tab-s6',
    price: 2800,
    stock: 22,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'Huawei MatePad 10',
    slug: 'matepad-10',
    price: 2600,
    stock: 18,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'Lenovo Tab P12',
    slug: 'tab-p12',
    price: 2500,
    stock: 20,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'iPad Mini 7',
    slug: 'ipad-mini-7',
    price: 2300,
    stock: 25,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'Samsung Tab A7',
    slug: 'tab-a7',
    price: 2000,
    stock: 30,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'Huawei MatePad 12',
    slug: 'matepad-12',
    price: 4200,
    stock: 12,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'Lenovo Tab M8',
    slug: 'tab-m8',
    price: 1800,
    stock: 28,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'iPad Air 6',
    slug: 'ipad-air-6',
    price: 3500,
    stock: 15,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'Samsung Tab S5e',
    slug: 'tab-s5e',
    price: 3100,
    stock: 18,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'Huawei MatePad 8',
    slug: 'matepad-8',
    price: 2700,
    stock: 20,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'Lenovo Tab P10',
    slug: 'tab-p10',
    price: 2400,
    stock: 25,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },
  {
    name: 'iPad Pro 10',
    slug: 'ipad-pro-10',
    price: 4500,
    stock: 12,
    category: 'Tablety',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654183/obpodfj51bpy0igvsy0h.png',
    categoryId: 5,
  },

  // ---------------- SMARTWATCH ----------------
  {
    name: 'Apple Watch Series 9',
    slug: 'apple-watch-9',
    price: 1800,
    stock: 20,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Samsung Galaxy Watch 6',
    slug: 'galaxy-watch-6',
    price: 1600,
    stock: 18,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Huawei Watch GT 3',
    slug: 'huawei-watch-gt3',
    price: 1400,
    stock: 25,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Garmin Fenix 7',
    slug: 'garmin-fenix-7',
    price: 2500,
    stock: 10,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Fitbit Versa 4',
    slug: 'fitbit-versa-4',
    price: 1200,
    stock: 22,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Apple Watch SE',
    slug: 'apple-watch-se',
    price: 1400,
    stock: 18,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Samsung Galaxy Watch 5',
    slug: 'galaxy-watch-5',
    price: 1500,
    stock: 20,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Garmin Venu 2',
    slug: 'garmin-venu-2',
    price: 2000,
    stock: 12,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Fitbit Sense',
    slug: 'fitbit-sense',
    price: 1700,
    stock: 15,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Huawei Watch Fit',
    slug: 'huawei-watch-fit',
    price: 900,
    stock: 25,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Apple Watch Series 8',
    slug: 'apple-watch-8',
    price: 1750,
    stock: 18,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Samsung Galaxy Watch 4',
    slug: 'galaxy-watch-4',
    price: 1400,
    stock: 22,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Garmin Forerunner 945',
    slug: 'garmin-forerunner-945',
    price: 2400,
    stock: 12,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Fitbit Charge 5',
    slug: 'fitbit-charge-5',
    price: 900,
    stock: 28,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Apple Watch Ultra',
    slug: 'apple-watch-ultra',
    price: 4000,
    stock: 8,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Samsung Galaxy Watch Active 2',
    slug: 'galaxy-watch-active-2',
    price: 1300,
    stock: 20,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Garmin Instinct 2',
    slug: 'garmin-instinct-2',
    price: 1800,
    stock: 15,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Fitbit Inspire 3',
    slug: 'fitbit-inspire-3',
    price: 800,
    stock: 25,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Huawei Watch 3',
    slug: 'huawei-watch-3',
    price: 1500,
    stock: 18,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Apple Watch Series 7',
    slug: 'apple-watch-7',
    price: 1600,
    stock: 20,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Samsung Galaxy Watch Active 3',
    slug: 'galaxy-watch-active-3',
    price: 1200,
    stock: 25,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Garmin Fenix 6',
    slug: 'garmin-fenix-6',
    price: 2200,
    stock: 10,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Fitbit Versa 3',
    slug: 'fitbit-versa-3',
    price: 1100,
    stock: 28,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Huawei Watch GT 2',
    slug: 'huawei-watch-gt2',
    price: 1300,
    stock: 22,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },
  {
    name: 'Samsung Galaxy Watch 3',
    slug: 'galaxy-watch-3',
    price: 1400,
    stock: 20,
    category: 'Smartwatche',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770654177/veaufvidmpji8xxlcai7.png',
    categoryId: 3,
  },

  // ---------------- SŁUCHAWKI ----------------
  {
    name: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    price: 1500,
    stock: 30,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'Bose QuietComfort 45',
    slug: 'bose-qc45',
    price: 1400,
    stock: 25,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'Apple AirPods Max',
    slug: 'airpods-max',
    price: 2200,
    stock: 12,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'JBL Live 660NC',
    slug: 'jbl-live-660nc',
    price: 900,
    stock: 20,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'Sennheiser HD 450BT',
    slug: 'sennheiser-hd-450bt',
    price: 1100,
    stock: 15,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'Sony WF-1000XM5',
    slug: 'sony-wf-1000xm5',
    price: 1200,
    stock: 18,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'Bose SoundSport',
    slug: 'bose-soundsport',
    price: 700,
    stock: 25,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'Apple AirPods Pro',
    slug: 'airpods-pro',
    price: 1200,
    stock: 22,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'JBL Tune 750BT',
    slug: 'jbl-tune-750bt',
    price: 800,
    stock: 20,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'Sennheiser Momentum 4',
    slug: 'sennheiser-momentum-4',
    price: 1600,
    stock: 12,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'Sony WH-XB910N',
    slug: 'sony-wh-xb910n',
    price: 1400,
    stock: 20,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'Bose 700',
    slug: 'bose-700',
    price: 1800,
    stock: 12,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'Apple AirPods 3',
    slug: 'airpods-3',
    price: 900,
    stock: 25,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'JBL Club 950NC',
    slug: 'jbl-club-950nc',
    price: 1000,
    stock: 15,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'Sennheiser HD 560S',
    slug: 'sennheiser-hd-560s',
    price: 1100,
    stock: 20,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'Sony WF-C500',
    slug: 'sony-wf-c500',
    price: 700,
    stock: 22,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'Bose SoundLink',
    slug: 'bose-soundlink',
    price: 1300,
    stock: 18,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'Apple Beats Fit Pro',
    slug: 'beats-fit-pro',
    price: 1000,
    stock: 25,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
  },
  {
    name: 'JBL Live Pro+',
    slug: 'jbl-live-pro-plus',
    price: 900,
    stock: 20,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
  },
  {
    name: 'Sennheiser HD 350BT',
    slug: 'sennheiser-hd-350bt',
    price: 800,
    stock: 28,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'Sony WH-CH720N',
    slug: 'sony-wh-ch720n',
    price: 950,
    stock: 22,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'Bose QuietComfort Earbuds',
    slug: 'bose-qc-earbuds',
    price: 1600,
    stock: 12,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'Apple AirPods Max 2',
    slug: 'airpods-max-2',
    price: 2400,
    stock: 10,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'JBL Quantum 800',
    slug: 'jbl-quantum-800',
    price: 1100,
    stock: 15,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },
  {
    name: 'Sennheiser Momentum True Wireless 3',
    slug: 'sennheiser-momentum-tws-3',
    price: 1700,
    stock: 12,
    category: 'Słuchawki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656485/on0dwx19qzmhuz5ayvc0.png',
    categoryId: 4,
  },

  // ---------------- MYSZKI ----------------
  {
    name: 'Logitech G502',
    slug: 'logitech-g502',
    price: 299,
    stock: 30,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'Razer DeathAdder V2',
    slug: 'razer-deathadder-v2',
    price: 250,
    stock: 18,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'Logitech G Pro X Superlight',
    slug: 'logitech-g-pro-x-superlight',
    price: 199,
    stock: 22,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'SteelSeries Rival 600',
    slug: 'steelseries-rival-600',
    price: 599,
    stock: 16,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'Glorious Model O',
    slug: 'glorious-model-o',
    price: 450,
    stock: 20,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'Logitech MX Master 3',
    slug: 'logitech-mx-master-3',
    price: 399,
    stock: 25,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'Razer Basilisk Ultimate',
    slug: 'razer-basilisk-ultimate',
    price: 799,
    stock: 15,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'Corsair Dark Core RGB',
    slug: 'corsair-dark-core-rgb',
    price: 299,
    stock: 20,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'Corsair M65 Elite',
    slug: 'corsair-m65-elite',
    price: 699,
    stock: 18,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'Logitech G305 Lightspeed',
    slug: 'logitech-g305-lightspeed',
    price: 299,
    stock: 25,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'Razer Orochi V2',
    slug: 'razer-orochi-v2',
    price: 199,
    stock: 30,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
  },
  {
    name: 'Logitech G203 Lightsync',
    slug: 'logitech-g203-lightsync',
    price: 399,
    stock: 12,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'Razer Viper Mini',
    slug: 'razer-viper-mini',
    price: 599,
    stock: 18,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'SteelSeries Sensei Ten',
    slug: 'steelseries-sensei-ten',
    price: 249,
    stock: 20,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'HyperX Pulsefire FPS Pro',
    slug: 'hyperx-pulsefire-fps-pro',
    price: 150,
    stock: 35,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'Logitech G903 Lightspeed',
    slug: 'logitech-g903-lightspeed',
    price: 499,
    stock: 12,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'Razer Naga Trinity',
    slug: 'razer-naga-trinity',
    price: 299,
    stock: 25,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'Logitech G Pro Wireless',
    slug: 'logitech-g-pro-wireless',
    price: 399,
    stock: 18,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'Razer Kraken Mouse Edition',
    slug: 'razer-kraken-mouse-edition',
    price: 299,
    stock: 22,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'Corsair Katar Pro',
    slug: 'corsair-katar-pro',
    price: 199,
    stock: 28,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'Corsair Sabre RGB Pro',
    slug: 'corsair-sabre-rgb-pro',
    price: 499,
    stock: 15,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'Apple Magic Mouse 2',
    slug: 'apple-magic-mouse-2',
    price: 149,
    stock: 40,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'Samsung Bluetooth Mouse',
    slug: 'samsung-bluetooth-mouse',
    price: 699,
    stock: 22,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'Logitech G703 Lightspeed',
    slug: 'logitech-g703-lightspeed',
    price: 1099,
    stock: 10,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
  {
    name: 'Razer Viper Ultimate',
    slug: 'razer-viper-ultimate',
    price: 599,
    stock: 20,
    category: 'Myszki',
    imageUrl:
      'https://res.cloudinary.com/dlub2bht7/image/upload/v1770656465/vkygwt0u1ivgeoh99s0e.png',
    categoryId: 2,
  },
];

// Add default descriptions per category for seed data
const phoneDescription =
  'Nowoczesny smartfon z wysokiej klasy aparatem, szybkim procesorem i długim czasem pracy na baterii.';
const laptopDescription =
  'Wydajny laptop z wysokiej jakości ekranem, długim czasem pracy na baterii i solidną konstrukcją.';
const tabletDescription =
  'Lekki i wydajny tablet idealny do pracy i rozrywki, z wyraźnym ekranem i długim czasem pracy na baterii.';
const watchDescription =
  'Nowoczesny smartwatch z monitorowaniem zdrowia, długim czasem pracy baterii i eleganckim designem.';

productsData = productsData.map((p: any) => {
  if (!p.description) {
    const cat = String(p.category || '').toLowerCase();
    if (cat.includes('telefon')) p.description = phoneDescription;
    else if (cat.includes('laptop')) p.description = laptopDescription;
    else if (cat.includes('tablet')) p.description = tabletDescription;
    else if (
      cat.includes('smart') ||
      cat.includes('watch') ||
      cat.includes('zegarek')
    )
      p.description = watchDescription;
  }
  return p;
});
