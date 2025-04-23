import { auth } from "@/auth";
import GoodPage from "@/components/Good/GoodPage";
import { getAverageRating } from "@/f";
import { prisma } from "@/prisma/prisma";
import { notFound } from "next/navigation";

export default async function Home({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  const good = await prisma.goods.findUnique({
    where: {
      id: Number(id)
    },
    include: {
      account: {
        select: {
          name: true,
          receivedReviews: true,
          image: true
        }
      },
      category: {
        select: {
          name: true,
        }
      }
    }
  });


  if (!good) return notFound();

  const { category, account, ...goodItem } = good;
  const goodAndU = {
    ...goodItem,
    accountName: account.name,
    accountImage: account.image,
    accountRating: getAverageRating(account.receivedReviews),
    accountReviews: account.receivedReviews.length,
    category: category.name
  }

  return <GoodPage session={session} good={goodAndU} />
}
