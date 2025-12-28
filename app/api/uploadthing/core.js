import { createUploadthing } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
    // Profile image uploader
    profileImage: f({
        image: {
            maxFileSize: "4MB",
            maxFileCount: 1
        }
    })
        .middleware(async () => {
            try {
                const session = await auth();
                const userId = session?.userId;

                if (!userId) throw new Error("Unauthorized - Please sign in");
                return { userId };
            } catch (error) {
                console.error("Profile image middleware error:", error);
                throw error;
            }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Profile image uploaded by:", metadata.userId);
            console.log("File URL:", file.url);
            return { url: file.url };
        }),

    // License document uploader
    licenseDocument: f({
        pdf: { maxFileSize: "10MB", maxFileCount: 1 },
        image: { maxFileSize: "10MB", maxFileCount: 1 }
    })
        .middleware(async () => {
            try {
                const session = await auth();
                const userId = session?.userId;

                if (!userId) {
                    throw new Error("Unauthorized - Please sign in");
                }

                console.log("License document middleware - User:", userId);
                return { userId };
            } catch (error) {
                console.error("License document middleware error:", error);
                throw error;
            }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("License document uploaded by:", metadata.userId);
            console.log("File URL:", file.url);
            return { url: file.url };
        }),
};