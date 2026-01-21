// src/common/constants/theme/file-state.constant.ts

import { withAlpha } from './alpha.helper'

export const FILE_STATE = {
    readonly: {
        bg: withAlpha('#64748b', 0.08),
        text: '#64748b',
    },
    shared: {
        bg: withAlpha('#0ea5e9', 0.12),
        text: '#0ea5e9',
    },
    owned: {
        bg: withAlpha('#10b981', 0.12),
        text: '#10b981',
    },
}
