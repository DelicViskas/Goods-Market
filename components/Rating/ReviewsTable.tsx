
import Image from "next/image";
import styles from "./index.module.css";
import RatingInfo from "./RatingStars";
import { getStarsFill } from "@/f";

type Ratings = {
  1?: number;
  2?: number;
  3?: number;
  4?: number;
  5?: number;
};

export default function ReviewsTable({ ratings }: { ratings: Ratings }) {
  const total = Object.values(ratings).reduce((acc, val) => acc + val, 0);
  const average =
    total === 0
      ? 0
      : (
        Object.entries(ratings).reduce(
          (acc, [key, val]) => acc + Number(key) * val,
          0
        ) / total
      ).toFixed(1);

  return (
    <div className={styles.ratingSummary}>
      <h1>Рейтинг</h1>
      <div className={styles.averageBlock}>
        <div className={styles.average}>{average}</div>
        <div className={styles.stars}>
          <RatingInfo rating={Number(average)} />
          <div className={styles.total}>
            на основании {total} оценок
          </div>
        </div>
      </div>

      <div className={styles.bars}>
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratings[star as keyof Ratings] || 0;
          const percent = total ? (count / total) * 100 : 0;

          return (
            <div key={star} className={styles.barRow}>
              {getStarsFill(star).map((src, i) => <Image key={`${star}-${i}`} src={src} alt="звезда" />)}
              <div className={styles.barBackground}>
                <div
                  className={styles.barFill}
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className={styles.count}>{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

