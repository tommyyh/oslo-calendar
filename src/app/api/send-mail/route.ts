'use server';

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';

const formatMAIL = (reservation: any) => {
  const { name, type, destination, date, time, length, people, addedItems } = reservation;

  // Food items
  const formattedFoodItems = addedItems.map((item: any) => ` - ${item.quantity}x - ${item.title}:   ${item.totalPrice},- Nok`).join('\n');

  return `Hei ${name}, din ${type} båttur til ${destination} er på ${date} kl. ${time}. Varighet: ${length} timer for ${people}  personer. Innsjekking 15 minutter tidligere. \n\n Det du har valgt på menyen: \n ${formattedFoodItems} \n\n\n Total pris: ${reservation.totalPrice} \n\n\n Har du spørsmål? Ta kontakt med oss.`
}

const formatMAILHtml = (reservation: any) => {
  const { name, type, destination, date, time, length, people, addedItems } = reservation;

  // Food items
  const formattedFoodItems = addedItems.map((item: any) => `<li> - ${item.quantity}x - ${item.title}:   ${item.totalPrice},- Nok</li>`).join('<br>');

  return `<h1>Hei ${name}</h1>, <br> <p>din ${type} båttur til <b>${destination}</b> er på <b>${date}</b> kl. <b>${time}</b>.<br> Varighet: ${length} timer for ${people}  personer. Innsjekking 15 minutter tidligere. <br><br> Det du har valgt på menyen:</p> <br> <ul>${formattedFoodItems}</ul> <br><br><br> <h2>Total pris: ${reservation.totalPrice},- Nok<h2/> <br><br><br> <p>Har du spørsmål? Ta kontakt med oss.</p>`
}

// Route
export async function POST(request: Request) {
  const data = await request.json();
  const { email, id } = data;
  const reservation = await prisma.reservation.findUnique({ where: { id }, include: { addedItems: true } })

  // Check if not found
  if (!reservation?.id) return NextResponse.json({ status: 'error' });
  
  // Email sending
  const { SMTP_PASS, SMTP_EMAIL } = process.env;
  const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_PASS
    }
  });

  // Verify connection
  try {
    await transport.verify();
  } catch (e) {
    console.log('GFIHERGUGEIHJ: ' + e);
    
    return NextResponse.json({ status: 'error' })
  }

  // Send mail
  try {
    await transport.sendMail({
      from: SMTP_PASS,
      to: email,
      subject: `Yacht Trip: ${reservation.date} at ${reservation.time}`,
      text: formatMAIL(reservation),
      html: formatMAILHtml(reservation)
    })

    return NextResponse.json({ status: 'success' })
  } catch (e) {
    console.log(e);
    
    return NextResponse.json({ status: 'error' })
  }
}
