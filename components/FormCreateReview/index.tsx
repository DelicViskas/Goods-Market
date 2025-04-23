'use client'

import classes from './index.module.css'
import emptyStar from '@/public/empty-star.svg'
import fullStar from '@/public/full-star.svg'
import Image from 'next/image';

import { useState } from "react";
import Button from '../Button/Button';
import { reviewsURL } from '@/swr/fetcher';
import { useRouter } from 'next/navigation';

export default function FormCreateReview({ sender, receiver }: { sender: string, receiver: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submitReview = async () => {

    try {
      if (!value.trim() || !selected) {
        setError('Заполните все поля')
        return
      }
      const res = await fetch(reviewsURL, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: selected, comment: value, sender_rw: sender, receiver_rw: receiver }),
      })
      if (!res.ok) setError('ошибка при отправке отзыва');
      router.push(`/user/${receiver}/rating`)
    } catch (error) {
      console.error(error)
    }
  }

  return <div className={classes.review} onClick={() => { if (error) setError(null) }}>
    {error && <p>{error}</p>}
    <span>Выберите оценку:</span>
    <div className={classes.rating}>
      {[1, 2, 3, 4, 5].map((star) =>
        <div
          key={star}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          onClick={() => setSelected(star)}
        >
          <Image width={20} height={20} alt='звезда' src={hovered
            ? star <= hovered
              ? fullStar : emptyStar : star <= (selected ?? 0)
              ? fullStar : emptyStar} />
        </div>
      )}
    </div>
    <label htmlFor="desc">Описание</label>
    <textarea id='desc' value={value} onChange={event => setValue(event.target.value)}></textarea>
    <Button onClick={submitReview}>Отправить</Button>
  </div>;
}