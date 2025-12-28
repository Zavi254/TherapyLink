"use client";

import { useState, useEffect, useRef } from "react";
import useOnboardingStore from "@/lib/store/onboardingStore";
import { useOnboarding } from "@/lib/hooks/useOnboarding";
import { useFormValidation } from "@/lib/hooks/useFormValidation";
import { credentialSchema } from "@/lib/validations/onboardingSchema";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { NavigationButtons } from "../shared/NavigationButtons";
import { UploadButton } from "@/lib/uploadthing";
import { LuAward, LuCloudUpload, LuFileText, LuLock, LuPlus, LuTrash2, LuUpload } from "react-icons/lu";

export default function CredentialsForm() {
    const { credentials, updateCredentials, addCertification, removeCertification, setCurrentStep } = useOnboardingStore();
    const { loading, saveStep, goToNextStep, goToPreviousStep } = useOnboarding();
    const { errors, validate, clearError } = useFormValidation(credentialSchema);

    const uploadButtonRef = useRef(null);
    const [uploadProgress, setUploadProgress] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [newCert, setNewCert] = useState({ name: "", organization: "" });

    useEffect(() => {
        setCurrentStep(2);
    }, [setCurrentStep]);

    const licenseTypeOptions = [
        { value: 'pt', label: 'Physical Therapist (PT)' },
        { value: 'ot', label: 'Occupational Therapist (OT)' },
        { value: 'slp', label: 'Speech-Language Pathologist' },
        { value: 'mhc', label: 'Mental Health Counselor' },
        { value: 'rd', label: 'Registered Dietitian' },
    ];

    const stateOptions = [
        { value: 'ca', label: 'California' },
        { value: 'ny', label: 'New York' },
        { value: 'tx', label: 'Texas' },
        { value: 'fl', label: 'Florida' },
        { value: 'il', label: 'Illinois' },
        { value: 'pa', label: 'Pennsylvania' },
        { value: 'oh', label: 'Ohio' },
        { value: 'ga', label: 'Georgia' },
        { value: 'nc', label: 'North Carolina' },
        { value: 'mi', label: 'Michigan' },
    ];

    const handleChange = (field, value) => {
        updateCredentials({ [field]: value });
        clearError(field);
    }

    const triggerUpload = () => {
        const input = uploadButtonRef.current?.querySelector('input[type="file"]');
        input?.click();
    }

    const handleAddCertification = () => {
        if (newCert.name.trim() && newCert.organization.trim()) {
            addCertification(newCert);
            setNewCert({ name: '', organization: '' });
        }
    };

    const handleContinue = async () => {
        if (!validate(credentials)) {
            return;
        }

        console.log("✅ Validation passed");

        try {
            await saveStep("/api/therapist/onboarding/credentials", credentials);
            goToNextStep("/therapist/onboarding/availability");
        } catch (error) {
            alert("Failed to save credentials. Please try again.");
        }
    }

    const handleBack = () => {
        goToPreviousStep("/therapist/onboarding/basic-info");
    }

    return (
        <>
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Verify Your Credentials</h1>
                <p className="text-gray-400">
                    Help patients trust your expertise by providing your license details.
                </p>
            </header>

            <div className="flex flex-col gap-8">
                <form className="flex flex-col gap-8" onSubmit={(e) => e.preventDefault()}>
                    {/* Professional license */}
                    <div className="bg-[#1e271c] border border-[#2c3928] rounded-2xl p-6 md:p-8 flex flex-col gap-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <LuAward className="text-blue-500" size={24} />
                            Professional License
                        </h3>

                        <div className="grid grid-cols-1 gap-6">
                            <Select
                                id="licenseType"
                                label={"License Type"}
                                placeholder={"Select Type"}
                                options={licenseTypeOptions}
                                value={credentials.licenseType}
                                onChange={(e) => handleChange("licenseType", e.target.value)}
                                error={errors.licenseType}
                            />
                            <Input
                                id="licenseNumber"
                                label="License Number"
                                placeholder="e.g. PT12345678"
                                value={credentials.licenseNumber}
                                onChange={(e) => handleChange('licenseNumber', e.target.value)}
                                error={errors.licenseNumber}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Select
                                id="licenseState"
                                label={"State / Region"}
                                placeholder={"Select State"}
                                options={stateOptions}
                                value={credentials.licenseState}
                                onChange={(e) => handleChange('licenseState', e.target.value)}
                                error={errors.licenseState}
                            />
                            <Input
                                id="expirationDate"
                                label={"Expiration Date"}
                                type="date"
                                value={credentials.expirationDate}
                                onChange={(e) => handleChange('expirationDate', e.target.value)}
                                error={errors.expirationDate}
                            />
                        </div>
                    </div>

                    {/* Upload License Document */}
                    <div className="bg-[#1e271c] border border-[#2c3928] rounded-2xl p-6 md:p-8 flex flex-col gap-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <LuUpload size={24} className="text-blue-500" />
                                    Upload License Document
                                </h3>
                                <p className="text-sm text-gray-400 mt-1">Please upload a clear copy of your state license.</p>
                            </div>
                            <div className="flex items-center gap-1 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                                <LuLock size={18} className="text-blue-500" />
                                <span className="text-xs font-bold text-blue-500">Secure Upload</span>
                            </div>
                        </div>

                        {!credentials.licenseDocumentUrl ? (
                            <div className="border-2 border-dashed border-[#2c3928] hover:border-blue-500/50 transition-colors rounded-xl p-8 flex flex-col items-center justify-center text-center bg-[#131811]">
                                <div className="size-12 rounded-full bg-[#1e271c] flex items-center justify-center mb-4">
                                    <LuCloudUpload size={32} className="text-gray-400" />
                                </div>
                                <button
                                    type="button"
                                    onClick={triggerUpload}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Choose File
                                </button>
                                <p className="text-xs text-gray-400 mt-3">PDF, JPG, PNG (Max 10MB)</p>

                                {isUploading && (
                                    <div className="flex items-center gap-2 mt-4">
                                        <div className="w-32 h-2 bg-[#2c3928] rounded overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 transition-all duration-300"
                                                style={{ width: `${uploadProgress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">
                                            {uploadProgress}%
                                        </span>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3 bg-[#131811] rounded-lg border border-[#2c3928]">
                                <div className="flex items-center gap-3">
                                    <div className="size-10 rounded bg-red-500/10 flex items-center justify-center text-red-400">
                                        <LuFileText size={24} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm text-white font-medium">License Document</span>
                                        <span className="text-xs text-gray-400">Uploaded</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleChange("licenseDocumentUrl", null)}
                                    className="text-gray-400 hover:text-red-400 transition-colors p-2"
                                    type="button"
                                >
                                    <LuTrash2 size={24} />
                                </button>
                            </div>
                        )}

                        {/* Hidden UploadThing Button */}
                        <div ref={uploadButtonRef} className="opacity-0 pointer-events-none absolute">
                            <UploadButton
                                endpoint={"licenseDocument"}
                                onUploadBegin={(filename) => {
                                    setIsUploading(true);
                                    setUploadProgress(0);
                                }}
                                onUploadProgress={(p) => setUploadProgress(p)}
                                onClientUploadComplete={(res) => {
                                    setUploadProgress(100);
                                    setTimeout(() => {
                                        setIsUploading(false);
                                        setUploadProgress(null);
                                    }, 500);
                                    if (res?.[0]) handleChange("licenseDocumentUrl", res[0].url);
                                }}
                                onUploadError={(error) => {
                                    setIsUploading(false);
                                    setUploadProgress(null);
                                    alert(`Upload failed: ${error.message}`);
                                }}
                            />
                        </div>

                        {errors.licenseDocumentUrl && (
                            <span className="text-xs text-red-400">{errors.licenseDocumentUrl}</span>
                        )}
                    </div>

                    {/* Additional Certifications */}
                    <div className="bg-[#1e271c] border border-[#2c3928] rounded-2xl p-6 md:p-8 flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">Additional Certifications</h3>
                            <span className="text-xs text-gray-400 uppercase tracking-wider font-bold">Optional</span>
                        </div>

                        {credentials.additionalCertifications.length > 0 && (
                            <div className="flex flex-col gap-3">
                                {credentials.additionalCertifications.map((cert, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 bg-[#131811] rounded-lg border border-[#2c3928]">
                                        <div className="flex flex-col">
                                            <span className="text-sm text-white font-medium">{cert.name}</span>
                                            <span className="text-xs text-gray-400">{cert.organization}</span>
                                        </div>
                                        <button
                                            onClick={() => removeCertification(index)}
                                            className="text-gray-400 hover:text-red-400 transition-colors p-2"
                                            type="button"
                                        >
                                            <LuTrash2 size={24} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    placeholder="Certification Name (e.g OCS)"
                                    value={newCert.name}
                                    onChange={(e) => setNewCert(prev => ({ ...prev, name: e.target.value }))}
                                />
                                <Input
                                    placeholder="Issuing Organization"
                                    value={newCert.organization}
                                    onChange={(e) => setNewCert(prev => ({ ...prev, organization: e.target.value }))}
                                />
                            </div>
                            <button
                                onClick={handleAddCertification}
                                className="flex items-center justify-center gap-2 py-3 border border-dashed border-[#2c3928] rounded-lg text-gray-400 hover:text-white hover:border-blue-500 transition-colors text-sm font-medium w-full"
                                type="button"
                            >
                                <LuPlus size={18} />
                                Add another certification
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 justify-center lg:justify-start">
                        <LuLock size={16} className="text-blue-500" />
                        <p className="text-xs text-gray-400">Your documents are encrypted and secure.</p>
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