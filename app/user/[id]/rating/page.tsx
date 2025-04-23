
import Rating from "@/components/Rating";
import { prisma } from "@/prisma/prisma";
import { Reviews } from "@prisma/client";

export type Rev = Reviews & {
  sender: {
    name: string | null,
    image: string | null
  }
}

export default async function Home({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const reviews: Rev[] = await prisma.reviews.findMany({
    where: {
      receiver_rw: id
    },
    include: {
      sender: {
        select: {
          name: true,
          image: true,
        }
      }
    }
  });
  return <Rating reviews={reviews} />
}