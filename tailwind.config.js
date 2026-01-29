/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}" // Catch App.tsx in root
    ],
    theme: {
        extend: {
            colors: {
                chorke: {
                    green: '#D6FF00',
                    pink: '#FF90E8',
                    blue: '#00F0FF',
                    yellow: '#FFEA2B',
                }
            },
            fontFamily: {
                space: ['"Space Grotesk"', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
