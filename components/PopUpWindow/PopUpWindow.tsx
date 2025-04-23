import classes from "./PopUpWindow.module.css";


export default function PopUpWindow({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className={`${classes.popup} noscroll`} onClick={onClose}> 
      <div onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}