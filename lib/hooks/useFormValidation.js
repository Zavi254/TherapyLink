import { useState } from "react";

export function useFormValidation(schema) {
    const [errors, setErrors] = useState({});

    const validate = (data) => {
        try {
            schema.parse(data);
            setErrors({});
            return true;
        } catch (error) {
            const formattedErrors = {};

            // Zod uses 'issues' not 'errors'
            if (error.issues && Array.isArray(error.issues)) {
                error.issues.forEach((err) => {
                    formattedErrors[err.path[0]] = err.message;
                });
            }
            setErrors(formattedErrors);
            return false;
        }
    }

    const clearError = (field) => {
        setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        })
    };

    const clearAllErrors = () => {
        setErrors({});
    };

    return { errors, validate, clearError, clearAllErrors };
}