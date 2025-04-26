import Image from "next/image";
import fullStar from '@/public/full-star.svg'
import halfStar from '@/public/half-star.svg'
import emptyStar from '@/public/empty-star.svg'
import { memo } from "react";

function RatingStars({ rating, totalStars = 5 }: { rating: number, totalStars?: number }) {
  const getStarType = (index: number) => {
    const starRating = rating - index;
    if (starRating >= 0.85) return 'full';
    if (starRating >= 0.15) return 'half';
    return 'empty';
  };

  return (
    <div>
      {Array(totalStars)
        .fill(0)
        .map((_, index) => {
          const starType = getStarType(index);
          if(starType === 'full') return <Image key={index} src={fullStar} width={27} height={27} alt="full star"/>
          if(starType === 'half') return <Image key={index} src={halfStar} width={27} height={27} alt="half star"/>
          if(starType === 'empty') return <Image key={index} src={emptyStar} width={27} height={27} alt="empty star"/>
        })}

    </div>
  );
}

export default memo(RatingStars);