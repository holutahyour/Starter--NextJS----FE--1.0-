import { useLayoutEffect, useState } from "react";
import AppDataTable from "@/components/app/app-data-table";
import { columns } from "./_components/column";
import apiHandler from "@/data/api/ApiHandler";
import { IAcademicPosition } from "@/data/interface/IAcademicPosition";

function AcademicPositions() {
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [data, setData] = useState<IAcademicPosition[]>([]);

  useLayoutEffect(() => {
    setTableLoader(true);
    getAcademicPositionsData().then((data) => {
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
        title="Academic Positions"
        filter="name"
        filterPlaceholder="Filter account names..."
      />
    </>
  );
}

export default AcademicPositions;

export async function getAcademicPositionsData() {
  const Info = await apiHandler.academicPosition.list();
  return Info?.content ?? [];
}
