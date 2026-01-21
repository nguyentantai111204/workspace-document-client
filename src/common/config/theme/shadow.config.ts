import type { Shadows } from "@mui/material/styles";

export const shadows: Shadows = [
    'none',
    '0px 1px 2px rgba(0,0,0,0.05)',
    '0px 2px 4px rgba(0,0,0,0.06)',
    '0px 4px 8px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.10)',
    '0px 12px 24px rgba(0,0,0,0.12)',
    ...Array(19).fill('none'),
] as Shadows;