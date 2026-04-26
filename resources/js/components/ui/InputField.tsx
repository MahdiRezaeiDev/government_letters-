import { AlertCircle } from 'lucide-react';

interface Props {
    icon?: React.ElementType;
    value: string;
    onChange: (v: string) => void;
    onBlur?: () => void;
    error?: string | null;
    placeholder?: string;
    type?: string;
    textarea?: boolean;
    rows?: number;
    readOnly?: boolean;
}

export default function InputField({
    icon: Icon, value, onChange, onBlur, error,
    placeholder, type = 'text', textarea = false, rows = 3, readOnly = false
}: Props) {
    const baseClass = `w-full ${Icon ? 'pr-10' : 'pr-4'} pl-4 py-3 text-sm bg-transparent focus:outline-none text-slate-700 placeholder-slate-300 ${readOnly ? 'cursor-not-allowed' : ''}`;
    const wrapClass = `relative flex items-start rounded-xl border transition-all duration-200 ${readOnly ? 'bg-slate-50' : 'bg-white'} ${error
            ? 'border-rose-300 ring-1 ring-rose-300'
            : readOnly
                ? 'border-slate-200'
                : 'border-slate-200 hover:border-slate-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100'
        }`;

    return (
        <div>
            <div className={wrapClass}>
                {Icon && (
                    <Icon className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-400 pointer-events-none flex-shrink-0" />
                )}
                {textarea ? (
                    <textarea
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        rows={rows}
                        readOnly={readOnly}
                        className={`${baseClass} resize-none leading-7 pt-3`}
                    />
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        readOnly={readOnly}
                        className={baseClass}
                    />
                )}
            </div>
            {error && (
                <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />{error}
                </p>
            )}
        </div>
    );
}