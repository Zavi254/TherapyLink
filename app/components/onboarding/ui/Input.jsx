export function Input({ label, error, icon, className = "", ...props }) {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-sm font-medium text-white" htmlFor={props.id}>
                    {label}
                </label>
            )}
            <div className="relative">
                {icon && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {icon}
                    </span>
                )}
                <input
                    className={`w-full bg-[#131811] border ${error ? 'border-red-500' : 'border-[#2c3928]'
                        } rounded-lg px-4 py-3 ${icon ? 'pl-12' : ''
                        } text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-white/20 ${className}`}
                    {...props}
                />
            </div>
            {error && <span>{error}</span>}
        </div>
    )
}