import React from 'react';
import style from './nav.module.scss';
import Image from 'next/image';
import logoPng from '@/public/logo.png';

const Nav = ({ formStage }: any) => {
  return (
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
  );
};

export default Nav;
