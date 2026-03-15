import forms from '@tailwindcss/forms';
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Vazir', ...defaultTheme.fontFamily.sans],
                // Add Nastaliq as a secondary custom font
                nastaliq: ['IranNastaliq', 'serif'],
            },
        },
    },

    plugins: [forms],
};
