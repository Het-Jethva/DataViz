import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import * as XLSX from 'xlsx'

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function getInitials(name) {
    if (!name || typeof name !== 'string') return ''
    const words = name.trim().split(/\s+/)
    if (words.length === 1) return words[0][0]?.toUpperCase() || ''
    return (
        (words[0][0] || '').toUpperCase() +
        (words[words.length - 1][0] || '').toUpperCase()
    )
}

export function formatDate(date) {
    if (!date) return ''
    const d = new Date(date)
    if (isNaN(d)) return ''
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

export function formatFileSize(bytes) {
    if (typeof bytes !== 'number' || isNaN(bytes) || bytes < 0) return '-'
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function downloadCSV(data, filename) {
    if (!data || !data.length) return
    const csvRows = []
    const headers = Object.keys(data[0])
    csvRows.push(headers.join(','))
    for (const row of data) {
        csvRows.push(headers.map((h) => JSON.stringify(row[h] ?? '')).join(','))
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
}

export function downloadExcel(data, filename) {
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
    XLSX.writeFile(wb, filename)
}
