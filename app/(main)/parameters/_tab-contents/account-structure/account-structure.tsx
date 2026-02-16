// import { useLayoutEffect, useState } from "react"
// import AppDataTable from "@/components/app/app-data-table";
// import { columns } from "./_components/column";
// import apiHandler from "@/data/api/ApiHandler";
// import { ICampus } from "@/data/interface/ICampus";

// function AccountStructures() {
//     const [tableLoader, setTableLoader] = useState<boolean>(false)
//     const [data, setData] = useState<IAccountStructure[]>([])

//     useLayoutEffect(() => {
//         setTableLoader(true)
//         getAccountStructureData()
//             .then((data) => {
//                 setData(data)
//                 setTableLoader(false)
//             });
//     }, [])

//     return (
//         <>
//             <AppDataTable loading={tableLoader} columns={columns} data={data} title="Academic Levels" filter='name' filterPlaceholder="Filter account names..." />
//         </>
//     )
// }

// export default AccountStructures

// export async function getAccountStructureData() {
//     const Info = await apiHandler.academicLevels.list();
//     return Info?.content ?? [];
// }
