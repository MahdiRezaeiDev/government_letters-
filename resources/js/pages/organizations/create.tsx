import { Head, router } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import {
    Save, X, Building2, Mail, Phone, MapPin, Globe,
    Link2, ChevronDown, CheckCircle, AlertCircle, Hash, RefreshCw
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import persianJs from 'persianjs';
import organizationsRoute from '@/routes/organizations';
import type { Organization } from '@/types';

interface Props {
    organizations: Organization[];
}

// ─── Utility Functions ─────────────────────────────────────────────────────

const generateOrgCode = (persianName: string): string => {
    if (!persianName) return '';
    
    // لیست کلمات کلیدی و معادل انگلیسی آنها
    const keywords: Record<string, string> = {
        'وزارت': 'MO',
        'سازمان': 'ORG',
        'شرکت': 'CO',
        'موسسه': 'INS',
        'بانک': 'BANK',
        'دانشگاه': 'UNI',
        'بیمه': 'INS',
        'صندوق': 'FUND',
        'ستاد': 'HQ',
        'مرکز': 'CENTER',
        'پژوهشکده': 'RSCH',
        'پژوهشگاه': 'RSCH',
        'اداره': 'ADMIN',
        'کل': 'GEN',
        'امور': 'AFFAIRS',
        'مالی': 'FIN',
        'اقتصاد': 'ECON',
        'دارایی': 'FIN',
        'برنامه': 'PLAN',
        'بودجه': 'BUDGET',
        'فناوری': 'TECH',
        'اطلاعات': 'INFO',
        'ارتباطات': 'COMM',
        'صنعت': 'IND',
        'معدن': 'MINE',
        'تجارت': 'TRADE',
        'کشاورزی': 'AGRI',
        'نفت': 'OIL',
        'گاز': 'GAS',
        'نیرو': 'POWER',
        'آب': 'WATER',
        'راه': 'ROAD',
        'مسکن': 'HOUSE',
        'شهرسازی': 'URBAN',
        'کشور': 'INTERIOR',
        'خارجه': 'FOREIGN',
        'دفاع': 'DEFENSE',
        'دادگستری': 'JUSTICE',
        'بهداشت': 'HEALTH',
        'درمان': 'MED',
        'آموزش': 'EDU',
        'پرورش': 'EDU',
        'علوم': 'SCI',
        'تحقیقات': 'RES',
        'فرهنگ': 'CULTURE',
        'ارشاد': 'GUIDE',
        'اسلامی': 'ISLAMIC',
        'کار': 'LABOR',
        'رفاه': 'WELFARE',
        'اجتماعی': 'SOCIAL',
        'ورزش': 'SPORT',
        'جوانان': 'YOUTH',
        'میراث': 'HERITAGE',
        'گردشگری': 'TOURISM',
        'محیط': 'ENV',
        'زیست': 'ENV',
        'داخلی': 'INTERNAL',
        'خارجی': 'EXTERNAL',
        'عمومی': 'PUBLIC',
        'خصوصی': 'PRIVATE',
        'دولتی': 'GOV',
        'ملی': 'NATIONAL',
        'استانی': 'PROVINCE',
        'شهرستانی': 'COUNTY',
    };
    
    try {
        // تبدیل اعداد فارسی به انگلیسی و حذف کاراکترهای خاص
        let processedName = persianJs(persianName)
            .toEnglishNumber()
            .arabicChar()
            .toString();
        
        // جستجوی کلمات کلیدی در نام
        let prefix = '';
        let remainingName = processedName;
        
        for (const [persian, english] of Object.entries(keywords)) {
            if (persianName.includes(persian)) {
                if (!prefix) {
                    prefix = english;
                }
                // حذف کلمه کلیدی از نام
                remainingName = remainingName.replace(new RegExp(persian, 'g'), '');
            }
        }
        
        // اگر پیشوندی پیدا نشد، از پیشوند پیش‌فرض استفاده کن
        if (!prefix) {
            prefix = 'ORG';
        }
        
        // تبدیل حروف فارسی باقیمانده به انگلیسی
        const persianToEnglishMap: Record<string, string> = {
            'ا': 'A', 'آ': 'A', 'ب': 'B', 'پ': 'P', 'ت': 'T', 'ث': 'S',
            'ج': 'J', 'چ': 'CH', 'ح': 'H', 'خ': 'KH', 'د': 'D',
            'ذ': 'Z', 'ر': 'R', 'ز': 'Z', 'ژ': 'ZH', 'س': 'S',
            'ش': 'SH', 'ص': 'S', 'ض': 'Z', 'ط': 'T', 'ظ': 'Z',
            'ع': 'A', 'غ': 'GH', 'ف': 'F', 'ق': 'GH', 'ک': 'K',
            'گ': 'G', 'ل': 'L', 'م': 'M', 'ن': 'N', 'و': 'V',
            'ه': 'H', 'ی': 'Y', 'ئ': 'E', 'ء': ''
        };
        
        let englishName = '';
        for (const char of remainingName.trim()) {
            englishName += persianToEnglishMap[char] || char;
        }
        
        // پاکسازی نهایی
        const cleanName = englishName
            .replace(/[^A-Z0-9]/g, '') // فقط حروف بزرگ و اعداد
            .replace(/\s+/g, '')
            .trim();
        
        // ترکیب پیشوند و نام
        const finalCode = cleanName 
            ? `${prefix}-${cleanName}`
            : prefix;
        
        // محدودیت طول و حذف خط تیره اضافی
        return finalCode
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
            .toUpperCase()
            .slice(0, 20);
            
    } catch (error) {
        console.error('Error generating org code:', error);
        // در صورت خطا، یک کد پیش‌فرض برگردان
        return `ORG-${Date.now().toString().slice(-6)}`;
    }
};

// ─── Shared Field Components ───────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
    return (
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {children}
            {required && <span className="text-rose-400 mr-1">*</span>}
        </label>
    );
}

