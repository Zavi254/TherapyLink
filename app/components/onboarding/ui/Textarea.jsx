export function TextArea({ label, error, maxLength, showCount = true, value = "", className = "", ...props }) {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-sm font-medium text-white" htmlFor={props.id}>
                    {label}
                </label>
            )}
            <textarea
                value={value}
                className={`w-full bg-[#131811] border ${error ? 'border-red-500' : 'border-[#2c3928]'
                    } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none placeholder:text-white/20 ${className}`}
                {...props}
            />
            <div className="flex justify-between items-center">
                {error && <span className="text-xs text-red-400">{error}</span>}
                {showCount && maxLength && (
                    <span className="text-xs text-gray-400 ml-auto">
                        {value.length}/{maxLength} characters
                    </span>
                )}
            </div>
        </div>
    )
}