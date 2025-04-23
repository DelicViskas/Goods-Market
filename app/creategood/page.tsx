import { auth } from "@/auth";
import FormCreateGood from "@/components/FormCreateGood";
import Spinner from "@/components/Spinner";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Home() {
  const session = await auth();
  if (!session) redirect('/')

  return <Suspense fallback={<div className="center"><Spinner /></div>}>
    <FormCreateGood />
  </Suspense>
}