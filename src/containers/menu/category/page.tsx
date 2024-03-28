import React from 'react';
import style from './category.module.scss';
import Item from './item/page';
import { v4 } from 'uuid';

type PropsType = {
  category: {
    title: string;
    items: Array<{
      title: string;
      max: number;
      price: number;
    }>;
  };
};

const Category = ({ category }: PropsType) => {
  return (
    <div className={style.category}>
      <h2>{category.title}</h2>

      <ul>
        {category.items.map((item) => (
          <Item item={item} key={v4()} />
        ))}
      </ul>
    </div>
  );
};

export default Category;
