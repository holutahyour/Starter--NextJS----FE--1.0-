"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Define types for  Azure user
export type AzureUser = {
  id: string;
  name: string;
  email: string;
  roles: string[];
  avatar?: string;
};

// Define additional user profile that may come from  database
export type UserProfile = {
  userId: string;
  department?: string;
  jobTitle?: string;
  preferredLanguage?: string;
  country?: string;
  // Add any other profile fields you need
};

interface AzureAuthContextType {
  user: AzureUser | null;
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasRole: (roles: string | string[]) => boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  error: Error | null;
}

// Create the context with default values
const AzureAuthContext = createContext<AzureAuthContextType>({
  user: null,
  userProfile: null,
  setUserProfile: () => {},
  isLoading: true,
  isAuthenticated: false,
  hasRole: () => false,
  signIn: async () => {},
  signOut: async () => {},
  error: null,
});

// Provider component
export const AzureAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<AzureUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const router = useRouter();

  // Function to handle sign in
  const handleSignIn = async () => {
    try {
      await signIn("azure-ad", { callbackUrl: "/dashboard" });
    } catch (error) {
      setError(error as Error);
      toast.error("Failed to sign in");
    }
  };

  // Function to handle sign out
  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/" });
      // setUser(null);
      // setUserProfile(null);
    } catch (error) {
      setError(error as Error);
      toast.error("Failed to sign out");
    }
  };

  // Check if user has a specific role or any role from an array
  const hasRole = (roles: string | string[]): boolean => {
    if (!user) return false;

    if (typeof roles === "string") {
      return user.roles.includes(roles);
    }

    return user.roles.some((role) => roles.includes(role));
  };

  // Fetch additional user profile data from your database
  const fetchUserProfile = async (userId: string) => {
    try {
      // Replace this with your actual database call
      // Example:
      // const profile = await db.table("userProfiles").where("userId", userId).execute();

      // For now, we'll just set a mock profile
      setUserProfile({
        userId,
        department: "IT",
        jobTitle: "Developer",
        // Add other fields as needed
      });
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      toast.error("Failed to load user profile data");
    }
  };

  // Handle session changes
  useEffect(() => {
    const handleSessionChange = async () => {
      setIsLoading(true);

      try {
        if (status === "loading") {
          return;
        }

        if (!session) {
          setUser(null);
          setUserProfile(null);
          setIsLoading(false);

          // Only redirect if we're not already on the sign-in page
          const currentPath = window.location.pathname;
          if (!["/", "/auth/signin", "/login"].includes(currentPath)) {
            router.replace("/");
          }
          return;
        }

        // User is authenticated
        const azureUser: AzureUser = {
          id: session.user.id,
          name: session.user.name || "",
          email: session.user.email || "",
          roles: session.user.roles || [],
          avatar: session.user.image || undefined,
        };

        setUser(azureUser);

        // Fetch additional user profile data
        await fetchUserProfile(azureUser.id);
      } catch (error) {
        console.error("Auth processing error:", error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    handleSessionChange();
  }, [session, status, router]);

  const contextValue: AzureAuthContextType = {
    user,
    userProfile,
    setUserProfile,
    isLoading,
    isAuthenticated: !!user,
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

// Custom hook to use the auth context
export const useAzureAuth = () => {
  const context = useContext(AzureAuthContext);
  if (!context) {
    throw new Error("useAzureAuth must be used within an AzureAuthProvider");
  }
  return context;
};

// // HOC (Higher-Order Component) for protected routes
// export function withAuth<P extends object>(
//   Component: React.ComponentType<P>,
//   requiredRoles?: string[]
// ) {
//   return function ProtectedRoute(props: P) {
//     const { user, isLoading, isAuthenticated, hasRole } = useAzureAuth();
//     const router = useRouter();

//     useEffect(() => {
//       if (isLoading) return;

//       if (!isAuthenticated) {
//         router.replace("/");
//         return;
//       }

//       // If roles are required, check if user has at least one
//       if (requiredRoles && requiredRoles.length > 0) {
//         if (!hasRole(requiredRoles)) {
//           router.replace("/unauthorized");
//           toast.error("You don't have permission to access this page");
//         }
//       }
//     }, [isAuthenticated, isLoading, router, hasRole]);

//     if (isLoading) {
//       return (
//         <div className="flex justify-center items-center h-screen">
//           Loading...
//         </div>
//       );
//     }

//     if (!isAuthenticated) return null;

//     // If roles are required and user doesn't have any of them
//     if (requiredRoles && requiredRoles.length > 0 && !hasRole(requiredRoles)) {
//       return null;
//     }

//     return <Component {...props} />;
//   };
// }

// // Role-based component guard
// export const RoleGuard = ({
//   children,
//   allowedRoles,
//   fallback = null,
// }: {
//   children: React.ReactNode;
//   allowedRoles: string[];
//   fallback?: React.ReactNode;
// }) => {
//   const { hasRole, isLoading } = useAzureAuth();

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

//   if (!hasRole(allowedRoles)) {
//     return <>{fallback}</>;
//   }

//   return <>{children}</>;
// };
