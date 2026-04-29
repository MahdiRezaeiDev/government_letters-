// resources/js/pages/organizations/show.tsx

import { Head, Link, router } from '@inertiajs/react';
import {
    Building2, Users, Mail, Phone, MapPin, Globe,
    Pencil, Trash2, Calendar, CheckCircle, AlertCircle,
    ChevronRight, ExternalLink, Layers, Hash,
    Database, Briefcase, Plus
} from 'lucide-react';
import { useState } from 'react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import departments from '@/routes/departments';
import organizations from '@/routes/organizations';
import type { Organization, Department } from '@/types';

interface Props {
    organization: Organization & { departments: Department[] };
    stats: {
        total_departments: number;
        total_users: number;
        active_departments: number;
        total_cases?: number;
        total_letters?: number;
    };
    can: {
        edit: boolean;
        delete: boolean;
    };
}

// ─── Config ────────────────────────────────────────────────────────────────

const DEPT_GRADIENTS = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#6366f1', '#ec4899',
];
const getDeptColor = (id: number) => DEPT_GRADIENTS[id % DEPT_GRADIENTS.length];

// ─── Sub-components ────────────────────────────────────────────────────────

function SectionCard({ icon: Icon, iconColor, title, subtitle, children, action }: {
    icon: React.ElementType; iconColor: string; title: string; subtitle?: string;
    children: React.ReactNode; action?: React.ReactNode;
}) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-3.5 bg-linear-to-l from-white to-slate-50/60">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: iconColor + '18' }}>
                    <Icon className="h-4 w-4" style={{ color: iconColor }} />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className="text-sm font-bold text-slate-800">{title}</h2>
                    {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
                </div>
                {action}
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}

function ContactItem({ icon: Icon, iconColor, label, children }: {
    icon: React.ElementType; iconColor: string; label: string; children: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: iconColor + '18' }}>
                <Icon className="h-4 w-4" style={{ color: iconColor }} />
            </div>
            <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
                <div className="text-sm font-semibold text-slate-700">{children}</div>
            </div>
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────

