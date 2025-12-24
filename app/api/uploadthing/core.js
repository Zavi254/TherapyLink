import { createUploadthing } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
    // Profile image uploader
    profileImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async () => {
            const { userId } = await auth();
            if (!userId) throw new Error("Unauthorized");
            return { userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Profile image upload complete for userId:", metadata.userId);
            console.log("File URL:", file.ufsUrl);
            return { uploadedBy: metadata.userId, url: file.ufsUrl };
        }),

    // License document uploader
    licenseDocument: f({
        pdf: { maxFileSize: "8MB", maxFileCount: 1 },
        image: { maxFileSize: "8MB", maxFileCount: 1 }
    })
        .middleware(async () => {
            const { userId } = await auth();
            if (!user) throw new Error("Unauthorized");
            return { userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("License document upload complete for userId:", metadata.userId);
            console.log("File URL:", file.ufsUrl);
            return { uploadedBy: metadata.userId, url: file.ufsUrl };
        }),
};