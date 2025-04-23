import { Reviews, User } from "@prisma/client";
import classes from './indeex.module.css'
import Image from "next/image";
import iconPlaceh from '@/public/iconPlaceh.svg';
import Link from "next/link";
import { getAverageRating } from "@/f";
import RatingStars from "../Rating/RatingStars";

type UserArev = User & {
  receivedReviews: Reviews[];
};

export default function AuthorInfo({ user }: { user: UserArev}) {
  const rating = Number(getAverageRating(user.receivedReviews).toFixed(1));
  
  return <div className={classes.wrapper}>
    <div className={classes.image}>
      <Image className={classes.img} width={200} height={200} src={user.image || iconPlaceh} alt="Фото профиля" />
    </div>
    <Link href={`/user/${user.id}`} className={classes.userName}>{user.name}</Link>
    <Link href={`/user/${user.id}/rating`} className={classes.reviews}>
      <span>{rating}</span>
      <RatingStars rating={rating} />
      <span>{user.receivedReviews.length} отзыва</span>
    </Link>

    <span>{`На GoodsMarket с ${(new Date(user.createdAt)).toLocaleDateString()}`}</span>

  </div>;
}














































