"use client"
import { Goods } from "@prisma/client";
import InfiniteScroll from 'react-infinite-scroll-component'
import { countFavorites, fetcher, goodsFavorites } from "@/swr/fetcher";
import useSWR, { mutate } from "swr";
import { Session } from "next-auth";
import GoodCard from "./GoodCard";
import ErrorPage from "@/app/error";
import { useEffect, useState } from "react";
import SelectedSort from "../selectedSort";
import Spinner from "../Spinner";
import { useRouter, useSearchParams } from "next/navigation";
import Skeleton from "../skeleton/Goods";

export type Good = Goods & {
  isFavorite?: boolean
}

export default function GoodsList({ type, session }: { type: 'goods' | 'favorites', session: Session | null }) {
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') || '';
  const category = searchParams.get('categoryId') || '';
  const search = searchParams.get('search') || '';
  const [offset, setOffset] = useState(0);
  const [goods, setGoods] = useState<Good[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const query = new URLSearchParams({
    type,
    sort,
    categoryId: category,
    search,
    offset: '0',
    limit: '30'
  }).toString();
  const { data, error, isLoading, isValidating } = useSWR<Good[]>(`${goodsFavorites}?${query}`, fetcher, {
    revalidateOnFocus: false
  });

  useEffect(() => {
    router.refresh()
  }, [router]);

  useEffect(() => {
    if (!session && type === 'favorites') router.push('/');
  }, [router, session, type]);

  useEffect(() => {
    if (data && offset === 0) {
      setGoods(data);
      setHasMore(data.length === 30);
    }
  }, [data, offset]);

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
  }, [sort, category, search]);

  useEffect(() => {
    if (data && data.length < 30) setHasMore(false);
  }, [data]);

  const loadMore = async () => {
    const nextOffset = offset + 30;
    const res = await fetch(`${goodsFavorites}?offset=${nextOffset}&sort=${sort}&type=${type}&search=${search}&categoryId=${category}`);
    const newGoods: Good[] = await res.json();

    setGoods(prev => [...prev, ...newGoods]);
    setOffset(nextOffset);

    if (newGoods.length < 30) setHasMore(false);
  };

  const toggleFav = async (good: Good) => {
    const { id, isFavorite } = good;

    if (session) {
      setGoods(prevGoodList => {
        return prevGoodList.map(g => 
          g.id === id ? { ...g, isFavorite: !isFavorite } : g
        );
      });

      mutate(countFavorites, (count: number = 0) => isFavorite ? count - 1 : count + 1, false);
      mutate(goodsFavorites, goods, false);

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
        mutate(goodsFavorites, undefined, true);
        mutate(countFavorites);
      } catch (error) {
        console.error("Ошибка при обновлении избранного:", error);

        const revertedGoods = goods.map(good =>
          good.id === id ? { ...good, isFavorite } : good
        );
        setGoods(revertedGoods);

        mutate(countFavorites, (count: number = 0) => isFavorite ? count + 1 : count - 1, false);
        mutate(goodsFavorites, revertedGoods, false);
      }
    }
  };


  if (isValidating || isLoading) return <Skeleton />;

  if (error) return <ErrorPage error={error} />;


  if (goods.length) {
    return (
      <>
        <SelectedSort />
        <InfiniteScroll
          style={{ overflow: 'visible' }}
          dataLength={goods.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            hasMore ? (
              <div style={{ minHeight: 80 }}>
                <Spinner classes="marginTandB" />
              </div>
            ) : null
          }
        >
          <div className="grid">
            {goods.map(good =>
              <GoodCard key={good.id} good={good} session={session} toggleFav={() => toggleFav(good)} />
            )}
          </div>
        </InfiniteScroll>
      </>
    );
  }

  if (type === 'favorites' && !goods.length) {
    return <div className="center"><h3>Нет товаров в избранном</h3></div>;
  }

  if (!goods.length) {
    return <div className="center"><h3>Нет товаров по запросу</h3></div>;
  }

  return null;
}