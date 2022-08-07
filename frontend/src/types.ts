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
    totalSpaces: number;
}

export type SpaceType =
    | 'room'
    | 'one_Rk'
    | 'two_RK'
    | 'one_BHK'
    | 'two_BHK'
    | 'three_BHK'
    | 'four_BHK'
    | 'five_BHK';

export interface Space {
    id: number;
    floor: number;
    name: string;
    propertyId: number;
    totalTenants: number;
    spaceType: SpaceType;
    rent: number;
    sharingType: number;
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
