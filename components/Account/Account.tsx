"use client"

import classes from "./Account.module.css";
import { accountURL, blobURL, fetcher } from "@/swr/fetcher";
import { User } from "@prisma/client";
import useSWR, { mutate } from "swr";
import iconPlaceh from '@/public/iconPlaceh.svg';
import ErrorPage from "@/app/error";
import Image from "next/image";
import Link from "next/link";
import camera from "@/public/camera.svg";
import edit from "@/public/edit.svg";
import ButtonIcon from "../Button/Button-icon";
import PopUpWindow from "../PopUpWindow/PopUpWindow";
import EditName from "../EditName";
import AccountSkeleton from "../skeleton/AccountSkeleton";
import { memo, useCallback, useState } from "react";
import RatingStars from "../Rating/RatingStars";

type U = User & {
  reviews: number,
  reviewslength: number
}

function Account() {
  const { data, error, isLoading } = useSWR<U>(accountURL, fetcher);
  const [popupEditActive, setPopupEditActive] = useState(false);


  const onUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return

    const previewURL = URL.createObjectURL(file);
    mutate(accountURL, { ...data!, image: previewURL }, false);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const imageURL = await fetch(blobURL, {
        method: 'POST',
        body: formData
      }).then(res => {
        if (!res.ok) throw new Error("Ошибка загрузки");

        return res.json();
      });

      const res = await fetch(accountURL, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageURL }),
      })
      if (!res.ok) throw new Error('Ошибка на серверe');

    } catch (error) {
      console.error(error)
    } finally {
      mutate(accountURL)
      URL.revokeObjectURL(previewURL);
    }
  }, [data])
  const onSaveName = useCallback(async (name: string) => {
    mutate(accountURL, { ...data!, name }, false);
    setPopupEditActive(false)
    try {
      const res = await fetch(accountURL, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      })

      if (!res.ok) throw new Error("Ошибка изменения имени");

      mutate(accountURL);
    } catch (error) {
      console.error(error)
    }
  }, [data])

  if (isLoading) return <AccountSkeleton />
  if (error) return <ErrorPage error={error} />
  if (data) return <div className={classes.wrapper}>
    {popupEditActive &&
      <PopUpWindow onClose={() => setPopupEditActive(false)}>
        <EditName onSave={onSaveName} onClose={() => setPopupEditActive(false)} name={data.name || ''} />
      </PopUpWindow>}
    <div className={classes.image}>
      <Image className={classes.img} width={200} height={200} src={data.image || iconPlaceh} alt="Фото профиля" />
      <label htmlFor="upload-profile" className={classes.label}>
        <Image className={classes.camera} width={50} height={50} src={camera} alt="Добавить фото" />
      </label>
      <input
        id="upload-profile"
        type="file"
        accept="image/*"
        className={classes.upload}
        onChange={onUpload}
        onClick={(e) => (e.target as HTMLInputElement).value = ""}
      />
    </div>
    <Link href={'/account/rating'} className={classes.reviews}>
      <span>{data?.reviews?.toFixed(1)}</span>
      <RatingStars rating={data.reviews} />
      <span>{data.reviewslength} отзыва</span>
    </Link>
    <div className={classes.name}>
      <span>{data.name}</span>
      <ButtonIcon onClick={() => setPopupEditActive(true)} src={edit} width={24} height={24} title="Редактировать" alt="Редактировать имя" />
    </div>
    <span>{data.email}</span>
    <span>{`На GoodsMarket с ${(new Date(data.createdAt)).toLocaleDateString()}`}</span>

  </div>;
}

export default memo(Account);