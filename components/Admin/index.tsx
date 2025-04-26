'use client'
import classes from "./Table/Table.module.css";
import { adminCategoriesURL, adminGoodsURL, adminUsersURL, blobURL } from "@/swr/fetcher";
import { useCallback, useState } from "react";
import Table from "./Table/Table";
import Button from "../Button/Button";
import { useRouter } from "next/navigation";

const tableLinks = {
  Users: adminUsersURL,
  Categories: adminCategoriesURL,
  Goods: adminGoodsURL,
  BlobImages: blobURL
}
export type TableName = keyof typeof tableLinks;

export default function AdminPanel() {
  const [activeTable, setActiveTable] = useState<TableName | null>(null);
  const router = useRouter();
  const onClick = useCallback((name: TableName) => {
    setActiveTable(name);
  }, [])

  return <>
    <div className={classes.adminPanel}>
      <div className={classes.btnGroup}>
        <div className={classes.btnFetch}>
          {Object.keys(tableLinks).map(name => {
            const isActive = name === activeTable;
            return <button className={isActive ? classes.active : ''} onClick={() => onClick(name as TableName)} key={name}>
              {name}
            </button>
          })}
        </div>
        <div className={classes.exit}><Button onClick={() => router.push('/')}>Выйти</Button></div>
      </div>
      <div className={classes.data}>{activeTable && <Table url={tableLinks[activeTable]} tableName={activeTable} />}</div>
    </div>
  </>
}
