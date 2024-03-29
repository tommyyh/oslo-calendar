import React from 'react';
import style from './goBack.module.scss';

type PropsType = {
  onClick: any;
};

const GoBack = ({ onClick }: PropsType) => {
  return (
    <h6 className={style.goBack} onClick={onClick}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
        <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z" />
      </svg>
      Gå Tilbake
    </h6>
  );
};

export default GoBack;