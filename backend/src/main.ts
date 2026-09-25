import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';

async function seedInitialUniversities(prisma: PrismaService, logger: Logger) {
  const count = await prisma.university.count();
  if (count === 0) {
    logger.log('🌱 Seeding initial universities into database...');
    await prisma.university.createMany({
      data: [
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
      ],
    });
    logger.log('✅ Seeded 3 default universities.');
  } else {
    // Ensure existing Jharkhand Institute of Technology has the updated "Roads" capability
    const jit = await prisma.university.findFirst({
      where: { name: 'Jharkhand Institute of Technology' },
    });
    if (jit && !jit.capabilities.includes('Roads')) {
      await prisma.university.update({
        where: { id: jit.id },
        data: {
          capabilities: JSON.stringify(['IoT', 'Civil Engineering', 'Sensors', 'Roads']),
        },
      });
      logger.log('✅ Updated Jharkhand Institute of Technology capabilities with "Roads".');
    }
  }
}

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend integration (Vite on localhost:5173 / 5174)
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5175',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global DTO validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Seed default universities if empty
  const prismaService = app.get(PrismaService);
  await seedInitialUniversities(prismaService, logger);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(`🚀 Civic Complaint Management Backend is running on: http://localhost:${port}`);
  logger.log(`📋 Available Endpoints:`);
  logger.log(`   POST  /auth/otp/request       - Request mock OTP`);
  logger.log(`   POST  /auth/otp/verify        - Verify OTP & get JWT`);
  logger.log(`   POST  /complaints            - Submit complaint (CITIZEN)`);
  logger.log(`   GET   /complaints/mine       - Get citizen complaints (CITIZEN)`);
  logger.log(`   GET   /complaints            - View complaints (STAFF/ADMIN)`);
  logger.log(`   GET   /complaints/:id        - Single complaint & history`);
  logger.log(`   GET   /complaints/:id/matches - Match universities for complaint`);
  logger.log(`   PATCH /complaints/:id/status - Update status & audit log (STAFF/ADMIN)`);
  logger.log(`   GET   /departments           - List departments`);
  logger.log(`   POST  /departments           - Add department (ADMIN)`);
  logger.log(`   PATCH /departments/assign/:id- Assign complaint to department (STAFF/ADMIN)`);
}

bootstrap();
