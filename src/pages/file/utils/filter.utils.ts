import { ExplorerFilters } from '../parts/file-tools/explorer-filter.part'

export interface FilterChipData {
    key: string
    label: string
    filterType: 'fileType' | 'dateSort'
    value?: string
}

/**
 * Check if no file types are selected (new default state)
 */
export const isNoFileTypesSelected = (fileTypes?: { folder: boolean; image: boolean; document: boolean }) => {
    if (!fileTypes) return true
    return !fileTypes.folder && !fileTypes.image && !fileTypes.document
}

/**
 * Check if any file type IS selected (has active filter)
 */
export const hasFileTypeFilters = (fileTypes?: { folder: boolean; image: boolean; document: boolean }) => {
    if (!fileTypes) return false
    return fileTypes.folder || fileTypes.image || fileTypes.document
}

/**
 * Get count of active filters
 * Default state = all file types selected + dateSort 'newest'
 * Only count deviations from default
 */
export const getActiveFilterCount = (filters?: Partial<ExplorerFilters>): number => {
    if (!filters) return 0

    let count = 0

    // Count active file types (only if not all selected)
    if (hasFileTypeFilters(filters.fileTypes)) {
        const { folder, image, document } = filters.fileTypes!
        if (folder) count++
        if (image) count++
        if (document) count++
    }

    // Count date sort (only if not default 'newest')
    if (filters.dateSort && filters.dateSort !== 'newest') {
        count++
    }

    return count
}

/**
 * Generate filter chips data for display
 */
export const getFilterChips = (filters?: Partial<ExplorerFilters>): FilterChipData[] => {
    if (!filters) return []

    const chips: FilterChipData[] = []

    // Add file type chips (display any selected types)
    if (hasFileTypeFilters(filters.fileTypes)) {
        const { folder, image, document } = filters.fileTypes!

        if (folder) {
            chips.push({
                key: 'fileType-folder',
                label: 'Thư mục',
                filterType: 'fileType',
                value: 'folder'
            })
        }

        if (image) {
            chips.push({
                key: 'fileType-image',
                label: 'Hình ảnh',
                filterType: 'fileType',
                value: 'image'
            })
        }

        if (document) {
            chips.push({
                key: 'fileType-document',
                label: 'Tài liệu',
                filterType: 'fileType',
                value: 'document'
            })
        }
    }

    // Add date sort chip (only if not default)
    if (filters.dateSort && filters.dateSort !== 'newest') {
        chips.push({
            key: 'dateSort-oldest',
            label: 'Cũ nhất',
            filterType: 'dateSort',
            value: 'oldest'
        })
    }

    return chips
}

/**
 * Get default filters (all unchecked = show all)
 */
export const getDefaultFilters = (): ExplorerFilters => ({
    fileTypes: {
        folder: false,
        image: false,
        document: false
    },
    dateSort: 'newest'
})
