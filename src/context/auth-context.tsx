"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export type AzureUser = {
    id: string;
    name: string;
    email: string;
    roles: string[];
    avatar?: string;
};

interface AzureAuthContextType {
    user: AzureUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    tenantId: string | null;
    setTenantId: (id: string | null) => void;
    hasRole: (roles: string | string[]) => boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    error: Error | null;
}

const AzureAuthContext = createContext<AzureAuthContextType>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    tenantId: null,
    setTenantId: () => { },
    hasRole: () => false,
    signIn: async () => { },
    signOut: async () => { },
    error: null,
});

export const AzureAuthProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<AzureUser | null>(null);
    const [tenantId, _setTenantId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const router = useRouter();

    const setTenantId = (id: string | null) => {
        _setTenantId(id);
        if (id) {
            localStorage.setItem("crm_tenant_id", id);
        } else {
            localStorage.removeItem("crm_tenant_id");
        }
    };

    useEffect(() => {
        const savedTenant = localStorage.getItem("crm_tenant_id");
        if (savedTenant) {
            _setTenantId(savedTenant);
        }
    }, []);

    const handleSignIn = async () => {
        try {
            await signIn("azure-ad", { callbackUrl: "/" });
        } catch (error) {
            setError(error as Error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut({ callbackUrl: "/" });
        } catch (error) {
            setError(error as Error);
        }
    };

    const hasRole = (roles: string | string[]): boolean => {
        if (!user) return false;
        if (typeof roles === "string") {
            return user.roles.includes(roles);
        }
        return user.roles.some((role) => roles.includes(role));
    };

    useEffect(() => {
        const handleSessionChange = async () => {
            setIsLoading(true);

            try {
                if (status === "loading") return;

                // If the access token refresh failed, force a full re-login
                if ((session as any)?.error === "RefreshAccessTokenError") {
                    console.warn("Refresh token expired — forcing re-login.");
                    await signOut({ redirect: false });
                    router.replace("/auth/sign-in");
                    return;
                }

                if (!session || !session.user) {
                    setUser(null);
                    setIsLoading(false);

                    const currentPath = window.location.pathname;
                    if (!["/auth/sign-in", "/login"].includes(currentPath)) {
                        router.replace("/auth/sign-in");
                    }
                    return;
                }

                const azureUser: AzureUser = {
                    id: (session.user as any).id,
                    name: session.user.name || "",
                    email: session.user.email || "",
                    roles: (session.user as any).roles || [],
                    avatar: session.user.image || undefined,

                };

                setUser(azureUser);
            } catch (error) {
                setError(error as Error);
            } finally {
                setIsLoading(false);
            }
        };

        handleSessionChange();
    }, [session, status, router]);

    const contextValue: AzureAuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        tenantId,
        setTenantId,
        hasRole,
        signIn: handleSignIn,
        signOut: handleSignOut,
        error,
    };

    return (
        <AzureAuthContext.Provider value={contextValue}>
            {children}
        </AzureAuthContext.Provider>
    );
};

export const useAzureAuth = () => {
    const context = useContext(AzureAuthContext);
    if (!context) {
        throw new Error("useAzureAuth must be used within an AzureAuthProvider");
    }
    return context;
};
