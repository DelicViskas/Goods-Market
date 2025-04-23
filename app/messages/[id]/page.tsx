import { auth } from "@/auth";
import Chat from "@/components/Chat";
import { redirect } from "next/navigation";

export default async function Home({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (session?.user?.id === id) redirect('/');
  if (!session) redirect('/');

  return <Chat id={id} session={session} />
}