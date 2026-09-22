const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
require("dotenv").config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const previousCars = [
  {
    make: "Toyota",
    model: "Camry",
    year: 2023,
    price: 28999,
    images: ["/1.png"],
    transmission: "Automatic",
    fuelType: "Gasoline",
    bodyType: "Sedan",
    mileage: 15000,
    color: "White",
    seats: 5,
    description:
      "Reliable and fuel-efficient 2023 Toyota Camry Sedan in pristine White. Features advanced safety systems, smooth automatic transmission, and comfortable interior.",
    featured: true,
    status: "AVAILABLE",
  },
  {
    make: "Honda",
    model: "Civic",
    year: 2023,
    price: 26499,
    images: ["/2.webp"],
    transmission: "Manual",
    fuelType: "Gasoline",
    bodyType: "Sedan",
    mileage: 12000,
    color: "Blue",
    seats: 5,
    description:
      "Sporty 2023 Honda Civic Sedan finished in vibrant Blue. Equipped with responsive manual transmission, excellent handling, and modern infotainment.",
    featured: true,
    status: "AVAILABLE",
  },
  {
    make: "Tesla",
    model: "Model 3",
    year: 2022,
    price: 42999,
    images: ["/3.jpg"],
    transmission: "Automatic",
    fuelType: "Electric",
    bodyType: "Sedan",
    mileage: 8000,
    color: "Red",
    seats: 5,
    description:
      "All-electric 2022 Tesla Model 3 in striking Red. Exceptional acceleration, autopilot capability, cutting-edge tech, and low mileage.",
    featured: true,
    status: "AVAILABLE",
  },
];

async function main() {
  console.log("Seeding previous cars into database...");

  for (const carData of previousCars) {
    // Check if car already exists
    const existing = await prisma.car.findFirst({
      where: {
        make: carData.make,
        model: carData.model,
        year: carData.year,
      },
    });

    if (existing) {
      console.log(`Car already exists: ${carData.year} ${carData.make} ${carData.model}`);
    } else {
      const created = await prisma.car.create({
        data: carData,
      });
      console.log(`Added car: ${created.year} ${created.make} ${created.model} (ID: ${created.id})`);
    }
  }

  const total = await prisma.car.count();
  console.log(`Done! Total cars in database: ${total}`);
}

main()
  .catch((e) => {
    console.error("Error seeding cars:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
