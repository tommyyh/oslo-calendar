'use server';

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const formatSMS = (reservation: any) => {
  const { name, type, destination, date, time, length, people } = reservation;

  return `Hei ${name}, din ${type} båttur til ${destination} er på ${date} kl. ${time}. Varighet: ${length} timer for ${people}  personer. Innsjekking 15 minutter tidligere. Vi har sendt deg en fullstendig bekreftelse på e-postadressen din. Kontakt oss hvis du har spørsmål!`
}

// Route
export async function POST(request: Request) {
  const data = await request.json();
  const { tel, id } = data;
  const reservation = await prisma.reservation.findUnique({ where: { id } })

  // Check if not found
  if (!reservation?.id) return NextResponse.json({ status: 'error' });

  const body = formatSMS(reservation);

  // Twilio
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const senderPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  try {
    const client = require('twilio')(accountSid, authToken);

    await client.messages.create({
      body,
      from: senderPhoneNumber,
      to: tel
    })

    return NextResponse.json({ status: 'success' })
  } catch {
    return NextResponse.json({ status: 'error' })
  }
}
