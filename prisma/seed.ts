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
    // Add more users for better testing
    prisma.user.upsert({
      where: { id: 'user4' },
      update: {},
      create: {
        id: 'user4',
        email: faker.internet.email(),
        name: faker.person.fullName(),
      },
    }),
    prisma.user.upsert({
      where: { id: 'user5' },
      update: {},
      create: {
        id: 'user5',
        email: faker.internet.email(),
        name: faker.person.fullName(),
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create sample notifications
  console.log('Creating notifications...');

  // Helper function to generate realistic notification data
  const generateNotifications = () => {
    const notifications = [];
    const userIds = ['user1', 'user2', 'user3', 'user4', 'user5'];
    const notificationTypes = ['MENTION', 'PLAN_EXPIRY', 'SUPPORT', 'SYSTEM'];

    // Generate 15 diverse notifications
    for (let i = 1; i <= 15; i++) {
      const type = faker.helpers.arrayElement(notificationTypes);
      const userId = faker.helpers.arrayElement([...userIds, null]); // null for mass notifications
      const createdAt = faker.date.recent({ days: 7 }); // Within last 7 days

      let title, message, metadata;

      switch (type) {
        case 'MENTION':
          const mentioner = faker.person.fullName();
          const projectName = faker.company.buzzPhrase();
          title = 'Você foi marcado!';
          message = `${mentioner} te marcou em um comentário no projeto "${projectName}"`;
          metadata = {
            link: `/projects/${faker.string.alphanumeric(8)}`,
            mentionedBy: mentioner,
          };
          break;

        case 'SUPPORT':
          const ticketId = faker.string.numeric(4);
          const ticketTitle = faker.hacker.phrase();
          const priority = faker.helpers.arrayElement([
            'low',
            'medium',
            'high',
            'urgent',
          ]);
          title = 'Novo ticket aberto';
          message = `Ticket #${ticketId} foi aberto: "${ticketTitle}"`;
          metadata = {
            ticketId,
            priority,
            link: `/tickets/${ticketId}`,
          };
          break;

        case 'PLAN_EXPIRY':
          const planType = faker.helpers.arrayElement([
            'Basic',
            'Pro',
            'Enterprise',
          ]);
          const daysLeft = faker.number.int({ min: 1, max: 30 });
          title = 'Plano expirando';
          message = `Seu plano ${planType} vence em ${daysLeft} dias. Renove agora!`;
          metadata = {
            planType,
            daysLeft,
            renewLink: '/billing',
          };
          break;

        case 'SYSTEM':
          const feature = faker.hacker.noun();
          title = 'Nova funcionalidade!';
          message = `Agora você pode ${faker.hacker.verb()} ${feature} ${faker.hacker.adjective()}`;
          metadata = {
            feature: faker.string.alphanumeric(10),
            link: `/features/${faker.string.alphanumeric(8)}`,
          };
          break;
      }

      notifications.push(
        prisma.notification.upsert({
          where: { id: `notif${i}` },
          update: {},
          create: {
            id: `notif${i}`,
            title: title!,
            message: message!,
            type: type as any,
            isRead: faker.datatype.boolean(0.3), // 30% chance of being read
            userId,
            createdAt,
            metadata,
          },
        })
      );
    }

    return notifications;
  };

  const notifications = await Promise.all(generateNotifications());

  // Generate additional notifications specifically for user1 (50+ notifications)
  console.log('Creating additional notifications for user1...');
  const user1Notifications = [];

  for (let i = 16; i <= 70; i++) {
    // Generate 55 more notifications for user1
    const type = faker.helpers.arrayElement([
      'MENTION',
      'PLAN_EXPIRY',
      'SUPPORT',
      'SYSTEM',
    ]);
    const createdAt = faker.date.recent({ days: 30 }); // Within last 30 days for more variety

    let title, message, metadata;

    switch (type) {
      case 'MENTION':
        const mentioner = faker.person.fullName();
        const projectName = faker.company.buzzPhrase();
        title = 'Você foi marcado!';
        message = `${mentioner} te marcou em um comentário no projeto "${projectName}"`;
        metadata = {
          link: `/projects/${faker.string.alphanumeric(8)}`,
          mentionedBy: mentioner,
        };
        break;

      case 'SUPPORT':
        const ticketId = faker.string.numeric(4);
        const ticketTitle = faker.hacker.phrase();
        const priority = faker.helpers.arrayElement([
          'low',
          'medium',
          'high',
          'urgent',
        ]);
        title = 'Novo ticket aberto';
        message = `Ticket #${ticketId} foi aberto: "${ticketTitle}"`;
        metadata = {
          ticketId,
          priority,
          link: `/tickets/${ticketId}`,
        };
        break;

      case 'PLAN_EXPIRY':
        const planType = faker.helpers.arrayElement([
          'Basic',
          'Pro',
          'Enterprise',
        ]);
        const daysLeft = faker.number.int({ min: 1, max: 30 });
        title = 'Plano expirando';
        message = `Seu plano ${planType} vence em ${daysLeft} dias. Renove agora!`;
        metadata = {
          planType,
          daysLeft,
          renewLink: '/billing',
        };
        break;

      case 'SYSTEM':
        const feature = faker.hacker.noun();
        title = 'Nova funcionalidade!';
        message = `Agora você pode ${faker.hacker.verb()} ${feature} ${faker.hacker.adjective()}`;
        metadata = {
          feature: faker.string.alphanumeric(10),
          link: `/features/${faker.string.alphanumeric(8)}`,
        };
        break;

        break;
    }

    user1Notifications.push(
      prisma.notification.upsert({
        where: { id: `user1_notif${i}` },
        update: {},
        create: {
          id: `user1_notif${i}`,
          title: title!,
          message: message!,
          type: type as any,
          isRead: faker.datatype.boolean(0.4), // 40% chance of being read for user1
          userId: 'user1', // All notifications for user1
          createdAt,
          metadata,
        },
      })
    );
  }

  const user1NotificationResults = await Promise.all(user1Notifications);

  console.log(`✅ Created ${notifications.length} diverse notifications`);
  console.log(
    `✅ Created ${user1NotificationResults.length} additional notifications for user1`
  );
  console.log(
    `📊 Total notifications: ${notifications.length + user1NotificationResults.length}`
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
