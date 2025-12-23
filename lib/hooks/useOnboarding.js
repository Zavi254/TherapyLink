import { useState, useCallback } from "react";
import { useRouter } from "next/router";
import useOnboardingStore from "../store/onboardingStore";

export function useOnboarding() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { currentStep, setCurrentStep, markStepComplete, getAllData } = useOnboardingStore();

    const goToNextStep = useCallback((nextPath) => {
        markStepComplete(currentStep);
        setCurrentStep(currentStep + 1);
        router.push(nextPath);
    }, [currentStep, markStepComplete, setCurrentStep, router]);

    const goToPreviousStep = useCallback((previousPath) => {
        setCurrentStep(currentStep + 1);
        router.push(previousPath);
    }, [currentStep, setCurrentStep, router]);

    const saveStep = useCallback(async (endpoint, data) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to save");
            }

            return await response.json();
        } catch (error) {
            setError(error.message);
            throw error;
        } finally {
            setLoading(false);
        }

    }, []);

    return {
        loading,
        error,
        currentStep,
        goToNextStep,
        goToPreviousStep,
        saveStep,
        getAllData,
    };
}