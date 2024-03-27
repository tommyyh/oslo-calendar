import React from 'react';
import style from './cell.module.scss';

interface Props extends React.PropsWithChildren {
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
  isDisabled?: boolean;
}

const Cell: React.FC<Props> = ({
  onClick,
  children,
  className,
  isActive = false,
  isDisabled,
}) => {
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
