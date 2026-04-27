import { Info } from "lucide-react";

export default function SectionCard({ icon: Icon, iconColor, title, subtitle, description, children }: any) {
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="px-6 py-5 border-b border-slate-100 flex items-start gap-3.5 bg-gradient-to-l from-white to-slate-50/60">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: iconColor + '18' }}>
                    <Icon className="h-4 w-4" style={{ color: iconColor }} />
                </div>
                <div>
                    <h2 className="text-sm font-bold text-slate-800">{title}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
                    {description && (
                        <div className="mt-2 flex items-start gap-1.5 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
                            <Info className="h-3.5 w-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                            <span>{description}</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="p-6">{children}</div>
        </div>
    );
}