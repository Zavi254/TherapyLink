"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

const useOnboardingStore = create(
    persist(
        (set, get) => ({
            // Current step tracking
            currentStep: 1,
            completedSteps: [],

            // Basic Info Data
            basicInfo: {
                firstName: "",
                lastName: "",
                phone: "",
                experience: "",
                specialization: "",
                specializationLabel: "",
                bio: "",
                profilePhotoUrl: null,
            },

            // Credentials Data
            credentials: {
                licenseType: "",
                licenseNumber: "",
                licenseState: "",
                expirationDate: "",
                licenseDocumentUrl: null,
                additionalCertifications: [],
            },

            // Availability Data
            availability: {
                schedule: {
                    monday: { enabled: false, timeBlocks: [] },
                    tuesday: { enabled: false, timeBlocks: [] },
                    wednesday: { enabled: false, timeBlocks: [] },
                    thursday: { enabled: false, timeBlocks: [] },
                    friday: { enabled: false, timeBlocks: [] },
                    saturday: { enabled: false, timeBlocks: [] },
                    sunday: { enabled: false, timeBlocks: [] },
                },
                hourlyRate: 150,
            },

            // Payment Data
            payment: {
                stripeConnected: false,
                stripeAccountId: null,
                onboardingComplete: false,
            },

            // Actions
            setCurrentStep: (step) => set({ currentStep: step }),

            markStepComplete: (step) =>
                set((state) => ({
                    completedSteps: [...new Set([...state.completedSteps, step])],
                })),

            updateBasicInfo: (data) =>
                set((state) => ({
                    basicInfo: { ...state.basicInfo, ...data },
                })),

            updateCredentials: (data) =>
                set((state) => ({
                    credentials: { ...state.credentials, ...data },
                })),

            addCertification: (cert) =>
                set((state) => ({
                    credentials: {
                        ...state.credentials,
                        additionalCertifications: [
                            ...state.credentials.additionalCertifications,
                            cert
                        ],
                    },
                })),

            removeCertification: (index) =>
                set((state) => ({
                    credentials: {
                        ...state.credentials,
                        additionalCertifications:
                            state.credentials.additionalCertifications.filter(
                                (_, i) => i !== index
                            ),
                    },
                })),

            updateAvailability: (data) =>
                set((state) => ({
                    availability: { ...state.availability, ...data },
                })),

            toggleDayAvailability: (day) =>
                set((state) => ({
                    availability: {
                        ...state.availability,
                        schedule: {
                            ...state.availability.schedule,
                            [day]: {
                                ...state.availability.schedule[day],
                                enabled: !state.availability.schedule[day].enabled,
                            },
                        },
                    },
                })),

            addTimeBlock: (day, timeBlock) =>
                set((state) => ({
                    availability: {
                        ...state.availability,
                        schedule: {
                            ...state.availability.schedule,
                            [day]: {
                                ...state.availability.schedule[day],
                                timeBlocks: [
                                    ...state.availability.schedule[day].timeBlocks,
                                    timeBlock,
                                ],
                            },
                        },
                    },
                })),

            removeTimeBlock: (day, index) =>
                set((state) => ({
                    availability: {
                        ...state.availability,
                        schedule: {
                            ...state.availability.schedule,
                            [day]: {
                                ...state.availability.schedule[day],
                                timeBlocks: state.availability.schedule[day].timeBlocks.filter(
                                    (_, i) => i !== index
                                ),
                            },
                        },
                    },
                })),

            updateTimeBlock: (day, index, updatedBlock) =>
                set((state) => ({
                    availability: {
                        ...state.availability,
                        schedule: {
                            ...state.availability.schedule,
                            [day]: {
                                ...state.availability.schedule[day],
                                timeBlocks: state.availability.schedule[day].timeBlocks.map(
                                    (block, i) => (i === index ? updatedBlock : block)
                                ),
                            },
                        },
                    },
                })),

            applyScheduleToWeekdays: () =>
                set((state) => {
                    const mondaySchedule = state.availability.schedule.monday;
                    return {
                        availability: {
                            ...state.availability,
                            schedule: {
                                ...state.availability.schedule,
                                tuesday: { ...mondaySchedule },
                                wednesday: { ...mondaySchedule },
                                thursday: { ...mondaySchedule },
                                friday: { ...mondaySchedule },
                            },
                        },
                    };
                }),

            applyScheduleToAllDays: () =>
                set((state) => {
                    const mondaySchedule = state.availability.schedule.monday;
                    const allDays = [
                        'monday',
                        'tuesday',
                        'wednesday',
                        'thursday',
                        'friday',
                        'saturday',
                        'sunday',
                    ];
                    const newSchedule = {};
                    allDays.forEach((day) => {
                        newSchedule[day] = { ...mondaySchedule };
                    });
                    return {
                        availability: {
                            ...state.availability,
                            schedule: newSchedule,
                        },
                    };
                }),

            updatePayment: (data) =>
                set((state) => ({
                    payment: { ...state.payment, ...data },
                })),

            // Get all data for submission
            getAllData: () => {
                const state = get();
                return {
                    basicInfo: state.basicInfo,
                    credentials: state.credentials,
                    availability: state.availability,
                    payment: state.payment,
                };
            },

            // Reset store (after completion)
            reset: () =>
                set({
                    currentStep: 1,
                    completedSteps: [],
                    basicInfo: {
                        firstName: '',
                        lastName: '',
                        phone: '',
                        experience: '',
                        specialization: '',
                        bio: '',
                        profilePhotoUrl: null,
                    },
                    credentials: {
                        licenseType: '',
                        licenseNumber: '',
                        licenseState: '',
                        expirationDate: '',
                        licenseDocumentUrl: null,
                        additionalCertifications: [],
                    },
                    availability: {
                        schedule: {
                            monday: { enabled: false, timeBlocks: [] },
                            tuesday: { enabled: false, timeBlocks: [] },
                            wednesday: { enabled: false, timeBlocks: [] },
                            thursday: { enabled: false, timeBlocks: [] },
                            friday: { enabled: false, timeBlocks: [] },
                            saturday: { enabled: false, timeBlocks: [] },
                            sunday: { enabled: false, timeBlocks: [] },
                        },
                        hourlyRate: 150,
                    },
                    payment: {
                        stripeConnected: false,
                        stripeAccountId: null,
                        onboardingComplete: false,
                    },
                }),
        }),
        {
            name: "therapist-onboarding-storage",
            // only persist certain fields (not sensitive data)
            // partialize: (state) => ({
            //     currentStep: state.currentStep,
            //     completedSteps: state.completedSteps,
            //     basicInfo: {
            //         ...state.basicInfo,
            //         profilePhoto: null, // Don't persist file
            //     },
            //     credentials: {
            //         ...state.credentials,
            //         licenseDocument: null, // Don't persist file
            //     },
            //     availability: state.availability,
            // }),
        }
    )
);

export default useOnboardingStore;