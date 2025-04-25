"use client"
import { Session } from "next-auth";
import { Good } from "../GoodList/GoodList";
import classes from './index.module.css'
import GoodCard from "../GoodList/GoodCard";
import { mutate } from "swr";
import { countFavorites, goodsFavorites } from "@/swr/fetcher";
import { useCallback, useState } from "react";

export default function AuthorGoodList({ goods, session }: { goods: Good[], session: Session | null }) {
  const [goodList, setGoodList] = useState(goods);

  const toggleFav = useCallback(async (good: Good) => {
    const { id, isFavorite } = good;

    if (session) {
      setGoodList(prevGoodList => {
        return prevGoodList.map(g => 
          g.id === id ? { ...g, isFavorite: !isFavorite } : g
        );
      });

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
        mutate(countFavorites);
      } catch (error) {
        console.error("Ошибка при обновлении избранного:", error);
      }
    }
  }, [session]);

  if (!goodList || goodList.length === 0) {
    return <div className="center top"><h3>Нет товаров</h3></div>;
  }

  return (
    <div className={classes.list}>
      {goodList.map(good => (
        <GoodCard 
          key={good.id} 
          good={good} 
          session={session} 
          toggleFav={() => toggleFav(good)} 
        />
      ))}
    </div>
  );
}