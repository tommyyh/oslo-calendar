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
import { useMediaQuery } from 'react-responsive';

const convertToDate = ({ day, month, year }: any) => {
  return new Date(year, month - 1, day);
};

const Main = () => {
  // Calculate tomorrow's date
  const firstAvailableDate = add(new Date(), { days: 0 });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [timesLoading, setTimesLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [special, setSpecial] = useState(false);
  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const isDesktop = useMediaQuery({
    query: '(min-width: 1025px)',
  });
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

  // Get available hours
  useEffect(() => {
    setTimesLoading(true);

    // Check for a special day
    const specialDays = timesJson.specialDays;
    const chosenDate = `${selectedDate.getDate()}.${
      selectedDate.getMonth() + 1
    }.${selectedDate.getFullYear()}`;
    const isSpecial = specialDays.find((x) => x === chosenDate);

    !isSpecial ? setSpecial(false) : setSpecial(true);

    (async () => {
      try {
        const url = isSpecial ? '/api/special-hours' : '/api/disabled-hours';

        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
            `${selectedDate.getDate()}.${
              selectedDate.getMonth() + 1
            }.${selectedDate.getFullYear()}`
          ),
        });

        // Manage available times
        const { availableTimes } = await res.json();
        console.log(availableTimes);

        setAvailableTimes(availableTimes);

        setTimesLoading(false);
      } catch (e) {
        console.log(e);
      }
    })();
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
            {isDesktop ? (
              <>
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
                      availableTimes[0] ? (
                        <ul className={style.times}>
                          {availableTimes.map((x) => (
                            <li key={v4()}>
                              <button onClick={() => chooseTime(x)}>{x}</button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ margin: '0.5rem 0 0 1.9rem' }}>
                          Ingen tider er tilgjengelige denne dagen.
                        </p>
                      )
                    ) : (
                      <Loading />
                    )}
                  </>
                )}
              </>
            ) : (
              info.stage === 1 && (
                <div className={style.timesCont}>
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
                      availableTimes[0] ? (
                        <ul className={style.times}>
                          {availableTimes.map((x) => (
                            <li key={v4()}>
                              <button onClick={() => chooseTime(x)}>{x}</button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ margin: '0.5rem 0 0 1.9rem' }}>
                          Ingen tider er tilgjengelige denne dagen.
                        </p>
                      )
                    ) : (
                      <Loading />
                    )}
                  </>
                </div>
              )
            )}
            {/* Stage 2 */}
            {info.stage === 2 && (
              <Menu setInfo={setInfo} info={info} setFormStage={setFormStage} />
            )}
            {/* Stage 3 */}
            {info.stage === 3 && (
              <Form
                setInfo={setInfo}
                info={info}
                setFormStage={setFormStage}
                special={special}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
};

export default Main;
