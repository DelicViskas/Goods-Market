import Image from "next/image";
import classes from "./Button-icon.module.css";

export default function ButtonIcon({ onClick, src, height, width, title, alt }: { onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void, src: string, height: number, width: number, title: string, alt: string }) {
  return <button type="button" className={classes.btnIcon} onClick={onClick}>
    <Image src={src} height={height} width={width} title={title} alt={alt} />
  </button>
}