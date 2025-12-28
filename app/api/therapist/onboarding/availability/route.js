import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DAY_MAP = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
};

export async function POST(req) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { schedule, hourlyRate } = body;

        if (!schedule || !hourlyRate) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            include: { therapistProfile: true },
        });

        if (!user || user.role !== "THERAPIST") {
            return NextResponse.json(
                { error: "User not found or not a therapist" },
                { status: 400 }
            );
        }

        // Delete the existing availability
        await prisma.availability.deleteMany({
            where: { therapistId: user.therapistProfile.id }
        });

        // Create a new availability slots
        const availabilityData = [];

        Object.entries(schedule).forEach(([day, dayData]) => {
            if (dayData.enabled && dayData.timeBlocks.length > 0) {
                dayData.timeBlocks.forEach((block) => {
                    availabilityData.push({
                        therapistId: user.therapistProfile.id,
                        daysOfWeek: DAY_MAP[day],
                        startTime: block.startTime,
                        endTime: block.endTime,
                        isAvailable: true,
                    });
                });
            }
        });

        if (availabilityData.length > 0) {
            await prisma.availability.createMany({
                data: availabilityData,
            });
        }

        // Update hourly rate
        await prisma.therapist.update({
            where: { id: user.therapistProfile.id },
            data: { hourlyRate },
        });

        return NextResponse.json({
            success: true,
            message: "Availability saved successfully",
        });
    } catch (error) {
        console.error("Error saving availability:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}