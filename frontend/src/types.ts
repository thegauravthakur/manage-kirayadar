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
}

export interface Space {
    id: number;
    floor: number;
    name: string;
    propertyId: number;
}

export interface Response<T> {
    errorMessage: string;
    data: T;
}
