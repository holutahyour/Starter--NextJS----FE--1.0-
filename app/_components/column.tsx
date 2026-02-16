"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/sdcn-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/sdcn-dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/chakra-checkbox";
import { DataTableColumnHeader } from "@/components/app/app-data-table/data-table-column-header";
import { IMiscellaneousBill } from "@/data/interface/IMiscellaneousBill";
import { IStudent } from "@/data/interface/IStudent";
import StudentInfoDialog from "./dialogs/student-info-dialog";
import { useQuery } from "@/hooks/use-query";
import { useModifyQuery } from "@/hooks/use-modify-query";
import {
  APP_STUDENT_BILL_DIALOG,
  APP_MISCELLANEOUS_BILL_DIALOG,
  APP_PAYMENT_HISTORY_DIALOG,
  APP_CREDIT_NOTE_DIALOG,
} from "@/lib/routes";
import { useRouter, useSearchParams } from "next/navigation";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

// Actions cell component to handle dialog state
function ActionsCell({ student }: { student: IStudent }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Student Bill Dialog
  const { open: isStudentBillOpen } = useQuery(APP_STUDENT_BILL_DIALOG, student.studentCode);
  const openStudentBillUrl = useModifyQuery(
    null,
    searchParams,
    [{ key: APP_STUDENT_BILL_DIALOG, value: student.studentCode }],
    "set"
  );
  const closeStudentBillUrl = useModifyQuery(null, searchParams, [
    { key: APP_STUDENT_BILL_DIALOG },
  ]);

  // Miscellaneous Bill Dialog
  const { open: isMiscBillOpen } = useQuery(APP_MISCELLANEOUS_BILL_DIALOG, student.studentCode);
  const openMiscBillUrl = useModifyQuery(
    null,
    searchParams,
    [{ key: APP_MISCELLANEOUS_BILL_DIALOG, value: student.studentCode }],
    "set"
  );
  const closeMiscBillUrl = useModifyQuery(null, searchParams, [
    { key: APP_MISCELLANEOUS_BILL_DIALOG },
  ]);

  // Payment History Dialog
  const { open: isPaymentHistoryOpen } = useQuery(APP_PAYMENT_HISTORY_DIALOG, student.studentCode);
  const openPaymentHistoryUrl = useModifyQuery(
    null,
    searchParams,
    [{ key: APP_PAYMENT_HISTORY_DIALOG, value: student.studentCode }],
    "set"
  );
  const closePaymentHistoryUrl = useModifyQuery(null, searchParams, [
    { key: APP_PAYMENT_HISTORY_DIALOG },
  ]);

  // Credit Note Dialog
  const { open: isCreditNoteOpen } = useQuery(APP_CREDIT_NOTE_DIALOG, student.studentCode);
  const openCreditNoteUrl = useModifyQuery(
    null,
    searchParams,
    [{ key: APP_CREDIT_NOTE_DIALOG, value: student.studentCode }],
    "set"
  );
  const closeCreditNoteUrl = useModifyQuery(null, searchParams, [
    { key: APP_CREDIT_NOTE_DIALOG },
  ]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => router.push(openStudentBillUrl)}>
            Student Bill
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(openPaymentHistoryUrl)}>
            Payment History
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(openMiscBillUrl)}>
            Miscellaneous
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => router.push(openCreditNoteUrl)}>
            Credit Note
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Student Bill Dialog */}
      <StudentInfoDialog
        dialogType="student-bill"
        student={student}
        open={isStudentBillOpen}
        redirectUri={closeStudentBillUrl}
      />

      {/* Miscellaneous Bill Dialog */}
      <StudentInfoDialog
        dialogType="miscellaneous-bill"
        student={student}
        open={isMiscBillOpen}
        redirectUri={closeMiscBillUrl}
      />

      {/* Payment History Dialog */}
      <StudentInfoDialog
        dialogType="payment-history"
        student={student}
        open={isPaymentHistoryOpen}
        redirectUri={closePaymentHistoryUrl}
      />

      {/* Credit Note Dialog */}
      <StudentInfoDialog
        dialogType="credit-note"
        student={student}
        open={isCreditNoteOpen}
        redirectUri={closeCreditNoteUrl}
      />
    </>
  );
}

export const columns: ColumnDef<IStudent>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={table.getIsAllPageRowsSelected()}
  //       // isIndeterminate={table.getIsSomePageRowsSelected()}
  //       onChange={(e) =>
  //         table.toggleAllPageRowsSelected(
  //           (e.target as HTMLInputElement).checked
  //         )
  //       }
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onChange={(e) =>
  //         row.toggleSelected((e.target as HTMLInputElement).checked)
  //       }
  //       aria-label="Select row"
  //     />
  //   ),
  //   size: 1,
  //   enableSorting: false,
  //   enableHiding: false,
  // },

  {
    accessorKey: "studentCode",
    header: ({ column }) => {
      return (
        <Button
          className="text-sm font-bold p-0"
          size="sm"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "firstName",
    header: "Full Name",
    cell: ({ row }) => {
      const {
        original: { firstName, lastName, middleName },
      } = row;
      return `${firstName} ${middleName ? `${middleName} ` : ""} ${lastName}`;
    },
  },
  {
    accessorKey: "streamName",
    header: ({ column }) => {
      return (
        <Button
          className="text-sm font-bold p-0"
          size="sm"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Stream Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "classCode",
    header: ({ column }) => {
      return (
        <Button
          className="text-sm font-bold p-0"
          size="sm"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Level
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const student = row.original;
      return <ActionsCell student={student} />;
    },
    size: 1,
  },
];
