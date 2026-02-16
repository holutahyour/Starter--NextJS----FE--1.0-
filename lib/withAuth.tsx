"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAzureAuth } from "@/app/context/auth-context";
import { useRoleSelection } from "@/app/context/roleSelection-context";


// Refactored withAuth HOC
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRoles?: string[]
) {
  return function ProtectedRoute(props: P) {
    const { user, isLoading, isAuthenticated } = useAzureAuth();
    const { hasPermission } = useRoleSelection();
    const router = useRouter();

    useEffect(() => {
      if (isLoading) return;

      if (!isAuthenticated) {
        router.replace("/");
        return;
      }

      // If roles are required, check if the currently selected role has permission
      if (requiredRoles && requiredRoles.length > 0) {
        if (!hasPermission(requiredRoles)) {
          router.replace("/unauthorized");
          toast.error(
            "Your current role doesn't have permission to access this page"
          );
        }
      }
    }, [isAuthenticated, isLoading, router, hasPermission]);

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          Loading...
        </div>
      );
    }

    if (!isAuthenticated) return null;

    // If roles are required and the currently selected role doesn't have permission
    if (
      requiredRoles &&
      requiredRoles.length > 0 &&
      !hasPermission(requiredRoles)
    ) {
      return null;
    }

    return <Component {...props} />;
  };
}

// Refactored RoleGuard
export const RoleGuard = ({
  children,
  allowedRoles,
  fallback = null,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
  fallback?: React.ReactNode;
}) => {
  const { isLoading } = useAzureAuth();
  const { hasPermission } = useRoleSelection();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!hasPermission(allowedRoles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
