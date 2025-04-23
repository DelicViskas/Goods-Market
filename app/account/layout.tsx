import { auth } from "@/auth";
import Account from "@/components/Account/Account";
import Skeleton from "@/components/skeleton/Goods";
import { redirect } from "next/navigation";


export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session) redirect('/');
  if (session === null) return <Skeleton />

  return (
    <div className="profilePage">
      <Account />
      <div>
        {children}
      </div>

    </div>
  );
}