export default function OrganizationsShow({ organization, stats, can }: Props) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        setDeleting(true);
        router.delete(organizations.destroy({ organization: organization.id }), {
            onFinish: () => {
                setDeleting(false); setShowDeleteModal(false);
            },
        });
    };

    const isActive = organization.status === 'active';

    const statsCards = [
        { label: 'ریاست ها', value: stats.total_departments, icon: Layers, color: '#3b82f6' },
        { label: 'ریاست های فعال', value: stats.active_departments, icon: Briefcase, color: '#10b981' },
        { label: 'کارمندان', value: stats.total_users, icon: Users, color: '#8b5cf6' },
        { label: 'کتگوری ها', value: stats.total_cases ?? 0, icon: Database, color: '#f59e0b' },
    ];

    return (
        <>
            <Head title={organization.name} />

            <div className="min-h-screen">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="space-y-5">

                        {/* ── Identity Hero Card ── */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            {/* Status stripe */}
                            <div className="h-1.5" style={{ backgroundColor: isActive ? '#10b981' : '#94a3b8' }} />
                            <div className="px-6 py-6 flex items-start gap-5">
                                <div className="h-16 w-16 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600
                                    flex items-center justify-center shadow-lg shrink-0">
                                    <Building2 className="h-8 w-8 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <h1 className="text-xl font-black text-slate-900">{organization.name}</h1>
                                        <span className="inline-flex items-center gap-1 text-xs font-mono font-bold
                                            px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                                            <Hash className="h-3 w-3" />{organization.code}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
                                            <Calendar className="h-3 w-3 text-slate-400" />
                                            {new Date(organization.created_at).toLocaleDateString('fa-AF', {
                                                year: 'numeric', month: 'long', day: 'numeric'
                                            })}
                                        </span>
                                        {organization.parent && (
                                            <Link
                                                href={organizations.show({ organization: organization.parent.id })}
                                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700
                                                    bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition">
                                                <Building2 className="h-3 w-3" />
                                                زیر: {organization.parent.name}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 border-t border-slate-100">
                                {statsCards.map(stat => (
                                    <div key={stat.label} className="px-5 py-4 flex items-center gap-3">
                                        <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0"
                                            style={{ backgroundColor: stat.color + '18' }}>
                                            <stat.icon className="h-4 w-4" style={{ color: stat.color }} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 leading-none mb-1">{stat.label}</p>
                                            <p className="text-xl font-black text-slate-800 leading-none">
                                                {stat.value.toLocaleString('fa-IR')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Contact Info ── */}
                        {(organization.email || organization.phone || organization.address || organization.website) ? (
                            <SectionCard icon={Mail} iconColor="#0ea5e9" title="اطلاعات تماس" subtitle="راه‌های ارتباطی ریاست">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {organization.email && (
                                        <ContactItem icon={Mail} iconColor="#0ea5e9" label="ایمیل">
                                            <a href={`mailto:${organization.email}`}
                                                className="hover:text-sky-600 transition-colors">
                                                {organization.email}
                                            </a>
                                        </ContactItem>
                                    )}
                                    {organization.phone && (
                                        <ContactItem icon={Phone} iconColor="#10b981" label="تلفن">
                                            <a href={`tel:${organization.phone}`}
                                                className="hover:text-emerald-600 transition-colors">
                                                {organization.phone}
                                            </a>
                                        </ContactItem>
                                    )}
                                    {organization.address && (
                                        <div className="sm:col-span-2">
                                            <ContactItem icon={MapPin} iconColor="#ef4444" label="آدرس">
                                                {organization.address}
                                            </ContactItem>
                                        </div>
                                    )}
                                    {organization.website && (
                                        <div className="sm:col-span-2">
                                            <ContactItem icon={Globe} iconColor="#8b5cf6" label="وبسایت">
                                                <a href={organization.website} target="_blank" rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1.5 transition-colors">
                                                    {organization.website}
                                                    <ExternalLink className="h-3.5 w-3.5" />
                                                </a>
                                            </ContactItem>
                                        </div>
                                    )}
                                </div>
                            </SectionCard>
                        ) : null}

                        {/* ── Departments ── */}
                        <SectionCard
                            icon={Layers} iconColor="#3b82f6"
                            title="ریاست‌ها"
                            subtitle={`${organization.departments?.length ?? 0} ریاست زیرمجموعه`}
                            action={
                                <Link
                                    href={departments.create({ query: { organization_id: organization.id } })}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-600
                                        bg-blue-50 hover:bg-blue-100 rounded-xl transition-all"
                                >
                                    <Plus className="h-3.5 w-3.5" />
                                    افزودن
                                </Link>
                            }
                        >
                            {!organization.departments || organization.departments.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
                                        <Layers className="h-7 w-7 text-slate-300" />
                                    </div>
                                    <p className="text-sm font-semibold text-slate-500">هیچ دپارتمانی ثبت نشده</p>
                                    <p className="text-xs text-slate-400 mt-1 mb-4">اولین دپارتمان این ریاست را ایجاد کنید</p>
                                    <Link
                                        href={departments.create({ query: { organization_id: organization.id } })}
                                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white
                                            bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-md"
                                    >
                                        <Plus className="h-4 w-4" />
                                        افزودن دپارتمان
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {organization.departments.map(dept => {
                                        const deptColor = getDeptColor(dept.id);
                                        const deptActive = dept.status === 'active';

                                        return (
                                            <Link
                                                key={dept.id}
                                                href={departments.show(dept.id)}
                                                className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-blue-50/50
                                                    border border-transparent hover:border-blue-100 transition-all group"
                                            >
                                                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                                                    style={{ backgroundColor: deptColor + '18' }}>
                                                    <Building2 className="h-4.5 w-4.5" style={{ color: deptColor }} />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-800 truncate
                                                        group-hover:text-blue-700 transition-colors">
                                                        {dept.name}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-xs text-slate-400 font-mono">
                                                            {dept.code}
                                                        </span>
                                                        {dept.parent && (
                                                            <>
                                                                <span className="text-slate-200 text-xs">•</span>
                                                                <span className="text-xs text-slate-400">
                                                                    زیر: {dept.parent.name}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <span
                                                    className="flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full"
                                                    style={{
                                                        backgroundColor: deptActive ? '#dcfce7' : '#f1f5f9',
                                                        color: deptActive ? '#15803d' : '#64748b',
                                                    }}
                                                >
                                                    {deptActive ? 'فعال' : 'غیرفعال'}
                                                </span>

                                                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-400
                                                    flex-shrink-0 transition-colors" />
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </SectionCard>

                    </div>
                </div>
            </div>

            {showDeleteModal && (
                <DeleteConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDelete}
                    title="حذف ریاست"
                    message="آیا از حذف این ریاست اطمینان دارید؟"
                    itemName={organization.name}
                    isLoading={deleting}
                />
            )}
        </>
    );
}