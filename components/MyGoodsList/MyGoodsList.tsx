"use client";

import { myGoodsURL, fetcher } from "@/swr/fetcher";
import useSWR from "swr";
import MyGood from "../MyGoodsList/myGoodCard";
import { Goods } from "@prisma/client";
import Button from "../Button/Button";
import { useRouter } from "next/navigation";
import ErrorPage from "@/app/error";
import SkeletonMyGoods from "../skeleton/MyGoods";

export default function MyGoodsList() {
  const { data, error, isLoading } = useSWR<Goods[]>(myGoodsURL, fetcher, {
    revalidateOnFocus: false
  });
  const router = useRouter();

  if (isLoading) return <SkeletonMyGoods />;
  if (error) return <ErrorPage error={error} />
  if (data?.length === 0)
    return <Button onClick={() => router.push('/creategood')}>Создать объявление</Button>


  return <>
    <Button onClick={() => router.push('/creategood')}>Создать объявление</Button>
    {data?.map((good) => (
      <MyGood key={good.id} good={good}
      />
    ))}
  </>

}

