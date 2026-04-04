import { useState, useRef, useEffect } from 'react';

interface Option {
    id: number;
    label: string;
    sublabel?: string;
}

interface Props {
    placeholder:  string;
    searchUrl:    string;
    value:        string;
    onChange:     (id: string, option: Option | null) => void;
    disabled?:    boolean;
}

export default function SearchSelect({ placeholder, searchUrl, value, onChange, disabled }: Props) {

    const [query,     setQuery]     = useState('');
    const [options,   setOptions]   = useState<Option[]>([]);
    const [loading,   setLoading]   = useState(false);
    const [open,      setOpen]      = useState(false);
    const [selected,  setSelected]  = useState<Option | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout>>();
    const containerRef = useRef<HTMLDivElement>(null);

    // بستن dropdown وقتی بیرون کلیک میشه
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    async function search(q: string) {
        if (!q.trim()) { setOptions([]); return; }
        setLoading(true);
        try {
            const res  = await fetch(`${searchUrl}?q=${encodeURIComponent(q)}`);
            const data = await res.json();
            setOptions(data);
        } finally {
            setLoading(false);
        }
    }

    function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
        const q = e.target.value;
        setQuery(q);
        setOpen(true);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => search(q), 300);
    }

    function handleSelect(option: Option) {
        setSelected(option);
        setQuery(option.label);
        setOpen(false);
        onChange(option.id.toString(), option);
    }

    function handleClear() {
        setSelected(null);
        setQuery('');
        setOptions([]);
        onChange('', null);
    }

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={handleInput}
                    onFocus={() => { setOpen(true); if (query) search(query); }}
                    placeholder={placeholder}
                    disabled={disabled}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm pr-8 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                />
                {/* دکمه پاک کردن */}
                {selected && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* dropdown */}
            {open && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {loading ? (
                        <div className="px-3 py-2 text-xs text-gray-400">در حال جستجو...</div>
                    ) : options.length === 0 && query ? (
                        <div className="px-3 py-2 text-xs text-gray-400">نتیجه‌ای یافت نشد</div>
                    ) : (
                        options.map(opt => (
                            <button
                                key={opt.id}
                                type="button"
                                onClick={() => handleSelect(opt)}
                                className="w-full text-right px-3 py-2 hover:bg-blue-50 text-sm transition-colors"
                            >
                                <span className="font-medium text-gray-800">{opt.label}</span>
                                {opt.sublabel && (
                                    <span className="text-xs text-gray-400 mr-2">{opt.sublabel}</span>
                                )}
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}