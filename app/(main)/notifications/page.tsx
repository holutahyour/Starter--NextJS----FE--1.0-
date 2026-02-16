"use client"

import AppTabs from "@/components/app/app-tabs";
import { NOTIFICATIONS } from "@/lib/routes";
import { Bell } from "lucide-react";
import { LuBuilding2, LuMapPin } from "react-icons/lu";
import Inbox from "./inbox/inbox";

const tabs = [
    { label: "Notifications", value: "notification", Icon: Bell, content: <Inbox/> }
];

export default function Notifications() {
    return (
        <>
            <AppTabs tabs={tabs} route={NOTIFICATIONS} defaultValue="notification" />
        </>
    );
}
