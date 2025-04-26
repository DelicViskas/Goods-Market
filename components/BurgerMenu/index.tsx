'use client'

import { Session } from "next-auth";
import classes from './index.module.css'
import ButtonIcon from "../Button/Button-icon";
import Link from "next/link";
import admin from '@/public/admin.svg'
import envelope from '@/public/envelope.svg'
import favorites from '@/public/favorites.svg'
import add from '@/public/plus.svg'
import burger from '@/public/burger.svg'
import burgerClose from '@/public/closeburger.svg'
import signOutImg from '@/public/signOutImg.svg'
import iconPlaceh from '@/public/iconPlaceh.svg'
import { memo, useEffect, useRef, useState } from "react";
import signInImg from '@/public/signInImg.svg'
import signUp from '@/public/signUp.svg'
import { signIn, signOut } from "next-auth/react";
import FavoriteCountClient from "../FavoritesCounter";

function BurgerMenu({ session }: { session: Session | null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timeout = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  return <div className={classes.burgerMenu} ref={selectRef}>
    <ButtonIcon
      src={isOpen ? burgerClose : burger}
      width={24}
      height={50}
      title={isOpen ? "закрыть" : "меню"}
      alt={isOpen ? "закрыть" : "меню"}
      onClick={() => setIsOpen(prev => !prev)}
    />

    {shouldRender && <nav className={`${classes.nav} ${isOpen ? classes.fadeIn : classes.fadeOut}`}>
      {session ?
        <>
          <Link href={'/account'}>
            <ButtonIcon onClick={() => setIsOpen(false)} src={session?.user?.image ?? iconPlaceh} height={50} width={24} title="аккаунт" alt="аккаунт"></ButtonIcon>
          </Link>
          {session?.user?.role === "ADMIN" ? <Link href={'/admin'}>
            <ButtonIcon onClick={() => setIsOpen(false)} src={admin} height={50} width={24} title="админка" alt="админка"></ButtonIcon>
          </Link> : false}
          <Link href={'/creategood'}>
            <ButtonIcon onClick={() => setIsOpen(false)} src={add} height={50} width={24} title="разместить объявление" alt="разместить объявление"></ButtonIcon>
          </Link>
          <Link href='/messages'>
            <ButtonIcon onClick={() => setIsOpen(false)} src={envelope} height={50} width={24} title="мои сообщения" alt="мои сообщения" ></ButtonIcon>
          </Link>
          <Link href={'/favorites'}>
            <ButtonIcon onClick={() => setIsOpen(false)} src={favorites} height={50} width={24} title="избранное" alt="избранное"></ButtonIcon>
            <FavoriteCountClient />
          </Link>
          <ButtonIcon onClick={() => {
            signOut()
            setIsOpen(false)
          }} height={50} width={32} src={signOutImg} title="выйти" alt="профиль"></ButtonIcon>
        </>
        :
        <>
          <Link href={'/signup'}>
            <ButtonIcon onClick={() => setIsOpen(false)} width={24} height={50} src={signUp} title="регистрация" alt="регистрация" />
          </Link>
          <ButtonIcon onClick={() => {
            signIn();
            setIsOpen(false)
          }} width={24} height={50} src={signInImg} title="войти" alt="профиль" />
        </>
      }
    </nav>}
  </div>;
}

export default memo(BurgerMenu)