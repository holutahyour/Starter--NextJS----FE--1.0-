import { useLayoutEffect, useState } from "react";
import AppDataTable from "@/components/app/app-data-table";
import { columns } from "./_components/column";
import apiHandler from "@/data/api/ApiHandler";
import { IAcademicAward } from "@/data/interface/IAcademicAward";

function AcademicAwards() {
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [data, setData] = useState<IAcademicAward[]>([]);

  useLayoutEffect(() => {
    setTableLoader(true);
    getAcademicAwardsData().then((data) => {
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
        title="Academic Awards"
        filter="name"
        filterPlaceholder="Filter account names..."
      />
    </>
  );
}

export default AcademicAwards;

export async function getAcademicAwardsData() {
  const Info = await apiHandler.academicAward.list();
  return Info?.content ?? [];
}
