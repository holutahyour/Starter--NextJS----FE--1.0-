import { utils, writeFile } from "xlsx";

interface ExportToExcelOptions {
  data: any[];
  sheetName: string;
  fileName: string;
}

export const exportToExcel = async ({
  data,
  sheetName,
  fileName,
}: ExportToExcelOptions): Promise<void> => {
  try {
    const ws = utils.json_to_sheet(data);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, sheetName);
    writeFile(wb, `${fileName}.xlsx`);
  } catch (error) {
    console.error("Error exporting data:", error);
    throw new Error("Failed to export data to Excel");
  }
};

export const exportMultipleBlankToExcel = async ({
  sheets,
  fileName,
}: {
  sheets: { sheetName: string; data: Record<string, any>[] }[];
  fileName: string;
}): Promise<void> => {
  try {
    const wb = utils.book_new();

    sheets.forEach(({ sheetName, data }) => {
      const ws = utils.json_to_sheet(data);
      utils.book_append_sheet(wb, ws, sheetName);
    });

    writeFile(wb, `${fileName}.xlsx`);
  } catch (error) {
    console.error("Error exporting data:", error);
    throw new Error("Failed to export data to Excel");
  }
};

// sample data for blank export
// to be passed to exportToExcel function
// [
//           {
//             accountNumber: "",
//             code: "",
//             description: "",
//             feeCategoryCode: "",
//             feeCategoryName: "",
//             feeName: "",
//             id: "",
//             reOccurrent: "",
//           },
//         ],
