"use client"
import { Session } from "next-auth";
import { Good } from "../GoodList/GoodList";
import classes from './index.module.css'
import GoodCard from "../GoodList/GoodCard";
import { mutate } from "swr";
import { countFavorites, goodsFavorites } from "@/swr/fetcher";
import { useState } from "react";

export default function AuthorGoodList({ goods, session }: { goods: Good[], session: Session | null }) {
  const [good, setGood] = useState(goods);

  const toggleFav = async (good: Good) => {
    const { id, isFavorite } = good;

    if (session) {
      setGood(prev => prev.map(good =>
        good.id === id ? { ...good, isFavorite: !isFavorite } : good
      ))

      mutate(countFavorites, (count: number = 0) => isFavorite ? count - 1 : count + 1, false);

      try {
        const method = isFavorite ? "DELETE" : "POST";
        const res = await fetch(goodsFavorites, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, type: 'favorites' }),
        });

        if (!res.ok) throw new Error("Ошибка обновления избранного");

        // mutate(goodsFavorites, undefined, true);
        mutate(countFavorites);
      } catch (error) {
        console.error("Ошибка при обновлении избранного:", error);
      }
    }
  };

  return <div className={classes.list}>
    {good.map(good => <GoodCard good={good} key={good.id} session={session} toggleFav={() => toggleFav(good)} />)}
  </div>;
}