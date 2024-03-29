'use server';

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    await prisma.reservation.update({
      where: { id },
      data: {
        finished: true
      }
    })

    return NextResponse.json({ status: 'success' });
  } catch {
    return NextResponse.json({ status: 'error' });
  }
}
