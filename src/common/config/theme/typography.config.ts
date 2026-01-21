import type { TypographyVariantsOptions } from "@mui/material/styles";

export const typography: TypographyVariantsOptions = {
    fontFamily: `'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif`,

    h1: { fontSize: '2.25rem', fontWeight: 700 },
    h2: { fontSize: '1.875rem', fontWeight: 700 },
    h3: { fontSize: '1.5rem', fontWeight: 600 },
    h4: { fontSize: '1.25rem', fontWeight: 600 },

    subtitle1: { fontSize: '0.875rem', fontWeight: 500 },
    subtitle2: { fontSize: '0.8rem', fontWeight: 500 },

    body1: { fontSize: '0.95rem' },
    body2: { fontSize: '0.875rem' },

    button: {
        textTransform: 'none',
        fontWeight: 600,
    },
}
