import { utils, writeFile } from "xlsx";
import { IStudent } from "@/data/interface/IStudent";

interface ExportSageCustomersOptions {
  students: IStudent[];
  fileName?: string;
}

export const exportSageCustomers = async ({
  students,
  fileName = "Sage_Students_Customers",
}: ExportSageCustomersOptions): Promise<void> => {
  try {
    const customersData = students.map((s) => {
      const cleanId = (s.studentCode || s.code || "").replace(/[^0-9]/g, "");
      return {
        IDCUST: cleanId,
        TEXTSNAM: s.firstName || "",
        IDGRP: "CUS001",
        IDNATACCT: "",
        SWACTV: "1",
        DATEINAC: "",
        SWHOLD: "0",
        DATESTART: "9/1/2025",
        NAMECUST: `${(`${s.lastName} ${s.firstName} ${s.middleName || ""}`).trim()}`.toUpperCase(),
        TEXTSTRE1: "",
        TEXTSTRE2: "",
        TEXTSTRE3: "",
        TEXTSTRE4: "",
        NAMECITY: s.stateOrigin || "",
        CODESTTE: s.stateOrigin || "",
        CODEPSTL: "",
        CODECTRY: s.nationality || "",
        NAMECTAC: "",
        TEXTPHON1: "+234000999",
        TEXTPHON2: "",
        CODETERR: "",
        IDACCTSET: "CUS001",
        IDAUTOCASH: "",
        IDBILLCYCL: "MTH",
        IDSVCCHRG: "PROF01",
        CODECURN: s.currency || "NGN",
        SWPRTSTMT: "1",
        SWBALFWD: "1",
        CODETERM: "ADP1",
        IDRATETYPE: "SP",
        CODETAXGRP: "FIRS",
        IDTAXREGI1: "",
        IDTAXREGI2: "",
        IDTAXREGI3: "",
        IDTAXREGI4: "",
        IDTAXREGI5: "",
        TAXSTTS1: "2",
        TAXSTTS2: "2",
        TAXSTTS3: "0",
        TAXSTTS4: "0",
        TAXSTTS5: "0",
        AMTCRLIMT: "0",
        CODESLSP1: "",
        PCTSASPLT1: "0",
        EMAIL1: s.accountEmail || "",
        EMAIL2: "",
        BRN: s.accountName || "",
      };
    });

    const optionalValuesData: Record<string, any>[] = [];

    students.forEach((s) => {
      const cleanId = (s.studentCode || s.code || "").replace(/[^0-9]/g, "");
      const pushRow = (optfield: string, value: string, fdesc: string, vdesc: string) => {
        optionalValuesData.push({
          IDCUST: cleanId,
          OPTFIELD: optfield,
          VALUE: value,
          TYPE: 1,
          LENGTH: 60,
          DECIMALS: 0,
          ALLOWNULL: "FALSE",
          VALIDATE: "FALSE",
          SWSET: 1,
          VALINDEX: 21,
          VALIFTEXT: value,
          VALIFMONEY: 0,
          VALIFNUM: 0,
          VALIFLONG: 0,
          VALIFBOOL: "FALSE",
          VALIFDATE: "",
          VALIFTIME: "12:00:00 AM",
          FDESC: fdesc,
          VDESC: vdesc,
        });
      };

      pushRow("001", s.classCode || "", "Level",`${s.className || s.academicLevelCode || s.classCode || ""} Level`);
      pushRow("002", s.programCode || "", "Programme", s.streamName || "");
      pushRow("003", s.departmentCode || "", "Department", s.departmentName || "");
      pushRow("004", s.facultyCode || "", "Faculty", s.departmentName ? `FACULTY OF ${s.departmentName}` : "");
      pushRow("GEN", s.gender || "", "GENDER", s.gender || "");
    });

    const wb = utils.book_new();
    utils.book_append_sheet(wb, utils.json_to_sheet(customersData), "Customers");
    utils.book_append_sheet(wb, utils.json_to_sheet(optionalValuesData), "Customer_Optional_Field_Values");
    writeFile(wb, `${fileName}.xlsx`);
  } catch (error) {
    console.error("Error exporting Sage workbook:", error);
    throw new Error("Failed to export Sage workbook");
  }
};
