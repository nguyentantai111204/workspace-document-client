import type { Shadows } from '@mui/material/styles'

/**
 * Creates theme-aware shadows with appropriate opacity for light and dark modes.
 * Dark mode uses stronger shadows for better depth perception.
 */
export const createShadows = (mode: 'light' | 'dark'): Shadows => {
    // Dark mode needs stronger shadows to create depth on dark backgrounds
    const baseOpacity = mode === 'dark' ? 0.4 : 0.1

    return [
        'none',
        `0px 1px 2px rgba(0, 0, 0, ${baseOpacity * 0.5})`,
        `0px 1px 3px rgba(0, 0, 0, ${baseOpacity})`,
        `0px 4px 6px rgba(0, 0, 0, ${baseOpacity})`,
        `0px 6px 10px rgba(0, 0, 0, ${baseOpacity * 1.2})`,
        `0px 10px 15px rgba(0, 0, 0, ${baseOpacity * 1.2})`,
        `0px 15px 20px rgba(0, 0, 0, ${baseOpacity * 1.5})`,
        `0px 20px 30px rgba(0, 0, 0, ${baseOpacity * 1.5})`,
        `0px 24px 38px rgba(0, 0, 0, ${baseOpacity * 1.8})`,
        `0px 30px 60px rgba(0, 0, 0, ${baseOpacity * 2})`,
        `0px 32px 64px rgba(0, 0, 0, ${baseOpacity * 2.2})`,
        `0px 36px 72px rgba(0, 0, 0, ${baseOpacity * 2.4})`,
        `0px 40px 80px rgba(0, 0, 0, ${baseOpacity * 2.5})`,
        ...Array(11).fill(`0px 40px 80px rgba(0, 0, 0, ${baseOpacity * 2.5})`),
    ] as Shadows
}
