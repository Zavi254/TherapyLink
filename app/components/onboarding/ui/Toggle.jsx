export function Toggle({ enabled, onChange, label }) {
    return (
        <div className="flex items-center justify-between">
            {label && <span className="font-bold text-white">{label}</span>}
            <button
                type="button"
                onClick={() => onChange(!enabled)}
                className={`${enabled ? 'bg-green-500' : 'bg-gray-700'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer`}
            >
                <span
                    className={`${enabled ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
            </button>
        </div>
    )
}