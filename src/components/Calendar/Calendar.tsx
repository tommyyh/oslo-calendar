import React from 'react';
import {
  add,
  differenceInDays,
  endOfMonth,
  format,
  setDate,
  startOfMonth,
  sub,
} from 'date-fns';
import Cell from './Cell/Cell';
import style from './calendar.module.scss';
import { v4 } from 'uuid';

const weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type Props = {
  value?: Date;
  selectedDate?: Date;
  onChange: (date: Date) => void;
  setSelectedDate: (date: Date) => void;
  firstAvailableDate: Date;
  lastAvailableDate: Date;
  info: any;
};

const Calendar: React.FC<Props> = ({
  value = new Date(),
  selectedDate,
  onChange,
  setSelectedDate,
  firstAvailableDate,
  lastAvailableDate,
  info,
}) => {
  const startDate = startOfMonth(value);
  const endDate = endOfMonth(value);
  const numDays = differenceInDays(endDate, startDate) + 1;

  const prefixDays = startDate.getDay();
  const suffixDays = 6 - endDate.getDay();

  const prevMonth = () => onChange(sub(value, { months: 1 }));
  const nextMonth = () => onChange(add(value, { months: 1 }));

  const handleClickDate = (index: number) => {
    const date = setDate(value, index);
    setSelectedDate(date);
    onChange(date);
  };

  return (
    <div className={style.calendar}>
      <div className={style.inner}>
        <Cell onClick={prevMonth} className={style.changeMonth}>
          {'<'}
        </Cell>
        <Cell className={style.currentMonth}>{format(value, 'LLLL yyyy')}</Cell>
        <Cell onClick={nextMonth} className={style.changeMonth}>
          {'>'}
        </Cell>

        {weeks.map((week) => (
          <Cell key={v4()} className={style.weeks}>
            {week}
          </Cell>
        ))}

        {Array.from({ length: prefixDays }).map((_, index) => (
          <Cell key={index} />
        ))}

        {Array.from({ length: numDays }).map((_, index) => {
          const date = index + 1;
          const currentDate = setDate(value, date);
          const isCurrentDate =
            selectedDate &&
            currentDate.toDateString() === selectedDate.toDateString();

          // Check if the date is within the allowed range
          const isDisabled =
            currentDate <= firstAvailableDate ||
            currentDate >= lastAvailableDate;

          return (
            <Cell
              key={date}
              isActive={isCurrentDate}
              onClick={!isDisabled ? () => handleClickDate(date) : undefined}
              isDisabled={isDisabled}
            >
              {date}
            </Cell>
          );
        })}

        {Array.from({ length: suffixDays }).map((_, index) => (
          <Cell key={index} />
        ))}
      </div>

      {info?.date && info?.time && (
        <h5>
          Selected date: {info.date}, {info.time}
        </h5>
      )}
    </div>
  );
};

export default Calendar;
