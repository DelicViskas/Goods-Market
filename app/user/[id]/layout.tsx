import AuthorInfo from "@/components/AuthorInfo";
import { prisma } from "@/prisma/prisma";
import { notFound } from "next/navigation";
import { ReactNode } from "react";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      receivedReviews: true
    }
  })

  if (!user) return notFound();

  return (
    <div className="profilePage">
      <AuthorInfo user={user} />
      <div>
        {children}
      </div>
    </div>
  );
}