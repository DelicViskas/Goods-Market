import { ReactNode } from "react";
import classes from "./Button.module.css";

export default function Button({onClick,  classname,disabled = false, children, type='button'} : {onClick?: (event?: React.FormEvent)=>void,disabled?: boolean, children: string | ReactNode, classname?: string, type?: 'button' | 'submit' | 'reset' | undefined}) {
  return <button type={type} disabled={disabled} onClick={onClick} className={`${classes.btn} ${classname}`}>{children}</button>
}