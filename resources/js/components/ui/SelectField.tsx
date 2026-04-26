import { AlertCircle } from 'lucide-react';

interface Props {
    icon?: React.ElementType;
    value: string | number;
    onChange: (v: string) => void;
    onBlur?: () => void;
    error?: string | null;
    children: React.ReactNode;
}

export default function SelectField({ icon: Icon, value, onChange, onBlur, error, children }: Props) {
    return (
        <div className="group">
            <div className={`relative flex items-center rounded-xl border transition-all duration-200 bg-white ${error
                    ? 'border-rose-300 ring-1 ring-rose-300'
                    : 'border-slate-200 hover:border-slate-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100'
                }`}>
                {Icon && (
                    <Icon className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
                )}
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    onBlur={onBlur}
                    className={`w-full ${Icon ? 'pr-10' : 'pr-4'} pl-9 py-3 text-sm bg-transparent focus:outline-none appearance-none text-slate-700`}
                >
                    {children}
                </select>
                <svg className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            {error && (
                <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />{error}
                </p>
            )}
        </div>
    );
}