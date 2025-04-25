import ButtonIcon from "../Button/Button-icon";
import heart from '@/public/heart.svg'
import heartred from '@/public/heart-red.svg'
import classes from "./GoodCard.module.css";
import { Session } from "next-auth";
import { Good } from "./GoodList";
import Slider from "../Slider";
import Link from "next/link";
import { memo } from "react";

export const placeholderImg = '/noimage.png';

function GoodCard({ good, toggleFav, session }: { good: Good, toggleFav: () => void, session: Session | null }) {
  if (!good) return null;
  console.log('render GoodCard');
  
  const { id, image, title, price, isFavorite } = good;

  return (
    <Link href={`/good/${id}`} target="_blank" className={`${classes.good} cursor-pointer`}>
      <Slider images={image.length ? image : [placeholderImg]} />
      <span className={classes.title}>{title}</span>
      {session && (
        <ButtonIcon
          onClick={event => {
            event.stopPropagation();
            event.preventDefault();
            toggleFav();
          }}
          src={isFavorite ? heartred : heart}
          height={24}
          width={24}
          title="избранное"
          alt="избранное"
        />
      )}
      <span className={classes.price}>{price} ₽</span>
    </Link>
  );
};


export default memo(GoodCard, (prevProps, nextProps) => {
  return prevProps.good.isFavorite === nextProps.good.isFavorite;
});

