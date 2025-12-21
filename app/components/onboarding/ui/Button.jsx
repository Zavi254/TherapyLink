export function Button({
    children,
    variant = "primary",
    icon,
    iconPosition = "right",
    loading = false,
    className = "",
    ...props
}) {
    const variants = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20',
        secondary: 'border border-[#2c3928] hover:border-gray-400 text-gray-400 hover:text-white',
        outline: 'border border-blue-500/20 hover:border-blue-500 hover:bg-blue-500/10 text-blue-500',
    }

    return (
        <button
            disabled={loading}
            className={`font-bold py-3 px-8 rounded-full transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
            {...props}
        >
            {loading ? (
                <>
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                    Loading...
                </>
            ) : (
                <>
                    {icon && iconPosition === "left" && icon}
                    {children}
                    {icon && iconPosition === "right" && icon}
                </>
            )}
        </button>
    )
}