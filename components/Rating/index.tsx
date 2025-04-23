"use client"

import { Rev } from "@/app/user/[id]/rating/page";
import classes from "./index.module.css";
// import useSWR from "swr";
// import { fetcher, reviewsURL } from "@/swr/fetcher";
import ReviewsList from "./ReviewsList";
import ReviewsTable from "./ReviewsTable";
// import { Reviews } from "@prisma/client";
// import ErrorPage from "@/app/error";
import { getObjRatings } from "@/f";
// import ReviewsSkeleton from "../skeleton/ReviewsSkeleton";



export default function Rating({ reviews }: { reviews: Rev[] }) {

    return <div className={classes.rating}>
      <ReviewsTable ratings={getObjRatings(reviews)} />
      <ReviewsList reviews={reviews} />
    </div>;
}




