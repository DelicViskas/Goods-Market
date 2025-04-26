'use client'

import Image from "next/image";
import classes from "./Account.module.css";
import iconPlaceh from '@/public/iconPlaceh.svg'
import ButtonIcon from "../Button/Button-icon";
import signInImg from '@/public/signInImg.svg'
import signUp from '@/public/signUp.svg'
import Link from "next/link";
import { Session } from "next-auth";
import signOutImg from '@/public/signOutImg.svg'
import { signIn, signOut } from "next-auth/react";
import useSWR from "swr";
import { accountURL, fetcher } from "@/swr/fetcher";

export default function AccountLink({ session }: { session: Session | null }) {
  const { data, isLoading } = useSWR(accountURL, fetcher);

  if (session) {
    return <div className={classes.account}>
      <Link href={'/account'}>
        <Image className={classes.userIcon} src={isLoading ? session.user?.image ?? iconPlaceh : data?.image ?? iconPlaceh} alt='user icon' width={40} height={40} />
        <span>{isLoading ? session.user?.name : data?.name}</span>
      </Link>
      <ButtonIcon onClick={() => signOut()} height={50} width={32} src={signOutImg} title="выйти" alt="профиль"></ButtonIcon>
    </div>
  }


  return <>
    <Link href={'/signup'}>
      <ButtonIcon width={24} height={50} src={signUp} title="регистрация" alt="регистрация" />
    </Link>
    <ButtonIcon onClick={() => signIn()} width={24} height={50} src={signInImg} title="войти" alt="профиль" />
  </>
}