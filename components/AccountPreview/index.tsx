'use client'
import Link from 'next/link';
import classes from './index.module.css'
import RatingStars from '../Rating/RatingStars';
import iconPlaceh from '@/public/iconPlaceh.svg'
import Image from 'next/image';
import { Session } from 'next-auth';
import Button from '../Button/Button';
import { signIn } from 'next-auth/react';
import { memo } from 'react';

function AccountPreview(
  { img, name, rating, accountReviews, id, session }: { img: string | null, name: string | null, rating: number, accountReviews: number, id: string, session: Session | null }) {


  return <div className={classes.account}>
    {!session ? <Button onClick={() => signIn()}>Авторизуйтесь, чтобы свзяться с продавцом </Button> : session?.user?.id !== id ? <Link href={`/messages/${id}`}>Написать</Link> : null}
    <div className={classes.accountPreview}>
      <div>
        <Link className={classes.name} href={session?.user?.id === id ? '/account' : `/user/${id}`}>{name}</Link>
        <Link href={session?.user?.id === id ? '/account/rating' : `/user/${id}/rating`} className={classes.reviews}>
          <span>{rating.toFixed(1)}</span>
          <RatingStars rating={rating} />
          <span>{accountReviews} отзыва</span>
        </Link>
      </div>
      <Link href={`/user/${id}`} className={classes.icon}>
        <Image width={60} height={60} src={img || iconPlaceh} alt="фото профиля" />
      </Link>
    </div>
  </div>;
}

export default memo(AccountPreview)