import { signIn } from "@/auth"
import { ReactElement } from "react"


export default function SignIn({children}: {children: ReactElement}) {
  return (
    <form
      action={async () => {
        "use server"
        await signIn()
      }}
    >
      {children}
    </form>
  )
}