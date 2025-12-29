import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { firstName, lastName, phone, experience, specialization, specializationLabel, bio } = body;

        // Validate required fields
        if (!firstName || !lastName || !phone || !experience || !specialization || !bio) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            include: { therapistProfile: true },
        });

        if (!user || user.role !== "THERAPIST") {
            return NextResponse.json(
                { error: "User not found or not a therapist" },
                { status: 404 }
            );
        }

        // Update user basic info
        await prisma.user.update({
            where: { id: user.id },
            data: {
                firstName,
                lastName
            }
        });

        // Update or create therapist profile
        if (user.therapistProfile) {
            await prisma.therapist.update({
                where: { id: user.therapistProfile.id },
                data: {
                    bio,
                    specialization: [specializationLabel || specialization],
                    experience: parseInt(experience)
                },
            });
        }

        return NextResponse.json({
            success: true,
            message: "Basic info saved successfully",
        });
    } catch (error) {
        console.error("Error saving basic info:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function GET(req) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
            include: { therapistProfile: true },
        });

        if (!user || user.role !== 'THERAPIST') {
            return NextResponse.json(
                { error: "User not found or not a therapist" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            firstName: user.firstName,
            lastName: user.lastName,
            bio: user.therapistProfile?.bio,
            specialization: user.therapistProfile?.specialization?.[0],
        });
    } catch (error) {
        console.error("Error fetching basic info:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}