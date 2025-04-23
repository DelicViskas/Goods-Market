import classes from "./skeleton.module.css";

export default function Skeleton() {
  return <>
    <div className={classes.sortDiv}></div>
    <div className="grid">{Array.from({ length: 20 }, (_, i: number) =>
      <div className={`${classes.skeletonGrid} noscroll`} key={i + Math.random()}>
        <div className={classes.div}></div>
        <span className={classes.long}></span>
        <span className={classes.short}></span>
      </div >)}
    </div>
  </>
}
