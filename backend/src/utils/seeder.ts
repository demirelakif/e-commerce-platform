import User from "../models/User";
import Category from "../models/Category";
import Product from "../models/Product";
import bcrypt from "bcryptjs";

export const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Create demo users
    const customer = await User.create({
      email: "customer@demo.com",
      password: "demo123",
      firstName: "John",
      lastName: "Doe",
      phone: "+1234567890",
      role: "customer",
      isEmailVerified: true,
      addresses: [
        {
          type: "shipping",
          street: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "United States",
          isDefault: true,
        },
      ],
      preferences: {
        favoriteCategories: [],
        newsletterSubscription: true,
      },
    });

    const admin = await User.create({
      email: "admin@demo.com",
      password: "admin123",
      firstName: "Admin",
      lastName: "User",
      phone: "+1234567890",
      role: "admin",
      isEmailVerified: true,
    });

    console.log("✅ Demo users created");

    // Create categories
    const categories = await Category.create([
      {
        name: "Electronics",
        description: "Latest electronic devices and gadgets",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
        slug: "electronics",
        sortOrder: 1,
      },
      {
        name: "Clothing",
        description: "Fashion and apparel for all ages",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400",
        slug: "clothing",
        sortOrder: 2,
      },
      {
        name: "Home and Garden",
        description: "Everything for your home and garden",
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        slug: "home-and-garden",
        sortOrder: 3,
      },
      {
        name: "Sports",
        description: "Sports equipment and athletic wear",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
        slug: "sports",
        sortOrder: 4,
      },
      {
        name: "Books",
        description: "Books, magazines, and educational materials",
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400",
        slug: "books",
        sortOrder: 5,
      },
      {
        name: "Health and Beauty",
        description: "Health products and beauty supplies",
        image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400",
        slug: "health-and-beauty",
        sortOrder: 6,
      },
      {
        name: "Toys",
        description: "Toys and games for all ages",
        image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400",
        slug: "toys",
        sortOrder: 7,
      },
      {
        name: "Food",
        description: "Gourmet foods and beverages",
        image: "https://images.unsplash.com/photo-1504674900240-8947e31be3f6?w=400",
        slug: "food",
        sortOrder: 8,
      },
    ]);

    console.log("✅ Categories created");

    // Create sample products
    const products = await Product.create([
      {
        name: "Wireless Bluetooth Headphones",
        description: "High-quality wireless headphones with noise cancellation and long battery life.",
        price: 99.99,
        originalPrice: 129.99,
        category: categories[0]._id, // Electronics
        images: [
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
          "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400",
        ],
        mainImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
        variants: [
          {
            color: "Black",
            stock: 50,
            price: 99.99,
            sku: "WH-BLACK-001",
          },
          {
            color: "White",
            stock: 30,
            price: 99.99,
            sku: "WH-WHITE-001",
          },
        ],
        specifications: [
          { name: "Battery Life", value: "20 hours" },
          { name: "Connectivity", value: "Bluetooth 5.0" },
          { name: "Weight", value: "250g" },
        ],
        tags: ["wireless", "bluetooth", "noise-cancelling", "headphones"],
        isFeatured: true,
        stock: 80,
        sku: "WH-001",
        brand: "AudioTech",
        weight: 250,
        dimensions: { length: 20, width: 15, height: 8 },
        slug: "wireless-bluetooth-headphones",
      },
      {
        name: "Organic Cotton T-Shirt",
        description: "Comfortable and sustainable organic cotton t-shirt available in multiple colors.",
        price: 24.99,
        category: categories[1]._id, // Clothing
        images: [
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
          "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400",
        ],
        mainImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
        variants: [
          {
            size: "S",
            color: "White",
            stock: 100,
            price: 24.99,
            sku: "TS-WHITE-S",
          },
          {
            size: "M",
            color: "White",
            stock: 150,
            price: 24.99,
            sku: "TS-WHITE-M",
          },
          {
            size: "L",
            color: "White",
            stock: 120,
            price: 24.99,
            sku: "TS-WHITE-L",
          },
        ],
        specifications: [
          { name: "Material", value: "100% Organic Cotton" },
          { name: "Fit", value: "Regular" },
          { name: "Care", value: "Machine wash cold" },
        ],
        tags: ["organic", "cotton", "sustainable", "t-shirt"],
        isFeatured: true,
        stock: 370,
        sku: "TS-001",
        brand: "EcoWear",
        weight: 150,
        slug: "organic-cotton-t-shirt",
      },
      {
        name: "Smart LED Desk Lamp",
        description: "Modern LED desk lamp with touch controls and adjustable brightness.",
        price: 79.99,
        category: categories[2]._id, // Home and Garden
        images: [
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
          "https://images.unsplash.com/photo-1513506003901-1e6a229e2d21?w=400",
        ],
        mainImage: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
        variants: [
          {
            color: "Silver",
            stock: 25,
            price: 79.99,
            sku: "LAMP-SILVER-001",
          },
          {
            color: "Black",
            stock: 20,
            price: 79.99,
            sku: "LAMP-BLACK-001",
          },
        ],
        specifications: [
          { name: "Power", value: "10W LED" },
          { name: "Brightness", value: "800 lumens" },
          { name: "Color Temperature", value: "3000K-6500K" },
        ],
        tags: ["led", "desk-lamp", "smart", "adjustable"],
        isFeatured: false,
        stock: 45,
        sku: "LAMP-001",
        brand: "LightTech",
        weight: 800,
        dimensions: { length: 40, width: 15, height: 60 },
        slug: "smart-led-desk-lamp",
      },
      {
        name: "Yoga Mat Premium",
        description: "Non-slip yoga mat made from eco-friendly materials for all your fitness needs.",
        price: 49.99,
        category: categories[3]._id, // Sports
        images: [
          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
          "https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=400",
        ],
        mainImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
        variants: [
          {
            color: "Purple",
            stock: 40,
            price: 49.99,
            sku: "YM-PURPLE-001",
          },
          {
            color: "Blue",
            stock: 35,
            price: 49.99,
            sku: "YM-BLUE-001",
          },
        ],
        specifications: [
          { name: "Material", value: "Natural Rubber" },
          { name: "Thickness", value: "6mm" },
          { name: "Dimensions", value: "183cm x 61cm" },
        ],
        tags: ["yoga", "fitness", "non-slip", "eco-friendly"],
        isFeatured: true,
        stock: 75,
        sku: "YM-001",
        brand: "FitLife",
        weight: 2000,
        dimensions: { length: 183, width: 61, height: 0.6 },
        slug: "yoga-mat-premium",
      },
    ]);

    console.log("✅ Sample products created");

    // Update category product counts
    for (const category of categories) {
      const productCount = await Product.countDocuments({ category: category._id });
      await Category.findByIdAndUpdate(category._id, { productCount });
    }

    console.log("✅ Database seeding completed successfully!");
    console.log("📧 Demo Customer: customer@demo.com / demo123");
    console.log("👨‍💼 Demo Admin: admin@demo.com / admin123");
  } catch (error) {
    console.error("❌ Database seeding failed:", error);
    throw error;
  }
};
