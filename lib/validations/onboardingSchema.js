import z from "zod";

export const basicInfoSchema = z.object({
    firstName: z.string().min(2, 'First name must be atleast 2 characters'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters'),
    phone: z.string().regex(/^[\d\s\-\(\)]+$/, 'Please enter a valid phone number').min(10, 'Phone number must be at least 10 digits'),
    experience: z.coerce.number().min(0, 'Experience must be 0 or greater').max(50, 'Experience cannot exceed 50 years'),
    specialization: z.string().min(1, 'Please select a specialization'),
    bio: z.string().min(50, 'Bio must be at least 50 characters').max(500, 'Bio cannot exceed 500 characters'),
});

export const credentialSchema = z.object({
    licenseType: z.string().min(1, 'Please select a license type'),
    licenseNumber: z.string().min(5, 'License number must be at least 5 characters'),
    licenseState: z.string().min(1, 'Please select a state'),
    expirationDate: z.string().min(1, 'Please enter an expiration date'),
    licenseDocumentUrl: z.url({ error: 'Please upload a valid license document' }).nullable(),
});

export const availabilitySchema = z.object({
    hourlyRate: z.coerce
        .number()
        .min(50, 'Hourly rate must be atleast $50')
        .max(10000, 'Hourly rate cannot exceed $10000'),

    schedule: z
        .record(
            z.string(),
            z.object({
                enabled: z.boolean(),
                timeBlocks: z.array(
                    z.object({
                        startTime: z.string(),
                        endTime: z.string(),
                    })
                ),
            })
        ).refine(
            (schedule) =>
                Object.values(schedule).some(
                    (day) => day.enabled && day.timeBlocks.length > 0
                ),
            {
                message: 'Please set availability for atleast one day',
                path: ['schedule'],
            }
        ),
});