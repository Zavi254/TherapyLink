import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            licenseType,
            licenseNumber,
            licenseState,
            expirationDate,
            licenseDocumentUrl,
            additionalCertifications,
        } = body;

        // validate required fields
        if (!licenseType || !licenseNumber || !licenseState || !expirationDate) {
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
                { status: 404 }
            );
        }

        // Update therapist profile with credentials
        await prisma.therapist.update({
            where: { id: user.therapistProfile.id },
            data: {
                licenseNumber,
                licenseType,
                licenseState,
                licenseExpirationDate: new Date(expirationDate),
                licenseDocumentUrl,
                additionalCertifications: additionalCertifications || [],
            },
        });

        return NextResponse.json({
            success: true,
            message: "Credentials saved successfully",
        });
    } catch (error) {
        console.error("Error saving credentials:", error);
        return NextResponse.json(
            { error: "Internal Server error" },
            { status: 500 }
        );
    }
} 