import { useState } from "react";
import Button from "../Button/Button";
import classes from "./index.module.css";


export default function EditName({ name, onClose, onSave }: { name: string, onClose: () => void, onSave: (name: string) => void }) {
  const [userName, setUserName] = useState(name)

  return <div className={classes.editName}>
    <label htmlFor="">Введите имя</label>
    <input type="text" value={userName} onChange={(event) => setUserName(event.target.value)} />
    <Button onClick={() => { if (userName.trim()) onSave(userName) }}>OK</Button>
    <Button onClick={onClose}>Cancel</Button>
  </div>;
}