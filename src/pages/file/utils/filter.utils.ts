import { ExplorerFilters } from '../parts/file-tools/explorer-filter.part'

export interface FilterChipData {
    key: string
    label: string
    filterType: 'fileType' | 'dateSort'
    value?: string
}


export const isNoFileTypesSelected = (fileTypes?: { folder: boolean; image: boolean; document: boolean }) => {
    if (!fileTypes) return true
    return !fileTypes.folder && !fileTypes.image && !fileTypes.document
}


export const hasFileTypeFilters = (fileTypes?: { folder: boolean; image: boolean; document: boolean }) => {
    if (!fileTypes) return false
    return fileTypes.folder || fileTypes.image || fileTypes.document
}

export const getActiveFilterCount = (filters?: Partial<ExplorerFilters>): number => {
    if (!filters) return 0

    let count = 0
    if (hasFileTypeFilters(filters.fileTypes)) {
        const { folder, image, document } = filters.fileTypes!
        if (folder) count++
        if (image) count++
        if (document) count++
    }

    if (filters.dateSort && filters.dateSort !== 'newest') {
        count++
    }

    return count
}

export const getFilterChips = (filters?: Partial<ExplorerFilters>): FilterChipData[] => {
    if (!filters) return []

    const chips: FilterChipData[] = []

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

export const getDefaultFilters = (): ExplorerFilters => ({
    fileTypes: {
        folder: false,
        image: false,
        document: false
    },
    dateSort: 'newest'
})
