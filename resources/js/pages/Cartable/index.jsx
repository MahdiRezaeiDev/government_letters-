// resources/js/Pages/Cartable/Index.jsx
import AppLayout from '@/Layouts/AppLayout';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { CheckCircle, XCircle, Eye, Clock, AlertTriangle } from 'lucide-react';

export default function CartableIndex({ routings, stats }) {
  const [completing, setCompleting] = useState(null);
  const [rejecting, setRejecting] = useState(null);

  const handleComplete = (routing, note) => {
    router.post(`/cartable/${routing.id}/complete`, { note }, {
      onSuccess: () => setCompleting(null),
    });
  };

  const handleReject = (routing, reason) => {
    router.post(`/cartable/${routing.id}/reject`, { reason }, {
      onSuccess: () => setRejecting(null),
    });
  };

  return (
    <AppLayout title="کارتابل من">
      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="وارده امروز"  value={stats.today_incoming}   icon="📥" />
        <StatCard label="صادره امروز"  value={stats.today_outgoing}   icon="📤" />
        <StatCard label="در انتظار"    value={stats.pending_letters}  icon="⏳" />
        <StatCard label="معوق"         value={stats.overdue_routings} icon="⚠️" danger />
      </div>

      {/* Routing list */}
      <div className="space-y-3">
        {routings.data.map(routing => (
          <RoutingCard
            key={routing.id}
            routing={routing}
            onComplete={() => setCompleting(routing)}
            onReject={() => setRejecting(routing)}
          />
        ))}
        {routings.data.length === 0 && (
          <div className="bg-white rounded-xl p-12 text-center text-gray-400">
            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-300" />
            <p>کارتابل شما خالی است!</p>
          </div>
        )}
      </div>

      {/* Complete Modal */}
      {completing && (
        <ActionModal
          title="تکمیل ارجاع"
          label="یادداشت (اختیاری)"
          placeholder="توضیحات اقدام انجام شده..."
          submitLabel="تأیید و تکمیل"
          submitColor="green"
          onClose={() => setCompleting(null)}
          onSubmit={(note) => handleComplete(completing, note)}
        />
      )}

      {/* Reject Modal */}
      {rejecting && (
        <ActionModal
          title="رد ارجاع"
          label="دلیل رد *"
          placeholder="دلیل رد نامه را بنویسید..."
          submitLabel="رد کردن"
          submitColor="red"
          required
          onClose={() => setRejecting(null)}
          onSubmit={(reason) => handleReject(rejecting, reason)}
        />
      )}
    </AppLayout>
  );
}

function StatCard({ label, value, icon, danger }) {
  return (
    <div className={`rounded-xl p-4 shadow-sm border ${
      danger ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100'
    }`}>
      <div className="text-2xl mb-1">{icon}</div>
      <p className={`text-2xl font-bold ${danger ? 'text-red-600' : 'text-gray-900'}`}>{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function RoutingCard({ routing, onComplete, onReject }) {
  const overdue = routing.deadline && new Date(routing.deadline) < new Date();
  const ACTION_LABELS = {
    action: 'اقدام', information: 'اطلاع', approval: 'تأیید',
    coordination: 'هماهنگی', sign: 'امضاء',
  };

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-xl shadow-sm border p-4 ${
      overdue ? 'border-red-200' : 'border-gray-100'
    }`}>
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded font-medium">
              {ACTION_LABELS[routing.action_type]}
            </span>
            {overdue && (
              <span className="flex items-center gap-1 px-2 py-0.5 bg-red-50 text-red-600 text-xs rounded">
                <AlertTriangle className="w-3 h-3" /> معوق
              </span>
            )}
          </div>

          <h3 className="font-semibold text-gray-900 dark:text-white">
            {routing.letter?.subject}
          </h3>

          <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-500">
            <span>از: {routing.from_user?.full_name}</span>
            {routing.deadline && (
              <span className={`flex items-center gap-1 ${overdue ? 'text-red-500' : ''}`}>
                <Clock className="w-3 h-3" />
                مهلت: {routing.deadline}
              </span>
            )}
          </div>

          {routing.instruction && (
            <p className="mt-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
              {routing.instruction}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <a
            href={`/letters/${routing.letter_id}`}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <Eye className="w-3.5 h-3.5" /> مشاهده
          </a>
          <button
            onClick={onComplete}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-green-700 border border-green-200 bg-green-50 rounded-lg hover:bg-green-100"
          >
            <CheckCircle className="w-3.5 h-3.5" /> تکمیل
          </button>
          <button
            onClick={onReject}
            className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-700 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100"
          >
            <XCircle className="w-3.5 h-3.5" /> رد
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionModal({ title, label, placeholder, submitLabel, submitColor, required, onClose, onSubmit }) {
  const [value, setValue] = useState('');
  const colors = { green: 'bg-green-600 hover:bg-green-700', red: 'bg-red-600 hover:bg-red-700' };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-6" dir="rtl">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{title}</h3>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{label}</label>
        <textarea
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => {
              if (required && !value.trim()) return alert('این فیلد الزامی است');
              onSubmit(value);
            }}
            className={`flex-1 py-2 text-sm font-medium text-white rounded-xl transition-colors ${colors[submitColor]}`}
          >
            {submitLabel}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
          >
            انصراف
          </button>
        </div>
      </div>
    </div>
  );
}