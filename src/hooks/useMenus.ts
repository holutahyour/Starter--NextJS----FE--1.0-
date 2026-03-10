"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useAzureAuth } from "@/context/auth-context";
import apiHandler from "@/data/api/ApiHandler";
import { IMenu } from "@/data/sidebar-data";

export const useMenus = () => {
    const { data: session, status } = useSession();
    const { tenantId } = useAzureAuth();
    const [menus, setMenus] = useState<IMenu[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMenus = async () => {
            // Wait for session to be loaded
            if (status === "loading") return;

            if (!session || !(session as any).accessToken) {
                console.log("useMenus: No session or no accessToken found", {
                    status,
                    hasSession: !!session,
                    hasTokenOnSession: !!(session as any)?.accessToken,
                });
                setIsLoading(false);
                return;
            }

            try {
                console.log("useMenus: Fetching menus with token and tenantId:", tenantId);
                const response = await apiHandler.menus.my_menus();
                if (response.isSuccess) {
                    setMenus(response.content);
                } else {
                    setError(response.message || "Failed to fetch menus");
                }
            } catch (err: any) {
                console.error("useMenus: Error fetching menus", err);
                setError(err.message || "An error occurred while fetching menus");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMenus();
    }, [session, status, tenantId]);

    return { menus, isLoading, error };
};
