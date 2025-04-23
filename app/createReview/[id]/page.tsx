import { auth } from "@/auth";
import FormCreateReview from "@/components/FormCreateReview";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) redirect('/');

  return <FormCreateReview sender={userId} receiver={id} />
}