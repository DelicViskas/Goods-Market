/* eslint-disable @typescript-eslint/no-explicit-any */
import { Categories } from "@prisma/client";
import { memo, useState } from "react";
import Button from "../../Button/Button";
import Spinner from "../../Spinner";

function TableRow({ obj,
  editableFields,
  categories,
  onSave,
  onDelete,
}:
  {
    obj: Record<string, any>;
    editableFields: string[];

    categories: Categories[] | undefined;
    onSave: (id: string | number, editValues: Record<string, string>) => void;
    onDelete: () => Promise<void>;
  }) {


  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);


  const handleEdit = () => {
    const initialValues: Record<string, string> = {};
    editableFields.forEach((field) => {
      if (field === 'category') {
        const categoryId = categories?.find(cat => cat.name === (obj as any).category)?.id ?? '';
        initialValues[field] = String(categoryId);
      } else {
        initialValues[field] = String(obj[field as keyof typeof obj] ?? '');
      }
    });
    setEditValues(initialValues);
    setIsEditing(true)
  };

  const handleSave = () => {
    setIsEditing(false)
    onSave(obj.id, editValues);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete();
    setIsDeleting(false);
  };

  return <tr>
    {Object.entries(obj).map(([key, value]) => (
      <td key={obj.id + key}>
        {isEditing && editableFields.includes(key) ? (
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
    ))}
    <td>
      {isEditing ? (
        <>
          <Button onClick={handleSave}>💾</Button>
          <Button onClick={() => setIsEditing(false)}>⛔</Button>
        </>
      ) : (
        <>
          <Button onClick={handleEdit}>✏️</Button>
          {isDeleting ? <Spinner /> : <Button onClick={handleDelete}>❌</Button>}
        </>
      )}
    </td>
  </tr>
}

export default memo(TableRow);