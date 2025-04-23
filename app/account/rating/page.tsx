"use client"
import ErrorPage from "@/app/error";
import { Rev } from "@/app/user/[id]/rating/page";
import Rating from "@/components/Rating";
import Spinner from "@/components/Spinner";
import { fetcher, reviewsURL } from "@/swr/fetcher";
import useSWR from "swr";

export default function Home() {
  const { data, error, isLoading } = useSWR<Rev[]>(reviewsURL, fetcher)

  if (isLoading) return <Spinner />
  if (error) return <ErrorPage error={error} />
  if (data) return <Rating reviews={data} />
}