'use client';

import React, { useEffect, useState } from 'react';
import style from './main.module.scss';
import Calendar from '@/components/Calendar/Calendar';
import { add } from 'date-fns';
import timesJson from '@/data/times.json';
import { v4 } from 'uuid';
import Image from 'next/image';
import logoPng from '@/public/logo.png';
import Menu from '@/containers/menu/main/page';

const convertToDate = ({ day, month, year }: any) => {
  return new Date(year, month - 1, day);
};

const Main = () => {
  // Calculate tomorrow's date
  const firstAvailableDate = add(new Date(), { days: 1 });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [timesLoading, setTimesLoading] = useState(true);
  const [formStage, setFormStage] = useState(1);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    add(firstAvailableDate, { days: 1 })
  );
  const [info, setInfo] = useState({
    date: '',
    time: '',
    addedItems: [],
  });

  // Get the end of November
  const lastAvailableDate = convertToDate({ year: 2024, month: 12, day: 1 });

  console.log(info);

  useEffect(() => {
    setTimesLoading(true);

    const times = timesJson.times;
    const disabledTimes = [
      '9:30',
      '10:00',
      '10:30',
      '11:00',
      '11:30',
      '12:00',
      '12:30',
    ];
    const toRemove = new Set(disabledTimes); // Set -> work easier
    const remainingTimes = times.filter((x) => !toRemove.has(x));

    setAvailableTimes(remainingTimes);

    setTimesLoading(false);
  }, [selectedDate]);

  // Choose time
  const chooseTime = (time: string) => {
    setInfo({
      ...info,
      time,
      date: `${selectedDate.getDate()}.${
        selectedDate.getMonth() + 1
      }.${selectedDate.getFullYear()}`,
    });

    setFormStage(2);
  };

  return (
    <main className={style.main}>
      <div className={style.nav}>
        <div>
          <div className={style.logo}>
            <Image
              src={logoPng}
              fill
              alt="Oslo Yacht Charter"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>

          <h5>Reservasjon</h5>
          <h1>Bestill en fantastisk yachttur i Norge</h1>

          <ul>
            <li data-active={formStage === 1 ? 'true' : 'false'}>
              1, Velg dato og klokkeslett
            </li>
            <li data-active={formStage === 2 ? 'true' : 'false'}>
              2, Velg drikkevarer og forretter
            </li>
            <li data-active={formStage === 3 ? 'true' : 'false'}>
              3, Fyll ut informasjon om deg og reisen
            </li>
            <li data-active={formStage === 4 ? 'true' : 'false'}>4, Kasse</li>
            <li data-active={formStage === 5 ? 'true' : 'false'}>
              5, Kos deg med båtturen!
            </li>
          </ul>
        </div>

        <div className={style.contactInfo}>
          <a href="mailto:arild@oceanadventureyachting.no">
            arild@oceanadventureyachting.no
          </a>
          <a href="tel:+4793037700">Tel: (+47) 93 03 77 00</a>
        </div>
      </div>

      <div className={`${style.cont} ${formStage === 1 ? style.cont1 : ''}`}>
        {/* Stage 1 */}
        {formStage === 1 && (
          <>
            <Calendar
              value={currentDate}
              onChange={setCurrentDate}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              firstAvailableDate={firstAvailableDate}
              lastAvailableDate={lastAvailableDate}
            />
            {!timesLoading ? (
              <ul className={style.times}>
                {availableTimes.map((x) => (
                  <li key={v4()}>
                    <button onClick={() => chooseTime(x)}>{x}</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Loading...</p>
            )}
          </>
        )}

        {/* Stage 2 */}
        {formStage === 2 && (
          <Menu setInfo={setInfo} info={info} setFormStage={setFormStage} />
        )}
      </div>
    </main>
  );
};

export default Main;
