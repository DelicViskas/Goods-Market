import { Reviews } from "@prisma/client";
import starimg from '@/public/full-star.svg'
import emptyStar from '@/public/empty-star.svg'
import bcrypt from 'bcryptjs';

export function getOrderBy(sort: string): { createdAt?: 'asc' | 'desc'; price?: 'asc' | 'desc' } {
  switch (sort) {
    case 'dateup':
      return { createdAt: 'asc' };
    case 'datedown':
      return { createdAt: 'desc' };
    case 'priceup':
      return { price: 'asc' };
    case 'pricedown':
      return { price: 'desc' };
    default:
      return { createdAt: 'desc' };
  }
}


export function getAverageRating(reviews: Reviews[]) {
  return reviews.length > 0

    ? reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length
    : 0;
}

export function getObjRatings(rev: Reviews[]) {
  const rating: { [key: number]: number } = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0
  };
  rev.forEach(rev => {
    if (Object.keys(rating).includes(String(rev.rating))) {
      rating[rev.rating]++
    }
  })
  return rating;
}

export function getStarsFill(countfill: number) {
  const res: string[] = [];
  for (let index = 0; index < 5; index++) {
    if (countfill > index) res.push(starimg)
    else res.push(emptyStar)
  }
  return res;
}

export function getTimeStamp(timestamp: string, isDay?: boolean) {
  const date = new Date(timestamp);
  if ((new Date).toLocaleDateString() === date.toLocaleDateString()) {
    if (isDay) {
      return 'Сегодня'
    }
    return new Date(timestamp).toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  if ((new Date).getDate() - date.getDate() === 1) {
    return 'Вчера';
  }
  else return date.toLocaleDateString();
}


const saltRounds = 10;

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export async function checkPassword(userPassword: string | null, inputPassword: string) {
  if (userPassword === null) {
    return false;
  }
  return await bcrypt.compare(inputPassword, userPassword);
}

