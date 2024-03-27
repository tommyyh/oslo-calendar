'use client';

import React, { useState } from 'react';
import style from './main.module.scss';
import { format } from 'date-fns';
import Calendar from '@/components/Calendar/Calendar';
import { add } from 'date-fns';

const convertToDate = ({ day, month, year }: any) => {
  return new Date(year, month - 1, day);
};

const Main = () => {
  // Calculate tomorrow's date
  const firstAvailableDate = add(new Date(), { days: 1 });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    add(firstAvailableDate, { days: 1 })
  );

  // Get the end of November
  const lastAvailableDate = convertToDate({ year: 2024, month: 12, day: 1 });

  return (
    <main className={style.main}>
      <p>
        <strong>Selected Date: </strong>
        {format(selectedDate, 'dd LLLL yyyy')}
      </p>

      <Calendar
        value={currentDate}
        onChange={setCurrentDate}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        firstAvailableDate={firstAvailableDate}
        lastAvailableDate={lastAvailableDate}
      />
    </main>
  );
};

export default Main;
