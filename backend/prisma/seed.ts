import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedUniversities() {
  const count = await prisma.university.count();
  if (count > 0) {
    console.log(`ℹ️ Universities table already has ${count} records. Skipping seed.`);
    return;
  }

  console.log('🌱 Seeding mock universities into database...');

  const mockUniversities = [
    {
      name: 'Jharkhand Institute of Technology',
      location: 'Ranchi, Jharkhand',
      capabilities: JSON.stringify(['IoT', 'Civil Engineering', 'Sensors', 'Roads']),
    },
    {
      name: 'Ranchi Science College',
      location: 'Ranchi, Jharkhand',
      capabilities: JSON.stringify(['Chemical Engineering', 'Water Filtration', 'Spectroscopy']),
    },
    {
      name: 'State Agricultural University',
      location: 'Kanke, Ranchi',
      capabilities: JSON.stringify(['Soil Mechanics', 'Agriculture', 'Drones']),
    },
  ];

  for (const uni of mockUniversities) {
    await prisma.university.create({
      data: uni,
    });
  }

  console.log('✅ Successfully seeded 3 universities!');
}

export async function seedIndustries() {
  const count = await prisma.industry.count();
  if (count > 0) {
    console.log(`ℹ️ Industries table already has ${count} records. Skipping seed.`);
    return;
  }

  console.log('🌱 Seeding mock industries into database...');

  const mockIndustries = [
    {
      name: 'Tata Community Initiatives Trust',
      sector: 'CSR & Community Development',
      location: 'Jamshedpur, Jharkhand',
    },
    {
      name: 'Jindal CSR Foundation',
      sector: 'Infrastructure & Rural Health',
      location: 'Patratu, Jharkhand',
    },
    {
      name: 'Coal India Sustainable Development Trust',
      sector: 'Water & Environmental Sanitation',
      location: 'Dhanbad, Jharkhand',
    },
  ];

  for (const ind of mockIndustries) {
    await prisma.industry.create({
      data: ind,
    });
  }

  console.log('✅ Successfully seeded 3 industries!');
}

async function main() {
  try {
    await seedUniversities();
    await seedIndustries();
  } catch (e) {
    console.error('Error during seed:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
