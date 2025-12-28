import { useState } from "react";
import { LuCloud } from "react-icons/lu";

export function FileUpload({
    label,
    accept = ".pdf,.jpg,.jpeg,.png",
    maxSize = 5,
    onFileSelect,
    currentFile,
    onFileRemove,
    error
}) {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        if (file.size > maxSize * 1024 * 1024) {
            alert(`File size must be less than ${maxSize}MB`);
            return;
        }
        onFileSelect(file);
    }

    return (
        <div>
            {label && <h3 className="text-lg font-bold text-white">{label}</h3>}

            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed ${dragActive ? 'border-blue-500/50' : error ? 'border-red-500' : 'border-[#2c3928]'
                    } hover:border-blue-500/50 transition-colors rounded-xl p-8 flex flex-col items-center justify-center text-center bg-[#131811] cursor-pointer group`}
            >
                <input
                    type="file"
                    onChange={handleChange}
                    accept={accept}
                    className="hidden"
                    id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer w-full">
                    <div className="size-12 rounded-full bg-[#1e271c] flex items-center justify-center mb-4 group-hover:bg-blue-500/10 transition-colors mx-auto">
                        {/* <LuCloud size={} /> */}
                        <span className="material-symbols-outlined text-gray-400 group-hover:text-blue-500 transition-colors text-2xl">
                            cloud_upload
                        </span>
                    </div>
                    <p className="text-white font-medium mb-1">
                        <span className="text-blue-500 hover:underline">Choose a file</span> or drag it here
                    </p>
                    <p className="text-xs text-gray-400">
                        {accept.replace(/\./g, '').toUpperCase()} (Max {maxSize}MB)
                    </p>
                </label>
            </div>

            {error && <span className="text-xs text-red-400">{error}</span>}

            {currentFile && (
                <div className="flex items-center justify-between p-3 bg-[#131811] rounded-lg border border-[#2c3928]">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded bg-red-500/10 flex items-center justify-center text-red-400">
                            <span className="material-symbols-outlined">picture_as_pdf</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm text-white font-medium">
                                {currentFile.name}
                            </span>
                            <span className="text-xs text-gray-400">
                                {(currentFile.size / 1024 / 1024).toFixed(2)} MB • Uploaded
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onFileRemove}
                        className="text-gray-400 hover:text-red-400 transition-colors p-2"
                        type="button"
                    >
                        <span className="material-symbols-outlined">delete</span>
                    </button>
                </div >
            )
            }

        </div >
    )
}