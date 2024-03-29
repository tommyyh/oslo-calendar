'use server';

import { NextResponse } from "next/server";
import { cookies } from 'next/headers'
import { prisma } from "@/lib/prisma";
import menuJson from '@/data/menu.json';

export async function POST(request: Request) {
  try {
    const { name, email, tel, msg, type, people, length, destination, date, time, addedItems } = await request.json();
    const [day, month, year] = date.split('.')
    const reconstructedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const menuPrices = menuJson.prices;
    const tripPrices = menuJson.trips;

    // Calculate trip price
    const foundTrip = tripPrices.find(x => x.title === destination)
    let tripPrice = 0;
    
    if (foundTrip?.price) tripPrice = parseInt(foundTrip?.price)
    
    // Calculate all food prices
    let totalPrice = tripPrice;

    for (const item of addedItems) {
      const foundItem = menuPrices.find(x => x.title === item.title);
      let price = 0;

      if (foundItem?.price) price = parseInt(foundItem.price);

      totalPrice += parseInt(item.quantity) * price; // Add each item's totalPrice to totalPrice
    }

    // Save reservation
    const reservation = await prisma.reservation.create({
      data: {
        name,
        email,
        tel,
        msg,
        type,
        people: parseInt(people),
        length: parseInt(length),
        destination,
        date: reconstructedDate,
        time,
        finished: false, // Update to true after successfully paying
        tripPrice,
        totalPrice
      }
    })

    // Save added trips
    for (const item of addedItems) {
      const foundItem = menuPrices.find(x => x.title === item.title)
      let price = 0;

      if (foundItem?.price) price = parseInt(foundItem.price)

      await prisma.addedItem.create({
        data: {
          title: item.title,
          quantity: parseInt(item.quantity),
          price,
          totalPrice: parseInt(item.quantity) * price,
          reservation: { connect: { id: reservation.id } }
        }
      });
    }

    // Send id of this to the frontend
    cookies().set('session', JSON.stringify(reservation.id), {
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
