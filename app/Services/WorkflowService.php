<?php

namespace App\Services;

use App\Models\{Letter, Routing, Action, User};
use App\Notifications\RoutingAssignedNotification;
use Illuminate\Support\Facades\{DB, Notification};

class WorkflowService
{
    public function __construct(
        private NotificationService $notificationService
    ) {}

    /**
     * ارجاع نامه به کاربر/سمت
     */
    public function route(
        Letter $letter,
        User   $fromUser,
        array  $toRecipients, // [['user_id' => 1, 'position_id' => 2, 'action_type' => 'action', ...]]
        bool   $isParallel = false
    ): array {
        return DB::transaction(function () use ($letter, $fromUser, $toRecipients, $isParallel) {
            $parallelGroupId = $isParallel ? \Str::uuid()->toString() : null;
            $maxStep = Routing::where('letter_id', $letter->id)->max('step_order') ?? 0;
            $createdRoutings = [];

            foreach ($toRecipients as $i => $recipient) {
                $routing = Routing::create([
                    'letter_id'         => $letter->id,
                    'from_user_id'      => $fromUser->id,
                    'from_position_id'  => $fromUser->primaryPosition()?->id,
                    'to_user_id'        => $recipient['user_id'] ?? null,
                    'to_position_id'    => $recipient['position_id'] ?? null,
                    'action_type'       => $recipient['action_type'] ?? 'action',
                    'instruction'       => $recipient['instruction'] ?? null,
                    'deadline'          => $recipient['deadline'] ?? null,
                    'priority'          => $recipient['priority'] ?? 0,
                    'step_order'        => $isParallel ? $maxStep + 1 : $maxStep + $i + 1,
                    'is_parallel'       => $isParallel,
                    'parallel_group_id' => $parallelGroupId,
                    'status'            => 'pending',
                ]);

                // Log the action
                $this->logAction($routing, $fromUser, 'forward');

                // Send notification
                if ($recipient['user_id']) {
                    $toUser = User::find($recipient['user_id']);
                    $toUser?->notify(new RoutingAssignedNotification($routing));
                }

                $createdRoutings[] = $routing;
            }

            // Update letter status
            $letter->update(['final_status' => 'pending']);

            return $createdRoutings;
        });
    }

    /**
     * تکمیل یک ارجاع
     */
    public function complete(Routing $routing, User $user, string $note = ''): void
    {
        DB::transaction(function () use ($routing, $user, $note) {
            $routing->update([
                'status'         => 'completed',
                'completed_at'   => now(),
                'completed_note' => $note,
            ]);

            $this->logAction($routing, $user, 'complete', $note);

            // Check if all parallel group completed
            if ($routing->is_parallel && $routing->parallel_group_id) {
                $allDone = Routing::where('parallel_group_id', $routing->parallel_group_id)
                    ->where('id', '!=', $routing->id)
                    ->whereNotIn('status', ['completed', 'rejected', 'skipped'])
                    ->doesntExist();

                if ($allDone) {
                    $this->checkLetterCompletion($routing->letter);
                }
            } else {
                $this->checkLetterCompletion($routing->letter);
            }
        });
    }

    /**
     * رد کردن یک ارجاع
     */
    public function reject(Routing $routing, User $user, string $reason): void
    {
        DB::transaction(function () use ($routing, $user, $reason) {
            $routing->update([
                'status'         => 'rejected',
                'completed_at'   => now(),
                'completed_note' => $reason,
            ]);

            $this->logAction($routing, $user, 'reject', $reason);

            // Notify original sender
            $routing->fromUser?->notify(
                new \App\Notifications\RoutingRejectedNotification($routing, $reason)
            );
        });
    }

    private function checkLetterCompletion(Letter $letter): void
    {
        $hasPending = Routing::where('letter_id', $letter->id)
            ->whereIn('status', ['pending', 'in_progress'])
            ->exists();

        if (!$hasPending) {
            $letter->update(['final_status' => 'approved']);
        }
    }

    private function logAction(Routing $routing, User $user, string $type, string $desc = ''): void
    {
        Action::create([
            'routing_id'  => $routing->id,
            'user_id'     => $user->id,
            'action_type' => $type,
            'description' => $desc,
            'ip_address'  => request()->ip(),
            'user_agent'  => request()->userAgent(),
        ]);
    }
}