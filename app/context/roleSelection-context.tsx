"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAzureAuth } from "./auth-context";
import { getCookie, setCookie } from "../utils/cookies";

// The key used for storing the selected role in localStorage
const SELECTED_ROLE_KEY = "selected_azure_role";

interface RoleSelectionContextType {
  availableRoles: string[];
  selectedRole: string | null;
  selectRole: (role: string) => void;
  isRoleSelected: (role: string) => boolean;
  hasPermission: (requiredRoles: string | string[]) => boolean;
}

const RoleSelectionContext = createContext<RoleSelectionContextType>({
  availableRoles: [],
  selectedRole: null,
  selectRole: () => {},
  isRoleSelected: () => false,
  hasPermission: () => false,
});

export const RoleSelectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user, isAuthenticated } = useAzureAuth();
  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Initialize roles and attempt to restore selected role from localStorage
  useEffect(() => {
    if (isAuthenticated && user?.roles) {
      // Set available roles from user
      setAvailableRoles(user.roles);

      // Try to get previously selected role from localStorage
      const cookieRole = getCookie(SELECTED_ROLE_KEY);
      const storedRole = cookieRole || localStorage.getItem(SELECTED_ROLE_KEY);

      if (storedRole && user.roles.includes(storedRole)) {
        // If stored role exists and is valid for this user, use it
        setSelectedRole(storedRole);
      } else if (user.roles.length > 0) {
        // Otherwise select first available role as default
        setSelectedRole(user.roles[0]);
        setCookie(SELECTED_ROLE_KEY, user.roles[0]);
        localStorage.setItem(SELECTED_ROLE_KEY, user.roles[0]);
      }
    } else {
      // Clear state when user is not authenticated
      setAvailableRoles([]);
      setSelectedRole(null);
    }
  }, [isAuthenticated, user]);

  // Function to select a role
  const selectRole = (role: string) => {
    if (availableRoles.includes(role)) {
      setSelectedRole(role);
      setCookie(SELECTED_ROLE_KEY, role);
      localStorage.setItem(SELECTED_ROLE_KEY, role);
      window.location.reload(); // Reload the page to apply changes
    } else {
      console.error(`Role "${role}" is not available for this user`);
    }
  };

  // Check if a specific role is currently selected
  const isRoleSelected = (role: string): boolean => {
    return selectedRole === role;
  };

  // Check if the selected role has permission based on required roles
  const hasPermission = (requiredRoles: string | string[]): boolean => {
    if (!selectedRole) return false;

    if (typeof requiredRoles === "string") {
      return selectedRole === requiredRoles;
    }

    return requiredRoles.includes(selectedRole);
  };

  const contextValue: RoleSelectionContextType = {
    availableRoles,
    selectedRole,
    selectRole,
    isRoleSelected,
    hasPermission,
  };

  return (
    <RoleSelectionContext.Provider value={contextValue}>
      {children}
    </RoleSelectionContext.Provider>
  );
};

export const useRoleSelection = () => {
  const context = useContext(RoleSelectionContext);
  if (!context) {
    throw new Error(
      "useRoleSelection must be used within a RoleSelectionProvider"
    );
  }
  return context;
};
