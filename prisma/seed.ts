import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Set faker locale to pt_BR for more realistic Brazilian names
// Note: Modern faker uses locales differently, using default locale for now

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample users
  console.log('Creating users...');
  const users = await Promise.all([
    prisma.user.upsert({
      where: { id: 'user1' },
      update: {},
      create: {
        id: 'user1',
        email: 'liderhubadmin@email.com',
        name: 'Admin LiderHub',
      },
    }),
    prisma.user.upsert({
      where: { id: 'user2' },
      update: {},
      create: {
        id: 'user2',
        email: faker.internet.email(),
        name: faker.person.fullName(),
      },
    }),
    prisma.user.upsert({
      where: { id: 'user3' },
      update: {},
      create: {
        id: 'user3',
        email: faker.internet.email(),
        name: faker.person.fullName(),
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create sample notifications
  console.log('Creating notifications...');

  // Helper function to generate notification data for a specific user
  const generateNotificationForUser = (
    userId: string,
    notifIndex: number,
    isRead: boolean
  ) => {
    const notificationTypes = ['MENTION', 'PLAN_EXPIRY', 'SUPPORT', 'SYSTEM'];
    const type = faker.helpers.arrayElement(notificationTypes);
    const createdAt = faker.date.recent();

    // Some notifications will be scheduled for the future
    const isScheduled = faker.datatype.boolean(0.1); // 10% chance of being scheduled
    const scheduledAt = isScheduled ? faker.date.future() : undefined;

    let title, message;

    switch (type) {
      case 'MENTION':
        const mentioner = faker.person.fullName();
        const projectName = faker.company.buzzPhrase();
        title = 'Você foi marcado!';
        message = `${mentioner} te marcou em um comentário no projeto "${projectName}"`;
        break;

      case 'SUPPORT':
        const ticketId = faker.string.numeric(4);
        const ticketTitle = faker.hacker.phrase();
        const priority = faker.helpers.arrayElement([
          'baixa',
          'média',
          'alta',
          'urgente',
        ]);
        title = 'Novo ticket aberto';
        message = `Ticket #${ticketId} foi aberto com prioridade ${priority}: "${ticketTitle}"`;
        break;

      case 'PLAN_EXPIRY':
        const planType = faker.helpers.arrayElement([
          'Basic',
          'Pro',
          'Enterprise',
        ]);
        const daysLeft = faker.number.int({ min: 1, max: 30 });
        title = 'Plano expirando';
        message = `Seu plano ${planType} vence em ${daysLeft} dias. Renove agora para continuar aproveitando todos os benefícios!`;
        break;

      case 'SYSTEM':
        const feature = faker.hacker.noun();
        title = 'Nova funcionalidade!';
        message = `Agora você pode ${faker.hacker.verb()} ${feature} de forma ${faker.hacker.adjective()}. Confira as novidades!`;
        break;
    }

    return prisma.notification.upsert({
      where: { id: `${userId}_notif${notifIndex}` },
      update: {},
      create: {
        id: `${userId}_notif${notifIndex}`,
        title: title!,
        message: message!,
        type: type as any,
        isRead,
        userId,
        createdAt,
        scheduledAt,
      },
    });
  };

  // Create 3 notifications for each user (2 read, 1 unread)
  const allNotifications = [];
  const userIds = ['user1', 'user2', 'user3'];

  for (const userId of userIds) {
    // 2 notifications read
    allNotifications.push(generateNotificationForUser(userId, 1, true));
    allNotifications.push(generateNotificationForUser(userId, 2, true));
    // 1 notification unread
    allNotifications.push(generateNotificationForUser(userId, 3, false));
  }

  const notifications = await Promise.all(allNotifications);

  console.log(
    `✅ Created ${notifications.length} notifications (3 per user: 2 read, 1 unread)`
  );
  console.log(
    `📊 Total users: ${users.length}, Total notifications: ${notifications.length}`
  );
  console.log('🎉 Database seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error('❌ Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
