'use server';

import { NextResponse } from "next/server";
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const data = await request.json();

    cookies().set('session', JSON.stringify(data), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    
    return NextResponse.json({ status: 'success' });
  } catch {
    return NextResponse.json({ status: 'error' });
  }
}
