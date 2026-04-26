interface Props {
    children: React.ReactNode;
    required?: boolean;
}

export default function FieldLabel({ children, required }: Props) {
    return (
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {children}
            {required && <span className="text-rose-400 mr-1">*</span>}
        </label>
    );
}