<?php

namespace App\Console\Commands;

use App\Services\ReminderService;
use Illuminate\Console\Command;

class SendDeadlineReminders extends Command
{
    protected $signature = 'reminders:send-deadlines';

    protected $description = 'Create and send notifications for overdue letter routing deadlines';

    public function handle(ReminderService $reminderService): int
    {
        $count = $reminderService->processDeadlineReminders();

        $this->info("{$count} یادآوری مهلت ارسال شد.");

        return self::SUCCESS;
    }
}
