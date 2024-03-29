'use client';

import React, { useState } from 'react';
import style from './orderSummary.module.scss';

const OrderSummary = ({ data, totalPrice }: any) => {
  const [summaryOpen, setSummaryOpen] = useState(false);

  return (
    <section className={`${summaryOpen ? style.open : ''} ${style.summary}`}>
      <div className={style.up} onClick={() => setSummaryOpen(!summaryOpen)}>
        <h2>Sammendrag av bestillingen</h2>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
        </svg>
      </div>

      {/* List */}
      <div className={style.list}>
        <h4>Sammendrag av reisen</h4>

        <li className={style.row}>
          <div className={style.left}>
            <span>{data.length}h</span> {data.destination}
          </div>

          <span>
            <span className={style.price}>
              {data.tripPrice.toLocaleString().replaceAll(',', ' ')}
            </span>
            ,- Nok
          </span>
        </li>
      </div>

      <div className={style.list}>
        <h4>Menyoversikt</h4>

        {data.addedItems.map((item: any) => (
          <li className={style.row} key={item.title}>
            <div className={style.left}>
              <span>{item.quantity}x</span> {item.title}
            </div>

            <span>
              <span className={style.price}>
                {item.totalPrice.toLocaleString().replaceAll(',', ' ')}
              </span>
              ,- Nok
            </span>
          </li>
        ))}
      </div>

      {/* Total */}
      <div className={style.list}>
        <li className={style.row}>
          <div className={style.left}>Totalpris</div>

          <span>
            <span className={style.price}>
              {totalPrice.toLocaleString().replaceAll(',', ' ')}
            </span>
            ,- Nok
          </span>
        </li>
      </div>
    </section>
  );
};

export default OrderSummary;
