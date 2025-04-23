import { Rev } from '@/app/user/[id]/rating/page';
import classses from './index.module.css'
import RatingStars from "./RatingStars";
import iconPlaceh from '@/public/iconPlaceh.svg'
import Image from "next/image";


export default function ReviewsList({reviews}: {reviews: Rev[]}) {
  
  return reviews.map(rev => {
    return <div key={rev.id} className={classses.review}>
      <div className={classses.infoSender}>
        <Image src={rev.sender.image ?? iconPlaceh} width={50} height={50} alt="иконка пользователя" />
        <div>
          <h3>{rev.sender.name}</h3>
          <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
      <RatingStars rating={rev.rating}/>
      <p>{rev.comment}</p>
    </div>
  })
}