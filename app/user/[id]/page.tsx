import { auth } from "@/auth";
import AuthorGoodList from "@/components/AuthorGoodList";
import { prisma } from "@/prisma/prisma";

export default async function Home({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const { id } = await params;
  const userId = session?.user?.id;

  const goods = await prisma.goods.findMany({
    where: {
      accountId: id,
    },
    include: {
      Favorites: userId ? { where: { accountId: userId } } : false,
    },
  })
  const goodsAndFavorites = goods.map(({ Favorites, ...good }) => ({
    ...good,
    isFavorite: Favorites?.length > 0,
  }))

  if (goods.length) return <AuthorGoodList session={session} goods={goodsAndFavorites} />
  return <div className="center top"><h3>Нет товаров</h3></div>
}