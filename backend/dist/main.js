"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const prisma_service_1 = require("./prisma/prisma.service");
async function seedInitialUniversities(prisma, logger) {
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
    }
    else {
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
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
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
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
    }));
    const prismaService = app.get(prisma_service_1.PrismaService);
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
//# sourceMappingURL=main.js.map