import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from './helpers/userHelper';

export async function middleware(request: NextRequest) {
    const accessToken = request.cookies.get('accessToken');
    if (!accessToken)
        return NextResponse.redirect(new URL('/login', request.url));
    const result = await getCurrentUser(accessToken as string);
    if (!result.data?.user)
        return NextResponse.redirect(new URL('/login', request.url));
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/property/:propertyId*'],
};
