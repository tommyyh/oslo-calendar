'use client';

import React, { useEffect, useState } from 'react';
import style from './main.module.scss';
import Calendar from '@/components/Calendar/Calendar';
import { add } from 'date-fns';
import timesJson from '@/data/times.json';
import { v4 } from 'uuid';
import Menu from '@/containers/menu/main/page';
import Form from '@/containers/form/page';
import Nav from '@/components/Nav/Nav';
import Loading from '@/components/Loading/Loading';

const convertToDate = ({ day, month, year }: any) => {
  return new Date(year, month - 1, day);
};

const Main = () => {
  // Calculate tomorrow's date
  const firstAvailableDate = add(new Date(), { days: 0 });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [timesLoading, setTimesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState(
    add(firstAvailableDate, { days: 1 })
  );
  const [info, setInfo] = useState({
    name: '',
    email: '',
    tel: '',
    msg: '',
    type: 'private',
    people: '1',
    length: '3',
    destination: 'Bygdøy',

    date: '',
    time: '',
    addedItems: [],
    stage: 1,
  });

  const setFormStage = (stage: number) => {
    setInfo({ ...info, stage });
  };

  // Get the end of November
  const lastAvailableDate = convertToDate({ year: 2024, month: 12, day: 1 });

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

  // Save user data in case of refresh
  useEffect(() => {
    const infoFromStorage = localStorage.getItem('info');

    if (!infoFromStorage) {
      localStorage.setItem('info', JSON.stringify(info));
    } else {
      const savedData = JSON.parse(infoFromStorage);
      const { name, email, tel, date, time, stage } = info;

      if (!name && !email && !tel && !date && !time) return;

      // Keep the stage highest even if returning
      if (stage < savedData?.stage) {
        let newData = savedData;
        newData.stage = !savedData?.stage ? 1 : savedData?.stage;

        localStorage.setItem('info', JSON.stringify(newData));
      } else {
        localStorage.setItem('info', JSON.stringify(info));
      }
    }
  }, [info]);

  // Load data
  useEffect(() => {
    setLoading(true);

    const infoFromStorage = localStorage.getItem('info');

    if (!infoFromStorage) return;

    const savedData = JSON.parse(infoFromStorage);

    if (!savedData) return;

    setInfo(savedData);
    setLoading(false);
  }, []);

  // Choose time
  const chooseTime = (time: string) => {
    setInfo({
      ...info,
      time,
      date: `${selectedDate.getDate()}.${
        selectedDate.getMonth() + 1
      }.${selectedDate.getFullYear()}`,
      stage: 2,
    });
  };

  return (
    <main className={style.main}>
      <Nav formStage={info.stage} />

      <div className={`${style.cont} ${info.stage === 1 ? style.cont1 : ''}`}>
        {loading ? (
          <Loading />
        ) : (
          <>
            {/* Stage 1 */}
            {info.stage === 1 && (
              <>
                <Calendar
                  value={currentDate}
                  onChange={setCurrentDate}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  firstAvailableDate={firstAvailableDate}
                  lastAvailableDate={lastAvailableDate}
                  info={info}
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
                  <Loading />
                )}
              </>
            )}
            {/* Stage 2 */}
            {info.stage === 2 && (
              <Menu setInfo={setInfo} info={info} setFormStage={setFormStage} />
            )}
            {/* Stage 3 */}
            {info.stage === 3 && (
              <Form setInfo={setInfo} info={info} setFormStage={setFormStage} />
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Main;
