import { memo, useState } from 'react';
import Button from "../../Button/Button";

function AddRow({ fieldsToBeAdded, createObj, setIsAdded, columns }: { createObj: (newValues: Record<string, string>) => Promise<void>, setIsAdded: (value: boolean) => void, fieldsToBeAdded: string[], columns: string[] }) {
  const [newValues, setNewValues] = useState<Record<string, string>>({});

  return <tr>
    {columns.map((key) => (
      <td key={key}>
        {fieldsToBeAdded.includes(key) ? (
          <input
            type="text"
            value={newValues[key] || ''}
            onChange={(e) => setNewValues({ ...newValues, [key]: e.target.value })}
          />
        ) : (
          <></>
        )}
      </td>
    ))}
    <td>
      <Button onClick={() => createObj(newValues)}>💾</Button>
      <Button onClick={() => setIsAdded(false)}>⛔</Button>
    </td>
  </tr>
};

export default memo(AddRow);