function InputField({
    icon: Icon, value, onChange, onBlur, error, placeholder, type = 'text', textarea = false, rows = 3, readOnly = false
}: {
    icon?: React.ElementType; value: string; onChange: (v: string) => void;
    onBlur?: () => void; error?: string | null; placeholder?: string;
    type?: string; textarea?: boolean; rows?: number; readOnly?: boolean;
}) {
    const baseClass = `w-full ${Icon ? 'pr-10' : 'pr-4'} pl-4 py-3 text-sm bg-transparent focus:outline-none text-slate-700 placeholder-slate-300 ${
        readOnly ? 'bg-slate-50 cursor-not-allowed' : ''
    }`;
    const wrapClass = `relative flex items-start rounded-xl border transition-all duration-200 ${
        readOnly ? 'bg-slate-50' : 'bg-white'
    } ${
        error
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
                    <AlertCircle className="h-3 w-3 flex-shrink-0" />{error}
                </p>
            )}
        </div>
    );
}

function SelectField({
    icon: Icon, value, onChange, children, error
}: {
    icon?: React.ElementType; value: string; onChange: (v: string) => void;
    children: React.ReactNode; error?: string | null;
}) {
    return (
        <div>
            <div className={`relative flex items-center rounded-xl border bg-white transition-all duration-200 ${
                error
                    ? 'border-rose-300 ring-1 ring-rose-300'
                    : 'border-slate-200 hover:border-slate-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100'
            }`}>
                {Icon && <Icon className="absolute right-3.5 h-4 w-4 text-slate-400 pointer-events-none" />}
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    className={`w-full ${Icon ? 'pr-10' : 'pr-4'} pl-9 py-3 text-sm bg-transparent focus:outline-none appearance-none text-slate-700`}
                >
                    {children}
                </select>
                <ChevronDown className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            </div>
            {error && (
                <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />{error}
                </p>
            )}
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function OrganizationsCreate({ organizations }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        code: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        parent_id: '',
        status: 'active',
    });

    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [autoGenerateCode, setAutoGenerateCode] = useState(true);

    // تولید خودکار کد هنگام تغییر نام
    useEffect(() => {
        if (autoGenerateCode && data.name) {
            const generatedCode = generateOrgCode(data.name);
            setData('code', generatedCode);
        }
    }, [data.name, autoGenerateCode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(organizationsRoute.store());
    };

    const handleBlur = (field: string) => setTouched(prev => ({ ...prev, [field]: true }));
    const getFieldError = (field: string) => touched[field] && errors[field] ? errors[field] : null;

    const handleNameChange = (value: string) => {
        setData('name', value);
        // اگر کاربر شروع به تایپ کرد، حالت autoGenerate را روشن نگه دار
        setAutoGenerateCode(true);
    };

    const handleCodeChange = (value: string) => {
        setData('code', value);
        // اگر کاربر دستی کد را تغییر داد، autoGenerate را غیرفعال کن
        if (value !== generateOrgCode(data.name)) {
            setAutoGenerateCode(false);
        }
    };

    const handleRegenerateCode = () => {
        if (data.name) {
            const generatedCode = generateOrgCode(data.name);
            setData('code', generatedCode);
            setAutoGenerateCode(true);
        }
    };

    const statusOptions = [
        {
            value: 'active',
            label: 'فعال',
            desc: 'سازمان فعال و قابل استفاده است',
            icon: CheckCircle,
            color: '#10b981',
            bg: '#d1fae5',
            ring: '#6ee7b7',
        },
        {
            value: 'inactive',
            label: 'غیرفعال',
            desc: 'سازمان غیرفعال و در دسترس نیست',
            icon: AlertCircle,
            color: '#94a3b8',
            bg: '#f1f5f9',
            ring: '#cbd5e1',
        },
    ];

    return (
        <>
            <Head title="ایجاد سازمان جدید" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@300;400;500;600;700;800&display=swap');
                * { font-family: 'Vazirmatn', sans-serif; }
                :root { direction: rtl; }
            `}</style>

            <div className="min-h-screen bg-slate-50/70" dir="rtl">

                {/* ── Sticky Top Bar ── */}
                <div className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 tracking-wide">
                                    سازمان‌ها
                                </span>
                                <span className="text-slate-300 text-lg font-light">/</span>
                                <h1 className="text-sm font-bold text-slate-800">ایجاد سازمان جدید</h1>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => router.get(organizationsRoute.index())}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all duration-200"
                                >
                                    <X className="h-4 w-4" />
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    form="org-form"
                                    disabled={processing}
                                    className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'در حال ذخیره...' : 'ایجاد سازمان'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Page Body ── */}
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <form id="org-form" onSubmit={handleSubmit}>
                        <div className="space-y-5">

                            {/* ── Hero intro strip ── */}
                            <div className="rounded-2xl border border-blue-100 bg-gradient-to-l from-blue-50 to-indigo-50 px-6 py-5 flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg flex-shrink-0">
                                    <Building2 className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">ایجاد سازمان جدید</p>
                                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                        اطلاعات سازمان را در فرم زیر وارد کنید. فیلدهای ستاره‌دار الزامی هستند.
                                    </p>
                                </div>
                            </div>

                            {/* ── Basic Info ── */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3.5 bg-gradient-to-l from-white to-slate-50/60">
                                    <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                                        <Building2 className="h-4 w-4 text-blue-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-800">اطلاعات پایه</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">مشخصات اصلی سازمان</p>
                                    </div>
                                </div>

                                <div className="p-6 space-y-5">
                                    {/* Name + Code */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <FieldLabel required>نام سازمان</FieldLabel>
                                            <InputField
                                                icon={Building2}
                                                value={data.name}
                                                onChange={handleNameChange}
                                                onBlur={() => handleBlur('name')}
                                                error={getFieldError('name')}
                                                placeholder="مثال: وزارت اقتصاد و دارایی"
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel required>کد سازمان</FieldLabel>
                                            <div className="relative">
                                                <InputField
                                                    icon={Hash}
                                                    value={data.code}
                                                    onChange={handleCodeChange}
                                                    onBlur={() => handleBlur('code')}
                                                    error={getFieldError('code')}
                                                    placeholder="مثال: MO-ECON-FIN"
                                                />
                                                {data.name && (
                                                    <button
                                                        type="button"
                                                        onClick={handleRegenerateCode}
                                                        className="absolute left-3 top-3 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                                                        title="تولید مجدد کد از نام سازمان"
                                                    >
                                                        <RefreshCw className="h-3.5 w-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                            {autoGenerateCode && data.name && (
                                                <p className="text-xs text-slate-400 mt-1.5 flex items-center gap-1">
                                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                                    کد به صورت خودکار از نام سازمان تولید می‌شود
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-slate-100" />

                                    {/* Email + Phone */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <FieldLabel>ایمیل</FieldLabel>
                                            <InputField
                                                icon={Mail}
                                                type="email"
                                                value={data.email}
                                                onChange={v => setData('email', v)}
                                                placeholder="info@organization.com"
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel>تلفن</FieldLabel>
                                            <InputField
                                                icon={Phone}
                                                value={data.phone}
                                                onChange={v => setData('phone', v)}
                                                placeholder="021-12345678"
                                            />
                                        </div>
                                    </div>

                                    {/* Address */}
                                    <div>
                                        <FieldLabel>آدرس</FieldLabel>
                                        <InputField
                                            icon={MapPin}
                                            value={data.address}
                                            onChange={v => setData('address', v)}
                                            placeholder="آدرس کامل سازمان..."
                                            textarea
                                            rows={3}
                                        />
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-slate-100" />

                                    {/* Website + Parent */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <div>
                                            <FieldLabel>وبسایت</FieldLabel>
                                            <InputField
                                                icon={Globe}
                                                type="url"
                                                value={data.website}
                                                onChange={v => setData('website', v)}
                                                placeholder="https://www.example.com"
                                            />
                                        </div>
                                        <div>
                                            <FieldLabel>سازمان والد</FieldLabel>
                                            <SelectField
                                                icon={Link2}
                                                value={data.parent_id}
                                                onChange={v => setData('parent_id', v)}
                                            >
                                                <option value="">بدون والد</option>
                                                {organizations.map(org => (
                                                    <option key={org.id} value={org.id}>{org.name}</option>
                                                ))}
                                            </SelectField>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ── Status ── */}
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                                <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3.5 bg-gradient-to-l from-white to-slate-50/60">
                                    <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h2 className="text-sm font-bold text-slate-800">وضعیت سازمان</h2>
                                        <p className="text-xs text-slate-400 mt-0.5">وضعیت فعال یا غیرفعال بودن سازمان را تعیین کنید</p>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {statusOptions.map(opt => {
                                            const Icon = opt.icon;
                                            const isSelected = data.status === opt.value;
                                            
                                            return (
                                                <button
                                                    key={opt.value}
                                                    type="button"
                                                    onClick={() => setData('status', opt.value)}
                                                    style={isSelected ? {
                                                        borderColor: opt.ring,
                                                        backgroundColor: opt.bg,
                                                        boxShadow: `0 0 0 3px ${opt.bg}`,
                                                    } : {}}
                                                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-right focus:outline-none ${
                                                        isSelected
                                                            ? 'border-transparent'
                                                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                                            style={{ backgroundColor: isSelected ? opt.color + '22' : '#f1f5f9' }}
                                                        >
                                                            <Icon
                                                                className="h-5 w-5"
                                                                style={{ color: isSelected ? opt.color : '#94a3b8' }}
                                                            />
                                                        </div>
                                                        <div className="flex-1 text-right">
                                                            <p className="text-sm font-bold" style={{ color: isSelected ? opt.color : '#334155' }}>
                                                                {opt.label}
                                                            </p>
                                                            <p className="text-xs mt-0.5 text-slate-500">{opt.desc}</p>
                                                        </div>
                                                        {isSelected && (
                                                            <div
                                                                className="h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0"
                                                                style={{ backgroundColor: opt.color }}
                                                            >
                                                                <CheckCircle className="h-3.5 w-3.5 text-white" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* ── Mobile Actions ── */}
                            <div className="flex gap-3 sm:hidden pb-4">
                                <button
                                    type="button"
                                    onClick={() => router.get(organizationsRoute.index())}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all"
                                >
                                    <X className="h-4 w-4" />
                                    انصراف
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md disabled:opacity-50"
                                >
                                    <Save className="h-4 w-4" />
                                    {processing ? 'در حال ذخیره...' : 'ایجاد سازمان'}
                                </button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}