import { Head, Link, router } from '@inertiajs/react';
import AttachmentUploader from '@/Components/AttachmentUploader';
import RoutingPanel from '@/Components/RoutingPanel';
import * as letters from '@/routes/letters';

interface Attachment {
    id: number; file_name: string; file_size: number;
    extension: string; uploader_name: string; created_at: string; download_count: number;
}

interface Routing {
    id: number;
    action_type: 'action' | 'approval' | 'information' | 'sign' | 'coordination';
    status: 'pending' | 'in_progress' | 'completed' | 'rejected';
    instruction: string | null; deadline: string | null; completed_note: string | null;
    step_order: number;
    toUser: { first_name: string; last_name: string } | null;
    toPosition: { name: string } | null;
    fromUser: { first_name: string; last_name: string } | null;
}

interface Letter {
    id: number; letter_number: string | null; tracking_number: string | null;
    letter_type: 'incoming' | 'outgoing' | 'internal';
    subject: string; summary: string | null; content: string | null;
    priority: 'low' | 'normal' | 'high' | 'urgent' | 'very_urgent';
    security_level: string;
    final_status: 'draft' | 'pending' | 'approved' | 'rejected' | 'archived';
    date: string; due_date: string | null;
    sender_name: string | null; sender_position: string | null;
    recipient_name: string | null; recipient_position: string | null;
    category: { name: string } | null;
    creator: { first_name: string; last_name: string } | null;
    attachments: Attachment[];
    routings: Routing[];
}

interface Position { id: number; name: string; department: { name: string }; }
interface User { id: number; first_name: string; last_name: string; activePosition: { name: string } | null; }

interface Props {
    letter: Letter; uploadUrl: string; storeRoutingUrl: string;
    positions: Position[]; users: User[];
}

const PRIORITY_COLOR: Record<Letter['priority'], string> = {
    low: 'bg-gray-100 text-gray-600', normal: 'bg-blue-100 text-blue-600',
    high: 'bg-yellow-100 text-yellow-600', urgent: 'bg-orange-100 text-orange-600',
    very_urgent: 'bg-red-100 text-red-600',
};

const PRIORITY_LABEL: Record<Letter['priority'], string> = {
    low: 'کم', normal: 'عادی', high: 'مهم', urgent: 'فوری', very_urgent: 'خیلی فوری',
};

const STATUS_COLOR: Record<Letter['final_status'], string> = {
    draft: 'bg-gray-100 text-gray-600', pending: 'bg-yellow-100 text-yellow-600',
    approved: 'bg-green-100 text-green-600', rejected: 'bg-red-100 text-red-600',
    archived: 'bg-purple-100 text-purple-600',
};

const STATUS_LABEL: Record<Letter['final_status'], string> = {
    draft: 'پیش‌نویس', pending: 'در انتظار تأیید', approved: 'تأیید شده',
    rejected: 'رد شده', archived: 'بایگانی',
};

const TYPE_LABEL: Record<Letter['letter_type'], string> = {
    incoming: 'وارده', outgoing: 'صادره', internal: 'داخلی',
};

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function Show({ letter, uploadUrl, storeRoutingUrl, positions, users }: Props) {

    function handleDelete() {
        if (confirm('آیا مطمئن هستید؟')) {
            router.delete(letters.destroy(letter.id).url);
        }
    }

    return (
        <>
            <Head title={letter.subject} />
            <div className="p-6 max-w-4xl mx-auto space-y-6">

                {/* هدر */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 mb-2">{letter.subject}</h1>
                            <div className="flex gap-2 flex-wrap">
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{TYPE_LABEL[letter.letter_type]}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${PRIORITY_COLOR[letter.priority]}`}>{PRIORITY_LABEL[letter.priority]}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLOR[letter.final_status]}`}>{STATUS_LABEL[letter.final_status]}</span>
                                {letter.category && <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full">{letter.category.name}</span>}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {letter.final_status === 'draft' && (
                                <>
                                    <Link href={letters.edit(letter.id).url} className="bg-yellow-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-yellow-600">ویرایش</Link>
                                    <button onClick={handleDelete} className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600">حذف</button>
                                </>
                            )}
                            <Link href={letters.index().url} className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-200">بازگشت</Link>
                        </div>
                    </div>
                </div>

                {/* اطلاعات */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-sm font-semibold text-gray-500 mb-4 border-b pb-2">اطلاعات نامه</h2>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-500">شماره نامه:</span><span className="mr-2 font-medium">{letter.letter_number ?? '---'}</span></div>
                        <div><span className="text-gray-500">شماره پیگیری:</span><span className="mr-2 font-medium">{letter.tracking_number ?? '---'}</span></div>
                        <div><span className="text-gray-500">تاریخ:</span><span className="mr-2 font-medium">{letter.date}</span></div>
                        <div><span className="text-gray-500">مهلت اقدام:</span><span className="mr-2 font-medium">{letter.due_date ?? '---'}</span></div>
                        <div>
                            <span className="text-gray-500">فرستنده:</span>
                            <span className="mr-2 font-medium">{letter.sender_name ?? '---'}
                                {letter.sender_position && <span className="text-gray-400 text-xs mr-1">({letter.sender_position})</span>}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500">گیرنده:</span>
                            <span className="mr-2 font-medium">{letter.recipient_name ?? '---'}
                                {letter.recipient_position && <span className="text-gray-400 text-xs mr-1">({letter.recipient_position})</span>}
                            </span>
                        </div>
                        <div>
                            <span className="text-gray-500">ثبت‌کننده:</span>
                            <span className="mr-2 font-medium">
                                {letter.creator ? `${letter.creator.first_name} ${letter.creator.last_name}` : '---'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* خلاصه */}
                {letter.summary && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-sm font-semibold text-gray-500 mb-3 border-b pb-2">خلاصه</h2>
                        <p className="text-sm text-gray-700 leading-7">{letter.summary}</p>
                    </div>
                )}

                {/* متن */}
                {letter.content && (
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-sm font-semibold text-gray-500 mb-3 border-b pb-2">متن نامه</h2>
                        <div className="text-sm text-gray-700 leading-8 prose max-w-none"
                            dangerouslySetInnerHTML={{ __html: letter.content }} />
                    </div>
                )}

                {/* پیوست‌ها */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-sm font-semibold text-gray-500 mb-3 border-b pb-2">پیوست‌ها</h2>
                    <AttachmentUploader letterId={letter.id} attachments={letter.attachments} uploadUrl={uploadUrl} />
                </div>

                {/* گردش کار */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-sm font-semibold text-gray-500 mb-4 border-b pb-2">گردش کار</h2>
                    <RoutingPanel letterId={letter.id} routings={letter.routings}
                        positions={positions} users={users} storeUrl={storeRoutingUrl} />
                </div>
            </div>
        </>
    );
}
