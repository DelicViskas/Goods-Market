import classes from "./MessageCard.module.css";
import iconPlaceh from '@/public/iconPlaceh.svg'
import { Mess } from "./MessageList";
import Image from "next/image";
import { getTimeStamp } from "@/f";
import Link from "next/link";
import Button from "../Button/Button";
import { useState } from "react";
import PopUpWindow from "../PopUpWindow/PopUpWindow";
import Confirm from "../ConfirmWindow";
import { messagesURL } from "@/swr/fetcher";
import { Session } from "next-auth";
import { mutate } from "swr";

export default function MessageCard({ message, session }: { message: Mess, session: Session | null }) {
  const [showBlock, setShowBlock] = useState(false);
  const [showPopupConfirm, setShowPopupConfirm] = useState(false);

  const deleteMessages = async (partnerId: string) => {
    setShowPopupConfirm(false);
    mutate(messagesURL, (currentData?: Mess[]) => {
      if (!currentData) return [];
      return currentData.filter(mes => mes.partnerId !== partnerId);
    }, false)
    try {
      const dialog = {
        partnerId: message.partnerId,
        iserId: session?.user?.id
      };
      const res = await fetch(messagesURL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dialog),
      })
      if (!res.ok) throw new Error('Ошибка удаления даилога')
      mutate(messagesURL)
    } catch (error) {
      console.error(error)
    }
  }

  return <>
    <Link href={`/messages/${message.partnerId}`} className={classes.msg}>
      <Image src={message.partnerImage ?? iconPlaceh} width={60} height={60} className={classes.icon} alt='Фото профиля' />
      <div>
        <h2>{message.partnerName}</h2>
        <p>{message.text}</p>
      </div>
      <span>{getTimeStamp(message.createdAt)}</span>
      <Button onClick={event => {
        event?.stopPropagation();
        event?.preventDefault();
        if (!showBlock)
          setShowBlock(true)
        else
          setShowBlock(false)
      }}>···</Button>
      {showBlock && <div className={classes.blockRemove}>
        <span onClick={event => {
          event?.stopPropagation();
          event?.preventDefault();
          setShowBlock(false);
          setShowPopupConfirm(true);
        }}>Удалить</span>
      </div>}
    </Link>
    {showPopupConfirm && <PopUpWindow onClose={() => setShowPopupConfirm(false)}><Confirm text="Вы действительно хотите удалить переписку?" onOk={() => deleteMessages(message.partnerId)} onCancel={() => setShowPopupConfirm(false)} /></PopUpWindow>}
  </>
}