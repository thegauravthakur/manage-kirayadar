export interface User {
    id: number;
    email: string;
    avatarUrl: string | null;
    name: string;
}

export interface CustomError {
    errorMessage: string;
    data: null;
}

export interface Property {
    id: number;
    name: string;
    address: string;
    totalFloors: number;
    totalTenants: number;
}

export interface Space {
    id: number;
    floor: number;
    name: string;
    propertyId: number;
}

export interface Tenant {
    id: number;
    name: string;
    email: string;
    userId?: number;
}

export interface Response<T> {
    errorMessage: string;
    data: T;
}

export interface Document {
    name: string;
    id: number;
}
