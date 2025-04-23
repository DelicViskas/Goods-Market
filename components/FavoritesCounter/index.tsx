"use client";
import { countFavorites, fetcher } from "@/swr/fetcher";
import classes from "./index.module.css";
import useSWR from "swr";


export default function FavoriteCountClient() {
  const { data } = useSWR<number>(countFavorites, fetcher, {
    revalidateOnFocus: false
  });
  
  return !!data && <div className={classes.counter}>{data}</div>;
}