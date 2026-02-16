"use client"

import AppTabs from "@/components/app/app-tabs";
import { PARAMETERS } from "@/lib/routes";
import { LuCalendar, LuCreditCard, LuFolderTree, LuList, LuSettings, LuWallet } from "react-icons/lu";
import ErpSettings from "./_tab-contents/erp-settings/erp-settings";
import FeeCategories from "./_tab-contents/fee-categories/fee-categories";
import FeeItems from "./_tab-contents/fee-items/fee-items";
import FeeSchedules from "./_tab-contents/fee-schedules/fee-schedules";
import MiscFeeItems from "./_tab-contents/misc-feeitem/misc-fee-item";
import CreditNoteItems from "./_tab-contents/credit-notes/credit-note";

export default function SchoolSetup() {
    return (
        <>
            <AppTabs tabs={tabs} route={PARAMETERS} defaultValue="erp-settings" />
        </>
    );
}

export const tabs = [
  {
    label: "ERP Settings",
    value: "erp-settings",
    Icon: LuSettings, // Settings/gear icon
    content: <ErpSettings />,
  },
  // {
  //     label: "Account Structure",
  //     value: "account-structure",
  //     Icon: LuNetwork, // Network/structure icon
  //     content: <Campuses />
  // },
  // {
  //     label: "Fee Accounts",
  //     value: "fee-accounts",
  //     Icon: LuWallet, // Wallet/money icon
  //     content: <FeeAccounts />
  // },
  {
    label: "Fee Categories",
    value: "fee-categories",
    Icon: LuFolderTree, // Folder tree/category icon
    content: <FeeCategories />,
  },
  {
    label: "Fee Items",
    value: "fee-items",
    Icon: LuList, // List icon
    content: <FeeItems />,
  },
  {
    label: "Fee Schedules",
    value: "fee-schedules",
    Icon: LuCalendar, // Calendar/schedule icon
    content: <FeeSchedules />,
  },
  {
    label: "Miscellaneous Fee Items",
    value: "misc-fee-items",
    Icon: LuList, // List icon
    content: <MiscFeeItems />,
  },
  {
    label: "Credit Note",
    value: "credit-note",
    Icon: LuCreditCard, // Credit card icon
    content: <CreditNoteItems />,
  },
];
