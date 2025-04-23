
import { Categories, User } from "@prisma/client";
import { Good } from "../GoodList/GoodList";
import classes from "./Table.module.css";
import { fetcher } from "@/swr/fetcher";
import useSWR, { mutate } from "swr";
import Spinner from "../Spinner";
import ErrorPage from "@/app/error";
import Button from "../Button/Button";
import { useState } from "react";
import { TableName } from ".";
import add from '@/public/plus.svg'
import ButtonIcon from "../Button/Button-icon";
import { useCategories } from "@/hooks/useCategories";

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


export default function Table({ url, tableName }: { url: string, tableName: TableName }) {
  const { data, error, isLoading } = useSWR<User[] | Categories[] | Good[] | Blobs[]>(url, fetcher);
  const [deletingId, setDeletingId] = useState<string | number | null>(null);
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [newValues, setNewValues] = useState<Record<string, string>>({});
  const [isAdded, setIsAdded] = useState(false);
  const { data: categories } = useCategories()

  const editableFields = tableConfigs[tableName].editableFields || [];
  const fieldsToBeAdded = tableConfigs[tableName].fieldsToBeAdded;

  const delObj = async (props: User | Categories | Good | Blobs) => {
    setDeletingId(props.id);
    const id: string | number = Object.keys(props).includes('url') ? (props as Blobs).url : props.id;
    try {
      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (!res.ok) throw new Error("Ошибка удаления записи");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mutate(url, (data?: any) => data.filter((object: any) => object.id !== props.id), true);
    } catch (error) {
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  const createObj = async () => {
    try {

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newValues),
      })
      if (!res.ok) throw new Error("Ошибка при создании");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mutate(url, (data?: any) => [...data, { ...newValues, id: data.at(-1).id + 1 }], true);
      setNewValues({});
      setIsAdded(false);
    } catch (error) {
      console.log(error);
    }
  }

  const saveEdit = async (id: string | number) => {
    try {
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...editValues })
      });
      if (!res.ok) throw new Error("Ошибка обновления");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mutate(url, (data?: any) => data.map((obj: any) => obj.id === id ? { ...obj, ...editValues } : obj), true);
    } catch (error) {
      console.error(error);
    } finally {
      setEditingId(null);
      setEditValues({});
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  if (isLoading) return <Spinner classes="center" />;
  if (error) return <ErrorPage error={error} />;
  if (!data) return null;

  return (
    <table className={classes.table}>
      <thead>
        <tr>
          {Object.keys(data[0]).map(key => <th key={key}>{key}</th>)}
          <th>
            {fieldsToBeAdded && <ButtonIcon onClick={() => setIsAdded(true)} src={add} height={15} width={50} title="разместить объявление" alt="разместить объявление" />}
          </th>
        </tr>
      </thead>
      <tbody>
        {isAdded && fieldsToBeAdded && <tr>
          {Object.keys(data[0]).map((key) => {
            const isAdded = fieldsToBeAdded.includes(key);
            if (isAdded) {
              return <td key={key}>
                {key === 'category' ?
                  <select
                    name="category"
                    value={newValues[key] ?? ''}
                    key={key}
                    onChange={(event) => setNewValues(prev => ({ ...prev, [key]: event.target.value }))} required>
                    {categories?.map((cat) =>
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    )}
                  </select>
                  :
                  <input
                    type={key === 'price' ? "number" : "text"}
                    required
                    minLength={3}
                    name={key}
                    value={newValues[key] ?? ''}
                    onChange={(event) => setNewValues(prev => ({ ...prev, [key]: event.target.value }))}
                  />}
              </td>
            }
            else
              return <td key={key}></td>
          }
          )}
          <td>
            <>
              <Button onClick={() => createObj()}>💾</Button>
              <Button onClick={() => setIsAdded(false)}>⛔</Button>
            </>
          </td>
        </tr>}
        {data.map((obj) => {
          const isEditing = editingId === obj.id;
          console.log();

          return (
            <tr key={obj.id}>
              {Object.keys(data[0]).map(key => {
                let value = obj[key as keyof typeof obj];
                if (key === 'createdAt' || key === 'updatedAt') {
                  value = new Date(value).toLocaleDateString();
                }

                const isEditable = editableFields.includes(key);

                return (
                  <td key={obj.id + key}>
                    {isEditing && isEditable ? (
                      key === 'role' ?
                        <select value={editValues[key] ?? String(value ?? '')}
                          onChange={(e) =>
                            setEditValues((prev) => ({ ...prev, [key]: e.target.value }))
                          }>
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                        : key === 'category' ?
                          <select
                            name="category"
                            value={editValues[key]}
                            onChange={(event) =>
                              setEditValues((prev) => ({ ...prev, [key]: event.target.value }))
                            }
                            required
                          >
                            {categories?.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                          : key === 'description' ?
                            <textarea
                              value={editValues[key] ?? String(value ?? '')}
                              onChange={(e) =>
                                setEditValues((prev) => ({ ...prev, [key]: e.target.value }))
                              } />
                            : key === 'price' ?
                              <input type="number" value={editValues[key] ?? String(value ?? '')}
                                onChange={(e) =>
                                  setEditValues((prev) => ({ ...prev, [key]: e.target.value }))
                                } />
                              :
                              <input type="text" value={editValues[key] ?? String(value ?? '')}
                                onChange={(e) =>
                                  setEditValues((prev) => ({ ...prev, [key]: e.target.value }))
                                } />
                    ) : (
                      <span>{String(value)}</span>
                    )}
                  </td>
                );
              })}
              <td>
                {isEditing ? (
                  <>
                    <Button onClick={() => saveEdit(obj.id)}>💾</Button>
                    <Button onClick={cancelEdit}>⛔</Button>
                  </>
                ) : (
                  <>
                    {!!editableFields.length && <Button onClick={() => {
                      setEditingId(obj.id);
                      const initialValues: Record<string, string> = {};
                      editableFields.forEach((field) => {
                        if (field === 'category') {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          const categoryId = categories?.find(cat => cat.name === (obj as any).category)?.id ?? '';
                          initialValues[field] = String(categoryId);
                        } else {
                          initialValues[field] = String(obj[field as keyof typeof obj] ?? '');
                        }
                      });
                      setEditValues(initialValues);
                    }}>
                      ✏️
                    </Button>}
                    {obj.id === deletingId
                      ? <Spinner />
                      : <Button onClick={() => delObj(obj)}>❌</Button>}
                  </>
                )}
              </td>

            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
