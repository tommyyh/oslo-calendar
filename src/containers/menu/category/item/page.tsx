import React, { useState } from 'react';
import style from './item.module.scss';

type PropsType = {
  item: {
    title: string;
    max: number;
    price: number;
  };
  setInfo: any;
  info: any;
};

type AddedItem = {
  title: string;
  quantity: number;
};

const Item = ({ item, setInfo, info }: PropsType) => {
  const addItem = (e: React.ChangeEvent<HTMLSelectElement>, title: string) => {
    const selectedAmount = e.target.value;
    const foundItem = info.addedItems.find(
      (el: AddedItem) => el.title === item.title
    );

    // If value is 0 -> remove from array
    if (parseInt(selectedAmount) === 0) {
      // Filter out the item from the addedItems array
      const filteredItems = info.addedItems.filter(
        (el: AddedItem) => el.title !== item.title
      );

      // Update the info object with the filtered addedItems array
      setInfo({
        ...info,
        addedItems: filteredItems,
      });

      return;
    }

    // Check if item already exists, if yes only update the quantity
    if (!foundItem) {
      setInfo({
        ...info,
        addedItems: [...info.addedItems, { title, quantity: selectedAmount }],
      });
    } else {
      // Update the quantity
      foundItem.quantity = selectedAmount;

      // Update the entire info object with the modified addedItems array
      setInfo({
        ...info,
        addedItems: info.addedItems.map((el: AddedItem) =>
          el.title === item.title ? foundItem : el
        ),
      });
    }
  };

  return (
    <li className={style.item}>
      <span>{item.title}</span>

      <div className={style.select}>
        <span>
          {item.price},- <span className={style.nok}>Nok</span>
        </span>

        <select
          name="quantity"
          onChange={(e) => addItem(e, item.title)}
          value={
            info.addedItems.find((el: AddedItem) => el.title === item.title)
              ?.quantity || 0
          }
        >
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
