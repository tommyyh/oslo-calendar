import React from 'react';
import style from './cell.module.scss';

const Cell = ({
  onClick,
  children,
  className,
  isActive = false,
  isDisabled,
}: any) => {
  return (
    <div
      onClick={!isActive ? onClick : undefined}
      className={`${style.cellBase} 
                  ${!isActive && onClick ? style.cursorPointer : ''}
                  ${isActive ? style.isActive : ''} 
                  ${className || ''}
                  ${isDisabled ? style.disabled : ''}`}
    >
      {children}
    </div>
  );
};

export default Cell;
