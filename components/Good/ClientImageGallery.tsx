/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from "react";
import classes from './good.module.css';
import { placeholderImg } from "../GoodList/GoodCard";

export default function ClientImageGallery({ images }: { images: string[] }) {
  const galleryImages = images.length ? images : [placeholderImg];
  const [activeImg, setActiveImg] = useState(galleryImages[0]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (newImage: string) => {
    setIsLoading(true);
    setActiveImg(newImage);
  };

  return (
    <div className={classes.images}>
      <div className={classes.mainImg}>
        <img
          src={activeImg}
          loading="lazy"
          alt={`image-${activeImg}`}
          className={isLoading ? classes.imgHidden : ''}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
        {galleryImages.length > 1 && (
          <>
            <button className={classes.prev} onClick={() => {
              const i = galleryImages.indexOf(activeImg);
              const newIndex = (i - 1 + galleryImages.length) % galleryImages.length;
              handleImageChange(galleryImages[newIndex]);
            }}>
              {'<'}
            </button>
            <button className={classes.next} onClick={() => {
              const i = galleryImages.indexOf(activeImg);
              const newIndex = (i + 1) % galleryImages.length;
              handleImageChange(galleryImages[newIndex]);
            }}>
              {'>'}
            </button>
          </>
        )}
      </div>

      {galleryImages.length > 1 && (
        <div className={classes.littleImg}>
          {galleryImages.map((img, i) => (
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
  );
}