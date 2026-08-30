import { usePage } from '@inertiajs/react';

export type AppLocale = 'fa' | 'ps' | 'en';

export function useLocale() {
    const props = usePage().props as any;
    const locale = (props.locale || props.auth?.user?.locale || 'fa') as AppLocale;

    if (typeof globalThis !== 'undefined') {
        (globalThis as typeof globalThis & { __appLocale?: AppLocale }).__appLocale = locale;
    }

    return {
        locale,
        isPashto: locale === 'ps',
        isRtl: locale !== 'en',
        t: (dari: string, pashto: string, english?: string) => {
            if (locale === 'ps') return pashto;
            if (locale === 'en' && english) return english;
            return dari;
        },
    };
}
