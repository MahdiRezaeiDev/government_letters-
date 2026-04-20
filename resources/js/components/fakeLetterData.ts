// fakeLetterData.ts
// این فایل را در کنار کامپوننت خود ایجاد کنید

export const fakeFormData = {
    // اطلاعات پایه
    category_id: 1,
    subject: 'درخواست بودجه تکمیلی پروژه سامانه جامع اداری',
    summary: 'با توجه به افزایش دامنه پروژه و نیاز به منابع بیشتر، درخواست تخصیص بودجه تکمیلی به مبلغ ۵۰۰ میلیون تومان جهت تکمیل فاز دوم سامانه جامع اداری را داریم.',
    content: `بسمه تعالی

احتراماً، همانطور که مستحضر هستید پروژه "سامانه جامع اداری" از ابتدای سال جاری با موفقیت آغاز شده و فاز اول آن طبق برنامه زمان‌بندی به اتمام رسیده است. با توجه به استقبال واحدهای سازمانی و نیاز به توسعه قابلیت‌های جدید، دامنه پروژه در فاز دوم گسترش یافته است.

بر اساس برآوردهای کارشناسی انجام شده توسط تیم فنی پروژه، جهت تکمیل فاز دوم و راه‌اندازی کامل سامانه، نیاز به تخصیص بودجه تکمیلی به مبلغ ۵,۰۰۰,۰۰۰,۰۰۰ ریال (پانصد میلیون تومان) می‌باشد.

جزئیات هزینه‌های پیش‌بینی شده به شرح پیوست تقدیم می�گردد. خواهشمند است دستور فرمایید نسبت به بررسی و تخصیص بودجه مورد نظر اقدام لازم معمول گردد.

بدیهی است در صورت تخصیص به موقع بودجه، فاز دوم پروژه تا پایان آذرماه سال جاری به بهره‌برداری خواهد رسید.

با تجدید احترام`,
    security_level: 'confidential',
    priority: 'high',
    date: '1402/08/15',
    due_date: '1402/09/15',
    sheet_count: 3,
    is_draft: false,
    
    // نوع گیرنده
    recipient_type: 'internal' as const, // یا 'external'
    
    // گیرنده داخلی (اگر recipient_type = 'internal')
    recipient_department_id: 2,
    recipient_position_id: 5,
    recipient_name: 'مدیرکل فناوری اطلاعات',
    recipient_position_name: 'مدیرکل',
    
    // گیرنده خارجی (اگر recipient_type = 'external')
    external_organization_id: null,
    external_department_id: null,
    external_position_id: null,
    
    // دستورالعمل
    instruction: 'با توجه به فوریت موضوع، خواهشمند است در اسرع وقت بررسی و اقدام لازم صورت پذیرد. نتیجه حداکثر تا پایان وقت اداری فردا به این دفتر اعلام گردد.',
};

// نسخه با گیرنده خارجی
export const fakeFormDataExternal = {
    ...fakeFormData,
    recipient_type: 'external' as const,
    recipient_department_id: null,
    recipient_position_id: null,
    external_organization_id: 3,
    external_department_id: 7,
    external_position_id: 12,
    recipient_name: 'وزارت ارتباطات و فناوری اطلاعات - معاونت فنی',
    recipient_position_name: 'معاون فنی و زیرساخت',
};

// تابع helper برای پر کردن خودکار فرم در محیط development
export const useFakeDataInDev = (setData: any, setSelectedDepartment?: any, setSelectedExternalOrg?: any, setSelectedExternalDept?: any) => {
    if (process.env.NODE_ENV === 'development') {
        // استفاده از داده فیک با گیرنده داخلی
        const fakeData = fakeFormData;
        
        // تاخیر کوچک برای اطمینان از لود شدن کامل کامپوننت
        setTimeout(() => {
            Object.entries(fakeData).forEach(([key, value]) => {
                if (value !== null) {
                    setData(key, value);
                }
            });
            
            // تنظیم state های اضافی
            if (setSelectedDepartment && fakeData.recipient_department_id) {
                setSelectedDepartment(fakeData.recipient_department_id);
            }
            
            if (setSelectedExternalOrg && fakeData.external_organization_id) {
                setSelectedExternalOrg(fakeData.external_organization_id);
            }
            
            if (setSelectedExternalDept && fakeData.external_department_id) {
                setSelectedExternalDept(fakeData.external_department_id);
            }
            
            console.log('✅ فرم با داده‌های فیک پر شد');
        }, 100);
    }
};