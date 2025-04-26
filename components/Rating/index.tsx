"use client"

import { Rev } from "@/app/user/[id]/rating/page";
import classes from "./index.module.css";
import ReviewsList from "./ReviewsList";
import ReviewsTable from "./ReviewsTable";
import { getObjRatings } from "@/f";
import { memo } from "react";



function Rating({ reviews }: { reviews: Rev[] }) {
  
  return <div className={classes.rating}>
    <ReviewsTable ratings={getObjRatings(reviews)} />
    <ReviewsList reviews={reviews} />
  </div>;
}

export default memo(Rating);




