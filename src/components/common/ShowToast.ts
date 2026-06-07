import { toast } from "sonner"

export function showToast({
    title,
    message,
    type = "default",
}: {
    title: string
    message?: string
    type?: "success" | "error" | "loading" | "default"
}) {
    const content = message ? `${title}: ${message}` : title

    switch (type) {
        case "success":
            toast.success(content)
            break
        case "error":
            toast.error(content)
            break
        case "loading":
            toast.loading(content)
            break
        default:
            toast(content)
    }
}
