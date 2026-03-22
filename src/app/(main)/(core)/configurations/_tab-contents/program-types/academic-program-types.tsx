import { useLayoutEffect, useState } from "react";
import AppDataTable from "@/components/app/app-data-table";
import { columns } from "./_components/column";
import apiHandler from "@/data/api/ApiHandler";
import { ICampus } from "@/data/interface/ICampus";
import { IAcademicPrograms } from "@/data/interface/IAcademicPrograms";

function AcademicProgramTypes() {
  const [tableLoader, setTableLoader] = useState<boolean>(false);
  const [data, setData] = useState<IAcademicPrograms[]>([]);

  useLayoutEffect(() => {
    setTableLoader(true);
    getAcademicProgramTypesData().then((data) => {
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
        title="Academic Program Types"
        filter="name"
        filterPlaceholder="Filter account names..."
      />
    </>
  );
}

export default AcademicProgramTypes;

export async function getAcademicProgramTypesData() {
  const Info = await apiHandler.academicPrograms.list();
  return Info?.content ?? [];
}
