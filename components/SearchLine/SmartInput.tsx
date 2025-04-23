import ButtonIcon from "../Button/Button-icon";
import search from '@/public/search.svg'
import remove from '@/public/closegray.svg'
import classes from './SmartInput.module.css'

export default function SmartInput({ valueInput, setValueInput, setValue }: { valueInput: string, setValueInput: (value: string) => void; setValue: (value: string) => void }) {

  return <label className={classes.input}>
    <input
      type="text"
      value={valueInput}
      onKeyDown={event => {
        if (event.key === 'Enter')
          setValue(valueInput)
      }}
      onChange={(event) => setValueInput(event.target.value)} />
    {valueInput && <ButtonIcon
      onClick={() => {
        setValue('');
        setValueInput('')
      }} src={remove}
      width={25}
      height={25}
      alt="удалить"
      title="удалить" />}
    <ButtonIcon
      onClick={() => setValue(valueInput)}
      src={search}
      width={20}
      height={20}
      alt="поиск"
      title="поиск" />
  </label>
}