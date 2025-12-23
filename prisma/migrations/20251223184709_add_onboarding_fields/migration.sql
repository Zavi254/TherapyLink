/*
  Warnings:

  - You are about to drop the column `sessionEnded` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `sessionStarted` on the `Appointment` table. All the data in the column will be lost.
  - Added the required column `therapistEarnings` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "sessionEnded",
DROP COLUMN "sessionStarted",
ADD COLUMN     "paymentReleasedAt" TIMESTAMP(3),
ADD COLUMN     "sessionEndedAt" TIMESTAMP(3),
ADD COLUMN     "sessionStartedAt" TIMESTAMP(3),
ADD COLUMN     "therapistEarnings" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Therapist" ADD COLUMN     "additionalCertifications" JSONB,
ADD COLUMN     "experience" INTEGER,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "licenseDocumentUrl" TEXT,
ADD COLUMN     "licenseExpirationDate" TIMESTAMP(3),
ADD COLUMN     "licenseState" TEXT,
ADD COLUMN     "stripeOnboardingComplete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT,
ADD COLUMN     "profilePhotoUrl" TEXT;

-- CreateIndex
CREATE INDEX "Availability_therapistId_daysOfWeek_idx" ON "Availability"("therapistId", "daysOfWeek");

-- CreateIndex
CREATE INDEX "Therapist_specialization_idx" ON "Therapist"("specialization");
