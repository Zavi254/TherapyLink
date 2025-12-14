import { prisma } from "../lib/prisma.js";

async function main() {
    console.log("🌱 Starting seed...");

    // Create sample therapist users
    const therapists = [
        {
            clerkId: 'seed_therapist_1',
            email: 'john.doe@therapy.com',
            firstName: 'John',
            lastName: 'Doe',
            role: 'THERAPIST',
            bio: 'Licensed Physical Therapist with 10+ years of experience in orthopedic rehabilitation.',
            specialization: ['Physical Therapy', 'Orthopedic', 'Sports Medicine'],
            licenseNumber: 'PT123456',
            hourlyRate: 85.00,
        },
        {
            clerkId: 'seed_therapist_2',
            email: 'sarah.smith@therapy.com',
            firstName: 'Sarah',
            lastName: 'Smith',
            role: 'THERAPIST',
            bio: 'Occupational Therapist specializing in geriatric care and home modifications.',
            specialization: ['Occupational Therapy', 'Geriatric Care', 'Home Safety'],
            licenseNumber: 'OT789012',
            hourlyRate: 90.00,
        },
        {
            clerkId: 'seed_therapist_3',
            email: 'mike.johnson@therapy.com',
            firstName: 'Mike',
            lastName: 'Johnson',
            role: 'THERAPIST',
            bio: 'Speech-Language Pathologist with expertise in stroke recovery and communication disorders.',
            specialization: ['Speech Therapy', 'Stroke Recovery', 'Communication Disorders'],
            licenseNumber: 'SLP345678',
            hourlyRate: 95.00,
        },
    ];

    for (const therapistData of therapists) {
        const { bio, specialization, licenseNumber, hourlyRate, ...userData } = therapistData;

        // Create user
        const user = await prisma.user.upsert({
            where: { clerkId: userData.clerkId },
            update: {},
            create: userData,
        });

        // Create therapist profile
        const therapist = await prisma.therapist.upsert({
            where: { userId: user.id },
            update: {},
            create: {
                userId: user.id,
                bio,
                specialization,
                licenseNumber,
                hourlyRate,
                onboardingComplete: true
            },
        });

        // Create availabity (Monday to Friday, 9 AM - 5 PM)
        for (let day = 1; day <= 5; day++) {
            await prisma.availability.create({
                data: {
                    therapistId: therapist.id,
                    daysOfWeek: day,
                    startTime: '09:00',
                    endTime: '17:00',
                    isAvailable: true,
                },
            });
        }

        console.log(`Created therapist: ${userData.firstName} ${userData.lastName}`)

    }

    console.log('Seed completed!')
}

main()
    .catch((e) => {
        console.error('Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });