import { auth } from "@/auth";
import GoodsList from "@/components/GoodList/GoodList";


export default async function Home() {
  const session = await auth();

  return <GoodsList session={session} type={'favorites'} />
}