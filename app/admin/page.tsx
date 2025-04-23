import { auth } from "@/auth";
import AdminPanel from "@/components/Admin";
import { notFound } from "next/navigation";



export default async function Home() {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') notFound();

  return <AdminPanel />
}