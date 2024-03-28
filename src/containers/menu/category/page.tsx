import React from 'react';
import style from './category.module.scss';
import Item from './item/page';
import { v4 } from 'uuid';
import Image from 'next/image';

type PropsType = {
  category: {
    title: string;
    image: any;
    items: Array<{
      title: string;
      max: number;
      price: number;
    }>;
  };
  setInfo: any;
  info: any;
};

const Category = ({ category, setInfo, info }: PropsType) => {
  return (
    <div className={style.category}>
      <div className={style.image}>
        <Image
          src={category.image}
          alt="Menu"
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <h2>{category.title}</h2>

      <ul>
        {category.items.map((item) => (
          <Item item={item} key={v4()} setInfo={setInfo} info={info} />
        ))}
      </ul>
    </div>
  );
};

export default Category;
