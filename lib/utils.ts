import { exportToExcel } from "@/utils/excelExport";
import { type ClassValue, clsx } from "clsx";
import { log } from "console";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import * as XLS from "xlsx";
import { readFile, utils, writeFile } from "xlsx";
import { IApiResponse } from "@/data/interface/IApiResponse";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value));

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export function createRoute(routeValues: string[]) {
  return `/${routeValues.join('/')}`
}

// FORMAT DATE TIME
export const formatDateTime = (dateString: Date | string) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    // weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    year: "numeric", // numeric year (e.g., '2023')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions: Intl.DateTimeFormatOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
  };

  const dateOptions: Intl.DateTimeFormatOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime: string = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDateDay: string = new Date(dateString).toLocaleString(
    "en-US",
    dateDayOptions
  );

  const formattedDate: string = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime: string = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function encryptKey(passkey: string) {
  return btoa(passkey);
}

export function decryptKey(passkey: string) {
  return atob(passkey);
}

export const compactNumber = (num: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short"
  }).format(num);
};

export async function handleExport<T>(arg: T, title: string): Promise<void> {
  const today = new Date();
  const todayNumber = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();


  try {
      await exportToExcel({
          data: arg as [], // Using the passed argument
          sheetName: title,
          fileName: `${title} - ${todayNumber}`,
      });

      toast.success("Data exported successfully", {
          position: "top-center",
      });
  } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Error exporting data", {
          position: "top-center",
      });
  }
}

export const handleTo = (num: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short"
  }).format(num);
};

export const processExcelFile = async (
  file: File, 
  onSuccess: (data: any[]) => void
) => {
    const arrayBuffer = await file.arrayBuffer();
    const result = XLS.read(arrayBuffer, { type: "array", cellDates: true });
    const firstSheet = utils.sheet_to_json(result.Sheets[result.SheetNames[0]], {
      raw: false,
      dateNF: 'yyyy-mm-dd hh:mm:ss',
    });
    console.log(firstSheet);
    onSuccess(firstSheet);
  }
  
export const processMasterExcelFile = async (
  file: File, 
  onSuccess: (data: { [key: string]: any[] }) => void
) => {
    const arrayBuffer = await file.arrayBuffer();
    const workBook = XLS.read(arrayBuffer, {
      type: "array",
      cellDates: true,
    });
    const importData: { [key: string]: any[] } = {};
    // Loop through each sheet in the workbook
    // and convert it to JSON
    const multipleSheet = workBook.SheetNames.forEach((sheet) => {
      const rowObjects = XLS.utils.sheet_to_json(workBook.Sheets[sheet]);
      const sheetKey = sheet
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, "");
      importData[sheetKey] = rowObjects;
    });
    console.log("sheets", importData);
    onSuccess(importData);
  }




  export function getInitials(name: string): string {
    if (!name) return "";
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0].toUpperCase())
      .join("");
  }

export const processExcelFile2 = (
    file: File,
    onSuccess: (data: any[]) => void,
    options = { raw: false, defval: "" }
  ) => {
    const fileReader = new FileReader();
    
    fileReader.onload = (event) => {
      const data = event.target?.result;
      const workBook = XLS.read(data, { type: "binary" });
      
      const processedData = workBook.SheetNames.flatMap((sheet) => {
        const rowObject = XLS.utils.sheet_to_json(workBook.Sheets[sheet], options);
        return rowObject.map((row: any) =>
          Object.entries(row).reduce((acc: any, [key, value]) => {
            const camelKey = key
              .toLowerCase()
              .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (letter, index) =>
                index === 0 ? letter.toLowerCase() : letter.toUpperCase()
              );
            
            const processedValue = typeof value === 'string' 
              ? value.toUpperCase() === 'TRUE' 
                ? true 
                : value.toUpperCase() === 'FALSE'
                  ? false
                  : value
              : value;

            acc[camelKey] = processedValue || '';
            return acc;
          }, {})
        );
      });

      onSuccess(processedData);
    };

    fileReader.readAsBinaryString(file);
  };
  
export const isApiResponse = (obj: unknown): obj is IApiResponse => {
  return (
    obj !== null &&
    typeof obj === "object" &&
    "isSuccess" in obj &&
    "hasError" in obj &&
    "message" in obj
  );
};