// resources/js/Pages/Letter/Index.jsx
import AppLayout from '@/Layouts/AppLayout';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Search, Filter, Eye, ChevronDown } from 'lucide-react';

const TYPE_LABELS = { incoming: 'وارده', outgoing: 'صادره', internal: 'داخلی' };
const TYPE_COLORS = { incoming: 'blue', outgoing: 'green', internal: 'purple' };
const PRIORITY_LABELS = { low: 'کم', normal: 'عادی', high: 'مهم', urgent: 'فوری', very_urgent: 'خیلی فوری' };
const PRIORITY_COLORS = { very_urgent: 'red', urgent: 'orange', high: 'yellow', normal: 'blue', low: 'gray' };
const STATUS_LABELS = { draft: 'پیش‌نویس', pending: 'در جریان', approved: 'تأیید شده', rejected: 'رد شده', archived: 'بایگانی' };

export default function LetterIndex({ letters, filters, stats }) {
  const [search, setSearch] = useState(filters.search ?? '');

  const applyFilter = (key, value) => {
    router.get('/letters', { ...filters, [key]: value }, { preserveState: true });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applyFilter('search', search);
  };

  return (
    <AppLayout title="مدیریت نامه‌ها">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'وارده', value: stats.total_incoming, color: 'blue' },
          { label: 'صادره', value: stats.total_outgoing, color: 'green' },
          { label: 'داخلی', value: stats.total_internal, color: 'purple' },
          { label: 'در انتظار', value: stats.pending_letters, color: 'orange' },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-sm text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 p-4 mb-4 flex flex-wrap gap-3 items-center">
        <form onSubmit={handleSearch} className="flex gap-2 flex-1 min-w-0">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="جستجو در نامه‌ها..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Search className="w-4 h-4" />
          </button>
        </form>

        <select
          value={filters.type ?? ''}
          onChange={e => applyFilter('type', e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
        >
          <option value="">همه انواع</option>
          {Object.entries(TYPE_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>

        <select
          value={filters.priority ?? ''}
          onChange={e => applyFilter('priority', e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
        >
          <option value="">همه اولویت‌ها</option>
          {Object.entries(PRIORITY_LABELS).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>

        <Link
          href="/letters/create"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          نامه جدید
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3 text-right font-medium">شماره نامه</th>
              <th className="px-4 py-3 text-right font-medium">موضوع</th>
              <th className="px-4 py-3 text-right font-medium">نوع</th>
              <th className="px-4 py-3 text-right font-medium">اولویت</th>
              <th className="px-4 py-3 text-right font-medium">وضعیت</th>
              <th className="px-4 py-3 text-right font-medium">تاریخ</th>
              <th className="px-4 py-3 text-right font-medium">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {letters.data.map(letter => (
              <tr key={letter.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">
                  {letter.letter_number ?? '---'}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 dark:text-white truncate max-w-xs">
                    {letter.subject}
                  </p>
                  {letter.summary && (
                    <p className="text-xs text-gray-400 truncate max-w-xs mt-0.5">
                      {letter.summary}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge color={TYPE_COLORS[letter.letter_type]}>
                    {TYPE_LABELS[letter.letter_type]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge color={PRIORITY_COLORS[letter.priority]}>
                    {PRIORITY_LABELS[letter.priority]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs text-gray-500">
                    {STATUS_LABELS[letter.final_status]}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{letter.date}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/letters/${letter.id}`}
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    مشاهده
                  </Link>
                </td>
              </tr>
            ))}
            {letters.data.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  نامه‌ای یافت نشد
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            نمایش {letters.from} تا {letters.to} از {letters.total} نامه
          </span>
          <div className="flex gap-1">
            {letters.links.map((link, i) => (
              <Link
                key={i}
                href={link.url ?? '#'}
                className={`px-3 py-1 text-sm rounded ${
                  link.active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function Badge({ color, children }) {
  const colors = {
    blue:   'bg-blue-50 text-blue-700',
    green:  'bg-green-50 text-green-700',
    purple: 'bg-purple-50 text-purple-700',
    red:    'bg-red-50 text-red-700',
    orange: 'bg-orange-50 text-orange-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    gray:   'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${colors[color] ?? colors.gray}`}>
      {children}
    </span>
  );
}