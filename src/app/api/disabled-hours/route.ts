'use server';

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import timesJson from '@/data/times.json';

// This is crazy
const getDisabledTimes = (times: string[], takenTimes: string[]) => {
  const hours = 5 * 2;
  let clone = structuredClone(times);
  let toRemoveMatrix = [] as any;

  // Indexes
  takenTimes.forEach((z) => {
    const index = times.findIndex((x) => x === z);

    if (index - hours < 0) {
      let clone = structuredClone(times);
      const toRemove = clone.splice(0, hours + index + 1);

      return toRemoveMatrix.push(toRemove);
    } else {
      let clone = structuredClone(times);
      const toRemove = clone.splice(index - 10, hours * 2 + 1);

      return toRemoveMatrix.push(toRemove);
    }
  });

  // Merge arrays with to remove into 1
  const cloneFlattened = toRemoveMatrix.flat();
  const toRemove = new Set(cloneFlattened);
  const finalArray = clone.filter((x) => !toRemove.has(x));

  return finalArray;
};

export async function POST(request: Request) {
  const date = await request.json();
  let disabledTimes: string[] = [];

  const res = await prisma.reservation.findMany({
    where: {
      date: date,
      finished: true
    },
  });

  // Push disabled times
  res.forEach(data => {
    disabledTimes.push(data.time);
  })

  const availableTimes = await getDisabledTimes(timesJson.times, disabledTimes);
  
  
  return NextResponse.json({ availableTimes })
}
