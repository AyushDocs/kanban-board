import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

const seedData = async () => {
    const userEmail = 'ayushalokdubey@gmail.com';

    // Upsert the user
    const user = await prisma.user.upsert({
        where: { email: userEmail },
        update: {},
        create: {
            email: userEmail,
            name: 'Ayush Dubey',
            // image is optional, so only set if needed
        },
    });

    const now = new Date('2025-07-21');

    for (let day = 0; day < 5; day++) {
        const dueDate = new Date(now);
        dueDate.setDate(now.getDate() + day);

        for (let t = 1; t <= 2; t++) {
            await prisma.todo.create({
                data: {
                    title: `Todo ${t} for ${dueDate.toDateString()}`,
                    description: `This is todo ${t} for ${dueDate.toDateString()}`,
                    userEmail: user.email,
                    dueDate: dueDate,
                },
            });
        }
    }

    console.log('Database seeded successfully');
};

seedData()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });