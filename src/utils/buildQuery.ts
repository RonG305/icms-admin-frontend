
export function buildQuery(params: Record<string, string | number | boolean | undefined>): string {
    const qs = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== '') qs.append(key, String(value))
    }
    const str = qs.toString()
    return str ? `?${str}` : ''
}