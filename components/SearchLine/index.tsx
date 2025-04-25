'use client'

import { useCategories } from "@/hooks/useCategories";
import { memo, useCallback, useEffect, useState } from "react";
import CustomSelect from "./CustomSelect";
import SmartInput from "./SmartInput";
import classes from './index.module.css'
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function SearchLine() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [valueInput, setValueInput] = useState('');
  const pathname = usePathname();
  const { data: categories } = useCategories();

  const handleChangeCategory = useCallback((id: string) => {
    const params = new URLSearchParams();
    params.set('categoryId', id);
    setValueInput('');  
    router.push(`/?${params.toString()}`);
  }, [router]);

  const handleChangeSearch = useCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('search', value);
    router.push(`/?${params.toString()}`);
  }, [router, searchParams]);

  useEffect(() => {
    const search = searchParams.get('search') || '';
    setValueInput(search);
  }, [searchParams, pathname]);

  return <div className={classes.search}>
    <CustomSelect onChange={handleChangeCategory} options={categories || []} />
    <SmartInput valueInput={valueInput} setValueInput={setValueInput} setValue={handleChangeSearch} />
  </div>;
}


export default memo(SearchLine);


