import { Good } from "../GoodList/GoodList";
import classes from './good.module.css';
import AccountPreview from "../AccountPreview";
import { Session } from "next-auth";
import ClientImageGallery from "./ClientImageGallery";

type GoodAndU = Good & {
  accountName: string | null,
  accountImage: string | null,
  accountRating: number,
  accountReviews: number,
  category: string
};

export default function GoodPage({ good, session }: { good: GoodAndU, session: Session | null }) {
  const date = new Date(good.createdAt);
  const createdAt = `${date.toLocaleDateString()} в ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div className={classes.good}>
      <div className={classes.column1}>
        <h1>{good.title}</h1>
        <span>{good.price} ₽</span>
        <ClientImageGallery images={good.image} />

        <h4>Категория: <span>{good.category}.</span></h4>
        <h2>Описание</h2>
        <pre>{good.description}</pre>
        <hr />
        <span>{`№${good.id} · ${createdAt}`}</span>
      </div>

      <div className={classes.column2}>

        <AccountPreview
          session={session}
          name={good.accountName}
          img={good.accountImage}
          id={good.accountId}
          rating={good.accountRating}
          accountReviews={good.accountReviews}
        />
      </div>
    </div>
  );
}

