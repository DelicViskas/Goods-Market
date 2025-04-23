import { auth } from "@/auth";
import MessageList from "@/components/MessageList/MessageList";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  if (!session) redirect('/');

  return <MessageList session={session} />
}