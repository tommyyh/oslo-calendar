import React from 'react';
import style from './item.module.scss';

type PropsType = {
  item: {
    title: string;
    max: number;
    price: number;
  };
};

const Item = ({ item }: PropsType) => {
  return (
    <li className={style.item}>
      <span>{item.title}</span>

      <div className={style.select}>
        <span>
          {item.price},- <span className={style.nok}>Nok</span>
        </span>

        <select name="quantity" id="quantity">
          {Array.from({ length: item.max + 1 }, (_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>
    </li>
  );
};

export default Item;
