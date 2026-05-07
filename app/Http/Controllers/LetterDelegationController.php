<?php

// app/Http/Controllers/LetterDelegationController.php

namespace App\Http\Controllers;

use App\Models\Letter;
use App\Models\LetterDelegation;
use App\Notifications\LetterDelegatedNotification;
use App\Notifications\DelegationAcceptedNotification;
use App\Notifications\DelegationRejectedNotification;
use App\Notifications\DelegationRepliedNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class LetterDelegationController extends Controller
{
    /**
     * نمایش لیست مکتوب‌های ارجاع شده به من
     */
    public function delegatedToMe()
    {
        $delegations = LetterDelegation::with(['letter', 'delegatedBy', 'letter.senderUser'])
            ->where('delegated_to_user_id', auth()->id())
            ->whereIn('status', ['pending', 'accepted'])
            ->orderBy('delegated_at', 'desc')
            ->get();

        return Inertia::render('delegations/delegated-to-me', [
            'delegations' => $delegations
        ]);
    }

    /**
     * نمایش لیست مکتوب‌هایی که من ارجاع داده‌ام
     */
    public function delegatedByMe()
    {
        $delegations = LetterDelegation::with(['letter', 'delegatedTo', 'letter.senderUser'])
            ->where('delegated_by_user_id', auth()->id())
            ->orderBy('delegated_at', 'desc')
            ->get();

        return Inertia::render('delegations/delegated-by-me', [
            'delegations' => $delegations
        ]);
    }

    /**
     * ارجاع مکتوب به شخص دیگر برای پاسخ
     */
    public function store(Request $request, Letter $letter)
    {
        // فقط گیرنده اصلی می‌تواند ارجاع دهد
        if ($letter->recipient_user_id !== auth()->id()) {
            return back()->with('error', 'شما مجاز به ارجاع این مکتوب نیستید');
        }

        // بررسی اینکه مکتوب قبلاً ارجاع فعال نداشته باشد
        if ($letter->hasActiveDelegation()) {
            return back()->with('error', 'این مکتوب قبلاً ارجاع شده است');
        }

        // اعتبارسنجی
        $request->validate([
            'delegated_to_user_id' => 'required|exists:users,id|different:' . auth()->id(),
            'delegated_note' => 'nullable|string|max:1000'
        ]);

        // ایجاد ارجاع
        $delegation = LetterDelegation::create([
            'letter_id' => $letter->id,
            'delegated_by_user_id' => auth()->id(),
            'delegated_to_user_id' => $request->delegated_to_user_id,
            'delegated_note' => $request->delegated_note,
            'delegated_at' => now(),
            'created_by' => auth()->id(),
            'status' => 'pending'
        ]);

        // به‌روزرسانی وضعیت مکتوب
        $letter->update(['status' => 'delegated']);

        // ارسال نوتیفیکیشن به شخص ارجاع شده
        $delegatedUser = $delegation->delegatedTo;
        // $delegatedUser->notify(new LetterDelegatedNotification($delegation));

        return redirect()->route('letters.show', $letter)
            ->with('success', 'مکتوب با موفقیت به ' . $delegatedUser->full_name . ' ارجاع شد');
    }

    /**
     * پذیرش ارجاع توسط شخص ارجاع شده
     */
    public function accept(LetterDelegation $delegation)
    {
        // فقط شخص ارجاع شده می‌تواند بپذیرد
        if ($delegation->delegated_to_user_id !== auth()->id()) {
            abort(403);
        }

        if (!$delegation->isPending()) {
            return back()->with('error', 'این ارجاع قبلاً واکنش نشان داده است');
        }

        $delegation->accept();

        $letter = Letter::where('id', $delegation->letter_id)->first();

        $letter->delegated_by_user_id = $delegation->delegated_by_user_id;
        $letter->delegated_to_user_id = $delegation->delegated_to_user_id;

        $letter->save();


        // ارسال نوتیفیکیشن به شخص ارجاع دهنده
        // $delegation->delegatedBy->notify(new DelegationAcceptedNotification($delegation));

        return redirect()->route('letters.show', $delegation->letter_id)
            ->with('success', 'شما پذیرفتید که به این مکتوب پاسخ دهید');
    }

    /**
     * رد ارجاع توسط شخص ارجاع شده
     */
    public function reject(Request $request, LetterDelegation $delegation)
    {
        // فقط شخص ارجاع شده می‌تواند رد کند
        if ($delegation->delegated_to_user_id !== auth()->id()) {
            abort(403);
        }

        if (!$delegation->isPending()) {
            return back()->with('error', 'این ارجاع قبلاً واکنش نشان داده است');
        }

        $delegation->reject();

        // برگرداندن وضعیت مکتوب
        $delegation->letter->update(['status' => 'sent']);

        // ارسال نوتیفیکیشن به شخص ارجاع دهنده
        $reason = $request->input('reason');
        // $delegation->delegatedBy->notify(new DelegationRejectedNotification($delegation, $reason));

        return redirect()->route('letters.show', $delegation->letter_id)
            ->with('info', 'شما این ارجاع را رد کردید');
    }

    /**
     * ثبت پاسخ توسط شخص ارجاع شده
     * (این متد در LetterController هم می‌تواند باشد)
     */
    public function submitReply(Request $request, LetterDelegation $delegation)
    {
        // فقط شخص ارجاع شده می‌تواند پاسخ دهد
        if ($delegation->delegated_to_user_id !== auth()->id()) {
            abort(403);
        }

        if (!$delegation->isAccepted() && !$delegation->isPending()) {
            return back()->with('error', 'شما مجاز به پاسخ دادن نیستید');
        }

        // اگر هنوز پذیرش نکرده، خودکار پذیرش می‌شود
        if ($delegation->isPending()) {
            $delegation->accept();
        }

        $request->validate([
            'content' => 'required|string|min:3'
        ]);

        // ایجاد پاسخ جدید
        $reply = Letter::create([
            'parent_letter_id' => $delegation->letter_id,
            'sender_user_id' => auth()->id(),
            'recipient_user_id' => $delegation->letter->sender_user_id,
            'subject' => 'پاسخ: ' . $delegation->letter->subject,
            'content' => $request->content,
            'letter_type' => $delegation->letter->letter_type,
            'is_delegated_reply' => true,
            'delegation_id' => $delegation->id,
            'status' => 'sent'
        ]);

        // به‌روزرسانی وضعیت ارجاع
        $delegation->markAsReplied();

        // به‌روزرسانی تعداد پاسخ‌های مکتوب اصلی
        $delegation->letter->increment('reply_count');

        // ارسال نوتیفیکیشن به شخص ارجاع دهنده
        // $delegation->delegatedBy->notify(new DelegationRepliedNotification($delegation, $reply));

        // ارسال نوتیفیکیشن به فرستنده اصلی مکتوب
        $originalSender = $delegation->letter->senderUser;
        if ($originalSender) {
            // $originalSender->notify(new LetterRepliedNotification($reply));
        }

        return redirect()->route('letters.show', $delegation->letter_id)
            ->with('success', 'پاسخ شما با موفقیت ارسال شد');
    }

    /**
     * لغو ارجاع توسط شخص ارجاع دهنده
     */
    public function cancel(LetterDelegation $delegation)
    {
        // فقط شخص ارجاع دهنده می‌تواند لغو کند
        if ($delegation->delegated_by_user_id !== auth()->id()) {
            abort(403);
        }

        if (!$delegation->isPending()) {
            return back()->with('error', 'امکان لغو ارجاع وجود ندارد');
        }

        $delegation->update(['status' => 'cancelled']);

        // برگرداندن وضعیت مکتوب
        $delegation->letter->update(['status' => 'sent']);

        return redirect()->route('letters.show', $delegation->letter_id)
            ->with('info', 'ارجاع مکتوب لغو شد');
    }
}
