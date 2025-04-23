import { signOut } from "@/auth"
import ButtonIcon from "../Button/Button-icon"
import signOutImg from '@/public/signOutImg.svg'

export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <ButtonIcon height={50} width={32}  src={signOutImg} title="профиль" alt="профиль"></ButtonIcon>
    </form>
  )
}