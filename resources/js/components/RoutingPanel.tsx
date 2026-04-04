import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import SearchSelect from '@/Components/SearchSelect';

interface Position { id: number; name: string; department: { name: string }; }
interface User { id: number; first_name: string; last_name: string; activePosition: { name: string } | null; }
interface Routing {
    id: number; action_type: 'action' | 'approval' | 'information' | 'sign' | 'coordination';
    instruction: string | null; deadline: string | null;
    status: 'pending' | 'in_progress' | 'completed' | 'rejected';
    step_order: number; completed_note: string | null; completed_at: string | null;
    toUser: User | null; toPosition: Position | null; fromUser: User | null;
}

interface Props { letterId: number; routings: Routing[]; positions: Position[]; users: User[]; storeUrl: string; }

const ACTION_LABEL = { action: 'اقدام', approval: 'تأیید', information: 'اطلاع', sign: 'امضا', coordination: 'هماهنگی' };
const STATUS_COLOR = { pending: 'bg-yellow-100 text-yellow-700', in_progress: 'bg-blue-100 text-blue-700', completed: 'bg-green-100 text-green-700', rejected: 'bg-red-100 text-red-700' };
const STATUS_LABEL = { pending: 'در انتظار', in_progress: 'در جریان', completed: 'تکمیل شد', rejected: 'رد شد' };

function ActionButtons({ routing }: { routing: Routing }) {
    const { data, setData, post, processing } = useForm({ action_type: 'complete' as 'complete' | 'reject' | 'forward', description: '' });
    const [showActions, setShowActions] = useState(false);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/routings/${routing.id}/action`, { onSuccess: () => setShowActions(false) });
    }

    if (showActions) {
        return (
            <form onSubmit={handleSubmit} className="mt-2 space-y-2">
                <textarea value={data.description} onChange={e => setData('description', e.target.value)}
                    placeholder="توضیح (اختیاری)..." rows={2}
                    className="w-full border border-gray-300 rounded px-2 py-1.5 text-xs" />
                <div className="flex gap-2">
                    <button type="submit" disabled={processing} className="flex-1 bg-green-600 text-white py-1.5 rounded text-xs">تأیید</button>
                    <button type="button" onClick={() => setShowActions(false)} className="flex-1 bg-gray-100 text-gray-600 py-1.5 rounded text-xs">انصراف</button>
                </div>
            </form>
        );
    }

    return (
        <div className="flex gap-2 mt-2">
            <button onClick={() => { setData('action_type', 'complete'); setShowActions(true); }}
                className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200">تکمیل</button>
            <button onClick={() => { setData('action_type', 'reject'); setShowActions(true); }}
                className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200">رد</button>
        </div>
    );
}

export default function RoutingPanel({ letterId, routings, positions, users, storeUrl }: Props) {

    const [showForm, setShowForm] = useState(false);
    const [recipientType, setRecipientType] = useState<'position' | 'user'>('position');

    const { data, setData, post, processing, reset } = useForm({
        to_position_id: '', to_user_id: '',
        action_type: 'action' as keyof typeof ACTION_LABEL,
        instruction: '', deadline: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(storeUrl, { onSuccess: () => { reset(); setShowForm(false); } });
    }

    return (
        <div className="space-y-4">
            {routings.length > 0 && (
                <div className="space-y-3">
                    {routings.map((routing, index) => (
                        <div key={routing.id} className="flex gap-3">
                            <div className="flex flex-col items-center">
                                <div className={`w-3 h-3 rounded-full mt-1 ${routing.status === 'completed' ? 'bg-green-500' : routing.status === 'rejected' ? 'bg-red-500' : routing.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                                {index < routings.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-1" />}
                            </div>
                            <div className="flex-1 bg-gray-50 rounded-lg p-3 mb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex gap-2 mb-1">
                                            <span className="text-xs font-medium text-gray-700">
                                                {routing.toUser ? `${routing.toUser.first_name} ${routing.toUser.last_name}` : routing.toPosition?.name ?? '---'}
                                            </span>
                                            <span className="text-xs bg-blue-100 text-blue-700 px-1.5 rounded">{ACTION_LABEL[routing.action_type]}</span>
                                        </div>
                                        {routing.instruction && <p className="text-xs text-gray-500">{routing.instruction}</p>}
                                        {routing.completed_note && <p className="text-xs text-gray-600 mt-1 italic">پاسخ: {routing.completed_note}</p>}
                                    </div>
                                    <div className="text-left">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLOR[routing.status]}`}>{STATUS_LABEL[routing.status]}</span>
                                        {routing.deadline && <p className="text-xs text-gray-400 mt-1">مهلت: {routing.deadline}</p>}
                                    </div>
                                </div>
                                {routing.status === 'pending' && <ActionButtons routing={routing} />}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!showForm ? (
                <button onClick={() => setShowForm(true)}
                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-600 transition-colors">
                    + ارجاع به ...
                </button>
            ) : (
                <form onSubmit={handleSubmit} className="bg-blue-50 rounded-lg p-4 space-y-3">
                    <h3 className="text-sm font-semibold text-gray-700">ارجاع جدید</h3>
                    <div className="flex gap-2">
                        {(['position', 'user'] as const).map(type => (
                            <button key={type} type="button" onClick={() => setRecipientType(type)}
                                className={`flex-1 py-1.5 rounded text-xs font-medium ${recipientType === type ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}>
                                {type === 'position' ? 'بر اساس سمت' : 'بر اساس شخص'}
                            </button>
                        ))}
                    </div>
                   {recipientType === 'position' ? (
                        <SearchSelect
                            placeholder="جستجوی سمت..."
                            searchUrl="/api/positions/search"
                            value={data.to_position_id}
                            onChange={(id, opt) => {
                                setData('to_position_id', id);
                            }}
                        />
                    ) : (
                        <SearchSelect
                            placeholder="جستجوی نام یا نام کاربری..."
                            searchUrl="/api/users/search"
                            value={data.to_user_id}
                            onChange={(id, opt) => {
                                setData('to_user_id', id);
                            }}
                        />
                    )}
                    <select value={data.action_type} onChange={e => setData('action_type', e.target.value as typeof data.action_type)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
                        {Object.entries(ACTION_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <textarea value={data.instruction} onChange={e => setData('instruction', e.target.value)}
                        placeholder="دستور یا توضیح..." rows={2}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                    <input type="date" value={data.deadline} onChange={e => setData('deadline', e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
                    <div className="flex gap-2">
                        <button type="submit" disabled={processing}
                            className="flex-1 bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700 disabled:opacity-50">
                            {processing ? 'در حال ارجاع...' : 'ارجاع'}
                        </button>
                        <button type="button" onClick={() => { reset(); setShowForm(false); }}
                            className="flex-1 bg-white text-gray-600 py-2 rounded text-sm hover:bg-gray-100">انصراف</button>
                    </div>
                </form>
            )}
        </div>
    );
}
