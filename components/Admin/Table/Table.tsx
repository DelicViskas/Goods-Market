/* eslint-disable @typescript-eslint/no-explicit-any */

import { Categories, User } from "@prisma/client";
import { Good } from "../../GoodList/GoodList";
import classes from "./Table.module.css";
import { fetcher } from "@/swr/fetcher";
import useSWR, { mutate } from "swr";
import Spinner from "../../Spinner";
import ErrorPage from "@/app/error";
import { memo, useCallback, useState } from "react";
import { TableName } from "..";
import add from '@/public/plus.svg'
import ButtonIcon from "../../Button/Button-icon";
import { useCategories } from "@/hooks/useCategories";
import TableRow from "./TableRow";
import AddRow from "./AddRow";

export const tableConfigs = {
  Users: {
    editableFields: ['name', 'email', 'role'],
    fieldsToBeAdded: null
  },
  Categories: {
    editableFields: ['name'],
    fieldsToBeAdded: ['name']
  },
  Goods: {
    editableFields: ['title', 'price', 'description', 'category'],
    fieldsToBeAdded: ['title', 'price', 'description', 'category', 'account', 'image']
  },
  BlobImages: {
    editableFields: null,
    fieldsToBeAdded: null
  }
};

type Blobs = {
  downloadUrl: string
  id: number
  pathname: string
  size: number
  uploadedAt: string
  url: string
}


function Table({ url, tableName }: { url: string, tableName: TableName }) {
  console.log('render Table');

  const { data, error, isLoading } = useSWR<User[] | Categories[] | Good[] | Blobs[]>(url, fetcher);
  const [isAdded, setIsAdded] = useState(false);
  const { data: categories } = useCategories()

  const editableFields = tableConfigs[tableName].editableFields || [];
  const fieldsToBeAdded = tableConfigs[tableName].fieldsToBeAdded;

  const delObj = useCallback(async (props: User | Categories | Good | Blobs) => {

    const id: string | number = Object.keys(props).includes('url') ? (props as Blobs).url : props.id;
    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error("Ошибка удаления записи");
      mutate(url, (data?: any) => data.filter((object: any) => object.id !== props.id), true);
    } catch (error) {
      console.error(error);
    }
  }, [url]);

  const createObj = useCallback(async (newValues: Record<string, string>) => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newValues),
      });
      if (!res.ok) throw new Error("Ошибка при создании");

      mutate(url, (data: any) => [...data, { ...newValues, id: data.at(-1).id + 1 }], true);
      setIsAdded(false);
    } catch (error) {
      console.log(error);
    }
  }, [url]);

  const saveEdit = useCallback(async (id: string | number, editValues: Record<string, string>) => {
    try {
      mutate(url, (data: any) => {
        const updatedItem = data.find((item: any) => item.id === id);
        if (updatedItem) {
          const category = categories?.find((cat) => cat.id === Number(editValues.category));
          if (category) {
            updatedItem.category = category.name;
          }
          Object.assign(editValues, updatedItem);
        }
        return [...data];
      }, false);

      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editValues })
      });
      if (!res.ok) throw new Error("Ошибка обновления");
      mutate(url, async (data: any) => {
        const updatedData = await data.map((item: any) => item.id === id ? { ...item, ...editValues } : item);
        return updatedData;
      });
    } catch (error) {
      console.error(error);
    }
  }, [categories, url]);


  if (isLoading) return <Spinner classes="center" />;
  if (error) return <ErrorPage error={error} />;
  if (!data) return null;

  return (
    <table className={classes.table}>
      <thead>
        <tr>
          {Object.keys(data[0]).map(key => <th key={key}>{key}</th>)}
          <th>
            {fieldsToBeAdded &&
              <ButtonIcon onClick={() => setIsAdded(true)} src={add} height={15} width={50} title="разместить объявление" alt="разместить объявление" />}
          </th>
        </tr>
      </thead>
      <tbody>
        {isAdded && fieldsToBeAdded &&
          <AddRow
            columns={Object.keys(data[0]) as string[]}
            fieldsToBeAdded={fieldsToBeAdded}
            createObj={createObj}
            setIsAdded={setIsAdded}
          />
        }
        {data.map((obj) => (
          <TableRow
            key={obj.id}
            obj={obj}
            editableFields={editableFields}
            categories={categories}
            onSave={saveEdit}
            onDelete={async () => await delObj(obj)}
          />
        ))}
      </tbody>
    </table>
  );
}

export default memo(Table)

