import { categoriesURL, fetcher } from "@/swr/fetcher"
import { Categories } from "@prisma/client"
import useSWR from "swr"

export const useCategories = () => {
  return useSWR<Categories[]>(categoriesURL, fetcher)
}