import { useState, useEffect } from "react";
import useOnboardingStore from "@/lib/store/onboardingStore";
import { useOnboarding } from "@/lib/hooks/useOnboarding";
import { useFormValidation } from "@/lib/hooks/useFormValidation";
import { availabilitySchema } from "@/lib/validations/onboardingSchema";
import { Input } from "../ui/Input";
import { Toggle } from "../ui/Toggle";
import { NavigationButtons } from "../shared/NavigationButtons";

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'saturday', 'sunday'];
const DAY_LABELS = {
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sunday: 'Sunday',
};

export function AvailabilityForm() {
    const {
        availability,
        updateAvailability,
        toggleDayAvailability,
        addTimeBlock,
        removeTimeBlock,
        updateTimeBlock,
        applyScheduleToWeekdays,
        applyScheduleToAllDays,
        setCurrentStep,

    } = useOnboardingStore();

    const { loading, saveStep, goToNextStep, goToPreviousStep } = useOnboarding();
    const { errors, validate } = useFormValidation(availabilitySchema);

    const [hourlyRate, setHourlyRate] = useState(availability.hourlyRate);

    useEffect(() => {
        setCurrentStep(3);
    }, [setCurrentStep]);

    const handleAddTimeBlock = (day) => {
        addTimeBlock(day, { startTime: '09:00', endTime: '17:00' });
    };

    const handleTimeChange = (day, index, field, value) => {
        const timeBlocks = availability.schedule[day].timeBlocks;
        const updatedBlock = { ...timeBlocks[index], [field]: value };
        updateTimeBlock(day, index, updatedBlock);
    }

    const calculateNetRate = (rate) => {
        const platformFee = 0.15; // 15%
        return (rate * (1 - platformFee)).toFixed(2);
    };

    const handleContinue = async () => {
        const formData = {
            schedule: availability.schedule,
            hourlyRate,
        };

        if (!validate(formData)) {
            alert(errors.schedule || 'Please set availability for atleast one day');
            return;
        }

        try {
            // Save to store
            updateAvailability({ hourlyRate });

            // Save to backend
            await saveStep("/api/therapist/onboarding/availability", {
                schedule: availability.schedule,
                hourlyRate,
            });

            // Navigate to next step
            goToNextStep("/therapist/onboarding/payment");
        } catch (error) {
            console.error('Error saving availability:', error);
            alert('Failed to save availability. Please try again.');
        }
    };

    const handleBack = () => {
        goToPreviousStep("/therapist/onboarding/credentials");
    }

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Set Your Availability</h1>
                <p className="text-gray-400">When are you available to see patients?</p>
            </header>

            <div className="flex flex-col gap-8">
                <form className="flex flex-col gap-8">
                    {/* Weekly schedule */}
                    <div className="bg-[#1e271c] border border-[#2c3928] rounded-2xl p-6 md:p-8 flex flex-col gap-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500">calendar_month</span>
                                Weekly Schedule
                            </h3>
                        </div>

                        <div className="flex flex-col gap-4">
                            {DAYS.map((day) => {
                                const dayData = availability.schedule[day];
                                const isEnabled = dayData.enabled;

                                return (
                                    <div
                                        key={day}
                                        className={`flex flex-col gap-4 bg-[#131811] rounded-xl border transition-all ${isEnabled
                                            ? 'border-green-500/30 relative overflow-hidden'
                                            : 'border-[#2c3928] opacity-80 hover:opacity-100'
                                            }`}
                                    >
                                        {isEnabled && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <span className={`font-bold ${isEnabled} ? 'text-white' : 'text-gray-400'`}>
                                                {DAY_LABELS[day]}
                                            </span>
                                            <Toggle
                                                enabled={isEnabled}
                                                onChange={() => toggleDayAvailability(day)}
                                            />
                                        </div>

                                        {isEnabled && (
                                            <div className="flex flex-col gap-3 mt-1 pl-1">
                                                {dayData.timeBlocks.map((block, index) => (
                                                    <div key={index} className="flex items-center gap-3">
                                                        <div className="flex items-center gap-2 flex-1">
                                                            <input
                                                                type="time"
                                                                value={block.startTime}
                                                                onChange={(e) => handleTimeChange(day, index, 'startTime', e.target.value)}
                                                                className="w-full bg-[#1e271c] border border-[#2c3928] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                            />
                                                            <span className="text-gray-400 text-sm">to</span>
                                                            <input
                                                                type="time"
                                                                value={block.endTime}
                                                                onChange={(e) => handleTimeChange(day, index, 'endTime', e.target.value)}
                                                                className="w-full bg-[#1e271c] border border-[#2c3928] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                        <button
                                                            onClick={() => removeTimeBlock(day, index)}
                                                            className="text-gray-400 hover:text-red-400 transition-colors p-1"
                                                            type="button"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">close</span>
                                                        </button>
                                                    </div>
                                                ))}

                                                <button
                                                    onClick={() => handleAddTimeBlock(day)}
                                                    className="flex items-center gap-2 text-sm text-blue-500 font-bold hover:text-blue-400 mt-2 self-start py-1 px-2 rounded hover:bg-blue-500/10 transition-colors"
                                                    type="button"
                                                >
                                                    <span className="material-symbols-outlined text-lg">add</span>
                                                    Add time block
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                );
                            })}
                        </div>

                        <div>
                            <button
                                onClick={applyScheduleToWeekdays}
                                className="text-sm font-semibold text-blue-500 hover:text-white border border-blue-500/20 hover:border-blue-500 hover:bg-blue-500/10 rounded-lg px-4 py-2 transition-all flex-1"
                                type="button"
                            >
                                Apply to all weekdays
                            </button>
                            <button
                                onClick={applyScheduleToAllDays}
                                className="text-sm font-semibold text-blue-500 hover:text-white border border-blue-500/20 hover:border-blue-500 hover:bg-blue-500/10 rounded-lg px-4 py-2 transition-all flex-1"
                                type="button"
                            >
                                Apply to all days
                            </button>
                        </div>
                    </div>

                    {/* Hourly Rate */}
                    <div className="bg-[#1e271c] border border-[#2c3928] rounded-2xl p-6 md:p-8 flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-blue-500">payments</span>
                            Hourly Rate
                        </h3>

                        <div className="flex flex-col gap-3">
                            <div className="relative">
                                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-2xl font-bold">
                                    $
                                </span>
                                <input
                                    type="number"
                                    value={hourlyRate}
                                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                                    className="w-full bg-[#131811] border border-[#2c3928] rounded-xl pl-12 pr-24 py-5 text-white text-3xl font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-white/20"
                                    placeholder="0"
                                    min={50}
                                    max={10000}
                                />
                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-lg font-medium">
                                    / hour
                                </span>
                            </div>
                            <p className="text-sm text-gray-400">
                                You&apos;ll receive{" "}
                                <span className="text-green-500 font-bold">
                                    85% (${calculateNetRate(hourlyRate)})
                                </span>{' '}
                                after each session. Platform fee: 15%
                            </p>
                        </div>
                    </div>

                    <NavigationButtons
                        onBack={handleBack}
                        onContinue={handleContinue}
                        continueText="Continue"
                        loading={loading}
                    />
                </form>
            </div>

        </>
    )
}
