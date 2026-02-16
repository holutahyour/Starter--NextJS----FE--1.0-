import { useLayoutEffect, useState } from "react";
import AppDataTable from "@/components/app/app-data-table";
import { columns } from "./_components/column";
import apiHandler from "@/data/api/ApiHandler";
import { IFeeAccount } from "@/data/interface/IFeeAcount";

function FeeAccounts() {
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [data, setData] = useState<IFeeAccount[]>([]);

  useLayoutEffect(() => {
    setTableLoader(true);
    getFeeAccountsData().then((data) => {
      setData(data);
      setTableLoader(false);
    });
  }, []);

  return (
    <>
      <AppDataTable
        loading={tableLoader}
        columns={columns}
        data={data}
        title="Fee Accounts"
        filter="accountName"
        filterPlaceholder="Filter account names..."
      />
    </>
  );
}

export default FeeAccounts;

export async function getFeeAccountsData() {
  const Info = await apiHandler.feeAccount.list();
  return Info?.content ?? [];
}
