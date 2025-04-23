import classes from "./skeleton.module.css";

export default function AccountSkeleton() {
  return <div className={classes.account}>
    <div className={classes.circle}></div>
    <span className={classes.rating}></span>
    <span></span>
    <span></span>
    <span></span>
  </div>;
}