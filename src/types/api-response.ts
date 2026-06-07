
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    meta?: {
        total: number;
        next: string | null;
        previous: string | null;
    };
}