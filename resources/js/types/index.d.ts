export interface User {
    id: number;
    name: string;
    email: string;
    role?: 'admin' | 'student' | string;
    status?: string | null;
    phone?: string | null;
    avatar?: string | null;
    avatar_url?: string | null;
    address?: string | null;
    city?: string | null;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};
