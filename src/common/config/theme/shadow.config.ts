import type { Shadows } from '@mui/material/styles'

export const shadows: Shadows = [
    'none', // 0
    '0px 1px 2px rgba(0,0,0,0.05)', // 1
    '0px 1px 3px rgba(0,0,0,0.1)', // 2
    '0px 4px 6px rgba(0,0,0,0.1)', // 3
    '0px 6px 10px rgba(0,0,0,0.12)', // 4
    '0px 10px 15px rgba(0,0,0,0.12)', // 5
    '0px 15px 20px rgba(0,0,0,0.15)', // 6
    '0px 20px 30px rgba(0,0,0,0.15)', // 7
    '0px 24px 38px rgba(0,0,0,0.18)', // 8
    '0px 30px 60px rgba(0,0,0,0.2)', // 9
    '0px 32px 64px rgba(0,0,0,0.22)', // 10 
    '0px 36px 72px rgba(0,0,0,0.24)', // 11
    '0px 40px 80px rgba(0,0,0,0.25)', // 12
    ...Array(11).fill('0px 40px 80px rgba(0,0,0,0.25)'),
] as Shadows
