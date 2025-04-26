"use client"

import ErrorPage from "@/app/error";
import { fetcher, messagesURL } from "@/swr/fetcher";
import useSWR from "swr";
import MessageCard from "./MessageCard";
import Spinner from "../Spinner";
import { Session } from "next-auth";

export type Mess = {
  createdAt: string,
  partnerId: string,
  partnerImage: string,
  partnerName: string,
  text: string
}

export default function MessageList({session}: {session: Session | null}) {
  const { data, error, isLoading } = useSWR<Mess[]>(messagesURL, fetcher)
  
  if (isLoading) return <div className="center"><Spinner /></div>
  if (error) return <ErrorPage error={error} />
  if (!data?.length)
    return <div className="center">
      <h3>Нет сообщений</h3>
    </div>
  return <>
    {data?.map(mes =>
      <MessageCard session={session} key={mes.partnerId} message={mes} />
    )}
  </>
}