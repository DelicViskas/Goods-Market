/* eslint-disable @next/next/no-img-element */

"use client"
import {  useState } from "react";
import { placeholderImg } from "../GoodList/GoodCard";
import { Good } from "../GoodList/GoodList";
import classes from './good.module.css';
import AccountPreview from "../AccountPreview";
import { Session } from "next-auth";

type GoodAndU = Good & {
  accountName: string | null,
  accountImage: string | null,
  accountRating: number,
  accountReviews: number,
  category: string
};

export default function GoodPage({ good, session }: { good: GoodAndU, session: Session | null }) {
  const images = good.image.length ? good.image : [placeholderImg];
  const [activeImg, setActiveImg] = useState(images[0]);
  const [isLoading, setIsLoading] = useState(false);

  const date = new Date(good.createdAt);
  const createdAt = `${date.toLocaleDateString()} в ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`;


  const handleImageChange = (newImage: string) => {
    setIsLoading(true);
    setActiveImg(newImage);
  };

  return (
    <div className={classes.good}>
      <div className={classes.column1}>
        <h1>{good.title}</h1>
        <span>{good.price} ₽</span>
        <div className={classes.images}>
          <div className={classes.mainImg}>


            <img
              loading="lazy"
              src={activeImg}
              alt={`image-${activeImg}`}
              className={isLoading ? classes.imgHidden : ''}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
            />

            {good.image.length > 1 && <><button className={classes.prev} onClick={() => {
              const i = images.indexOf(activeImg);
              const newIndex = (i - 1 + images.length) % images.length;
              handleImageChange(images[newIndex]);
            }}>
              {'<'}
            </button>

              <button className={classes.next} onClick={() => {
                const i = images.indexOf(activeImg);
                const newIndex = (i + 1) % images.length;
                handleImageChange(images[newIndex]);
              }}>
                {'>'}
              </button></>}
          </div>

          {good.image.length > 1 && (
            <div className={classes.littleImg}>
              {images.map((img, i) => (
                <img
                  key={`image-${i}`}
                  src={img}
                  alt={`image-${i}`}
                  className={activeImg === img ? classes.active : ''}
                  onClick={() => handleImageChange(img)}
                />
              ))}
            </div>
          )}
        </div>

        <h4>Категория: <span>{good.category}.</span></h4>
        <h2>Описание</h2>
        <pre>{good.description}</pre>
        <hr />
        <span>{`№${good.id} · ${createdAt}`}</span>
      </div>

      <div className={classes.column2}>

        <AccountPreview
          session={session}
          name={good.accountName}
          img={good.accountImage}
          id={good.accountId}
          rating={good.accountRating}
          accountReviews={good.accountReviews}
        />
      </div>
    </div>
  );
}

