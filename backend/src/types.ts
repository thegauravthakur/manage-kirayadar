export interface User {
    id: number;
    email: string;
    avatarUrl: string | null;
    name: string;
}

export interface Property {
    id: number;
    name: string;
    address: string;
    ownerId: number;
}
