'use client'
import ErrorPage from "@/app/error";
import { fetcher, messagesURL, reviewsURL } from "@/swr/fetcher";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useRef, useState } from "react";
import useSWR, { mutate } from "swr";
import Spinner from "../Spinner";
import classes from './index.module.css'
import Image from "next/image";
import iconPlaceh from '@/public/iconPlaceh.svg';
import send from '@/public/send.svg';
import down from '@/public/down.svg';
import ButtonIcon from "../Button/Button-icon";
import Link from "next/link";
import { getTimeStamp } from "@/f";
import Button from "../Button/Button";



type Message = {
  createdAt: string;
  id: number;
  receiver_ms: string;
  sender_ms: string;
  text: string;
};

type Messages = {
  partner: {
    id: string
    image: string
    name: string
  },
  messages: Message[]
}

const groupMessagesByDate = (messages: Message[]) => {
  const groupedMessages: Record<string, Message[]> = {};

  messages.forEach((message) => {
    const date = getTimeStamp(message.createdAt, true)
    if (!groupedMessages[date]) {
      groupedMessages[date] = [];
    }
    groupedMessages[date].push(message);
  });

  return groupedMessages;
};


export default function Chat({ id, session }: { id: string, session: Session | null }) {
  const { data, error, isLoading } = useSWR<Messages>(`${messagesURL}?type=chat&id=${id}`, fetcher);
  const { data: reviewData, isLoading: isReviewLoading } = useSWR(`${reviewsURL}?receiver=${id}`, fetcher);
  const [value, setValue] = useState('')
  const userId = session?.user?.id;
  const router = useRouter();
  const messageEndRef = useRef<HTMLDivElement | null>(null);

  const userImg = session?.user?.image || iconPlaceh;
  const partnerImg = data?.partner?.image || iconPlaceh;

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const submitMessage = async () => {
    try {
      if (!value.trim()) return;
      const message = {
        sender_ms: userId!,
        receiver_ms: id,
        text: value,
        createdAt: new Date().toISOString(),
        id: Math.random() * 10000
      }
      mutate(`${messagesURL}?type=chat&id=${id}`, (currentData?: Messages) => {
        if (!currentData) return currentData;
        return {
          ...currentData,
          messages: [
            ...currentData.messages,
            message
          ]
        }
      }, false)
      setValue('')
      const res = await fetch(messagesURL, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      })
      if (!res.ok) throw new Error('Ошибка при отправке сообщения на сервер');
      mutate(`${messagesURL}?type=chat&id=${id}`)
      mutate(messagesURL, undefined, true)

    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    scrollToBottom();
  }, [data?.messages]);


  if (isLoading) return <div className="center"><Spinner /></div>
  if (error) return <ErrorPage error={error} />
  if (!session) return null;




  if (data) {
    const groupedMessages = groupMessagesByDate(data?.messages || []);
    const currentUserMessages = data?.messages.filter(m => m.sender_ms === userId).length;
    const partnerMessages = data?.messages.filter(m => m.sender_ms === data.partner.id).length;

    return <div className={classes.chat}>
      <div className={classes.userLink}>
        <Link href={`/user/${data.partner.id}`}>
          <Image src={data.partner.image || iconPlaceh} width={40} height={40} alt="фото профиля" />
          <h1>{data.partner.name}</h1>
        </Link>
        {currentUserMessages >= 2 && partnerMessages >= 2 && !isReviewLoading && !reviewData && <Button onClick={() => router.push(`/createReview/${id}`)}>Оставить отзыв</Button>}
      </div>
      <div className={classes.blockMessage}>

        {Object.entries(groupedMessages).length ? Object.entries(groupedMessages).map(([date, messagesForDate]) =>
          <Fragment key={date}>
            <div className={classes.dateHeader}>{date}</div>
            {messagesForDate.map((mes) => (
              <div
                key={mes.id}
                className={`${classes.message} ${mes.sender_ms === userId ? classes.right : classes.left}`}
              >
                <Link href={mes.sender_ms === userId ? '/account' : `/user/${data.partner.id}`}>
                  <Image src={mes.sender_ms === userId ? userImg : partnerImg} alt='фото профиля' width={30} height={30} />
                </Link>
                <pre>{mes.text}</pre>
                <span>{new Date(mes.createdAt).toLocaleTimeString('ru-RU', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}</span>
              </div>
            ))}
          </Fragment>
        ) : <div className="center">Нет сообщений</div>}
        <div ref={messageEndRef}></div>
      </div>
      <div className={classes.formSend}>
        <textarea className={classes.input} value={value} onKeyDown={event => {
          if (event.key === 'Enter' && event.shiftKey) {
            event.preventDefault();
            submitMessage();
          }
        }}
          onChange={event => setValue(event.target.value)} 
          placeholder="Введите сообщение"
          onBlur={() => scrollToBottom()}
        />
        <div className={classes.buttons}>
          <ButtonIcon src={down} height={32} width={32} onClick={scrollToBottom} title={"прокрутить вниз"} alt={"прокрутить вниз"} />
          <ButtonIcon src={send} height={32} width={32} onClick={submitMessage} title={"отправить"} alt={"отправить"} />
        </div>
      </div>
    </div>;
  }
}