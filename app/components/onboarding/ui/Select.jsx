import { LuChevronDown } from "react-icons/lu"

export function Select({ label, error, options = [], placeholder, className = "", ...props }) {
    return (
        <div className="flex flex-col gap-2">
            {label && (
                <label className="text-sm font-medium text-white" htmlFor={props.id}>
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    className={`w-full bg-[#131811] border ${error ? 'border-red-500' : 'border-[#2c3928]'
                        } rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer ${className}`}
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <LuChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {error && <span className="text-xs text-red-400">{error}</span>}
        </div>
    )
}