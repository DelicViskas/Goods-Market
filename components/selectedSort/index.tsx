import { useRouter, useSearchParams } from "next/navigation"

export default function SelectedSort() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`?${params.toString()}`);
  };

  return (
    <select className='selectSort' name="sort" value={searchParams.get('sort') || ''} onChange={handleChange}>
      <option value="datedown">По дате: Сначала новые</option>
      <option value="dateup">По дате: Сначала старые</option>
      <option value="priceup">По цене: Возрастанию</option>
      <option value="pricedown">По цене: Убыванию</option>
    </select>
  );
}