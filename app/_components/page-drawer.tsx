
'use client';
import StudentImport from "../_students/_component/studentImport";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AppDrawer from "@/components/app/app-drawer";
import { useDisclosure } from "@chakra-ui/react";
import { Button } from "@/components/ui/sdcn-button";
import Link from "next/link";

export function PageDrawer() {
    const [open, setOpen] = useState(false)

    const router = useRouter();
    const searchParams = useSearchParams();

    // Open drawer if "drawer" query exists
    useEffect(() => {
        if (searchParams.get("drawer") === "true") {
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [searchParams, open]);
    return (
        <>
           
        </>

    )
}