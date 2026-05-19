import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create demo user
  const hash = await bcrypt.hash('password123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'demo@ratemyoutfit.app' },
    update: {},
    create: {
      email: 'demo@ratemyoutfit.app',
      username: 'demo_user',
      passwordHash: hash,
      displayName: 'Demo User',
      badges: ['first_fit'],
    },
  });

  console.log(`✅ Created user: ${user.username}`);
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
