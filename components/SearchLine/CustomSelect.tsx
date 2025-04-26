
import { memo, useEffect, useRef, useState } from 'react';
import styles from './CustomSelect.module.css';
import { Categories } from '@prisma/client';
import category from '@/public/category.svg';
import ButtonIcon from '../Button/Button-icon';

function CustomSelect({ onChange, options}: {onChange: (value: string) => void, options: Categories[]}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={styles.selectContainer} ref={selectRef}>
      <ButtonIcon src={category} width={40} height={40} title='категории' alt='категории' onClick={() => setIsOpen(!isOpen)}/>


      {isOpen && (
        <ul className={styles.optionsList}>
          <li onClick={() => { onChange(''); setIsOpen(false); }}>
              Все категории
            </li>
          {options.map(option => (
            <li key={option.id} onClick={() => { onChange(String(option.id)); setIsOpen(false); }}>
              {option.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default memo(CustomSelect)