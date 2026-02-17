type AuthInputProps = {
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
};

function AuthInput({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
    className = "",
}: AuthInputProps) {
    return (
        <div className={className}>
            <label className="block text-xs mb-1.5 text-slate-900">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900/40"
                placeholder={placeholder}
            />
        </div>
    );
}

export default AuthInput;