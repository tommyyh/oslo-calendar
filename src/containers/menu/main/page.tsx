import React from 'react';
import Category from '../category/page';
import { v4 } from 'uuid';
import style from './main.module.scss';

const Main = () => {
  const menu = [
    {
      title: 'Forretter 🥟',
      items: [
        { title: 'Jordbær i boller', max: 20, price: 45 },
        { title: 'Grønnsaks- eller Fruktanretning', max: 20, price: 85 },
        { title: 'Snitter', max: 20, price: 66 },
      ],
    },
    {
      title: 'Hovedretter 🍗',
      items: [
        { title: 'Rekebuffet', max: 20, price: 289 },
        { title: 'Seafood de luxe (min 8 pers)', max: 20, price: 565 },
        { title: 'Tapas (min 8 pers)', max: 20, price: 529 },
        { title: 'Spekefat de luxe (min 8 pers)', max: 20, price: 395 },
        { title: 'Koldtbord Executive (min 8 pers)', max: 20, price: 375 },
        { title: 'Baguetter / Wraps', max: 20, price: 89 },
      ],
    },
    {
      title: 'DESSERT 🍰',
      items: [
        { title: 'Friske jordbær med fløte og sukker', max: 20, price: 89 },
        { title: 'Skogsbærkake m/friske bær, porsjonert', max: 20, price: 70 },
        { title: 'Frukttartelett m/vaniljekrem', max: 20, price: 60 },
      ],
    },
    {
      title: 'HVITVIN 🍷',
      items: [
        { title: 'Soave Classico Superior Cesari-Husets', max: 20, price: 295 },
        { title: 'Petit Bourgeoise Sauvignon', max: 20, price: 430 },
        { title: 'William Fevre Petit Chablis', max: 20, price: 410 },
      ],
    },
    {
      title: 'RØDVIN 🍷',
      items: [
        { title: 'Finca Constancia-Husets', max: 20, price: 265 },
        { title: 'Beronia Reserva 2007', max: 20, price: 375 },
        { title: 'Cesari Mara Ripasso Valpolicella', max: 20, price: 339 },
        { title: 'Côtes du Rhône parallèle 45', max: 20, price: 325 },
      ],
    },
    {
      title: 'APERITIFF 🍸',
      items: [
        { title: 'Prosecco Spumante Pizzolato', max: 20, price: 410 },
        { title: 'Vilarnau Brut Cava', max: 20, price: 410 },
        { title: 'Champagne Moët Ice', max: 20, price: 980 },
        { title: 'Kapteinens velkomstdrink', max: 20, price: 45 },
      ],
    },
    {
      title: 'DIGESTIFF 🍺',
      items: [
        { title: 'Thor Heyerdahl XO', max: 20, price: 78 },
        { title: 'Carolans Irish Cream', max: 20, price: 45 },
        { title: 'Jägermeister', max: 20, price: 65 },
      ],
    },
    {
      title: 'DIVERSE 🍵',
      items: [
        { title: 'Kaffe m/fløte og sukker', max: 20, price: 32 },
        { title: 'Ringnes fatpils tappet 0,3 ltr', max: 20, price: 48 },
        { title: 'Clausthaler', max: 20, price: 38 },
        { title: 'Assortert mineralvann (inkl. ombord)', max: 20, price: 0 },
      ],
    },
  ];

  return (
    <main className={style.main}>
      <h1>Velg drikkevarer og forretter</h1>

      <div className={style.continue}>
        <button>Fortsett</button>
      </div>

      {menu.map((category) => (
        <Category category={category} key={v4()} />
      ))}
    </main>
  );
};

export default Main;
