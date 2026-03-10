// // 1. First, set up your app/layout.tsx to include both NextAuth's SessionProvider and our custom AzureAuthProvider

// // app/layout.tsx
// "use client";

// import { SessionProvider } from "next-auth/react";
// import { AzureAuthProvider } from "@/lib/azure-auth-context";
// import "./globals.css";

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <SessionProvider>
//           <AzureAuthProvider>{children}</AzureAuthProvider>
//         </SessionProvider>
//       </body>
//     </html>
//   );
// }

// // 2. Example of a protected page component using the withAuth HOC

// // app/dashboard/page.tsx
// ("use client");

// import { withAuth, useAzureAuth } from "@/lib/azure-auth-context";

// function Dashboard() {
//   const { user, userProfile } = useAzureAuth();

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>

//       <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//         <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
//         <p>
//           <strong>Name:</strong> {user?.name}
//         </p>
//         <p>
//           <strong>Email:</strong> {user?.email}
//         </p>
//         <p>
//           <strong>Roles:</strong> {user?.roles.join(", ")}
//         </p>

//         {userProfile && (
//           <div className="mt-4 pt-4 border-t">
//             <h3 className="text-lg font-medium mb-2">
//               Additional Profile Info
//             </h3>
//             <p>
//               <strong>Department:</strong> {userProfile.department}
//             </p>
//             <p>
//               <strong>Job Title:</strong> {userProfile.jobTitle}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Protect this route - requires authentication but no specific roles
// export default withAuth(Dashboard);

// // 3. Example of a protected page that requires specific roles

// // app/admin/page.tsx
// ("use client");

// import { withAuth, useAzureAuth } from "@/lib/azure-auth-context";

// function AdminDashboard() {
//   const { user } = useAzureAuth();

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
//       <p>Welcome, {user?.name}. You have access to the admin area.</p>

//       {/* Admin-specific content here */}
//     </div>
//   );
// }

// // Protect this route - requires 'Admin' role
// export default withAuth(AdminDashboard, ["Admin"]);

// // 4. Example of using the RoleGuard component for conditional rendering

// // app/reports/page.tsx
// ("use client");

// import { withAuth, useAzureAuth, RoleGuard } from "@/lib/azure-auth-context";

// function ReportsPage() {
//   const { user } = useAzureAuth();

//   return (
//     <div className="container mx-auto p-6">
//       <h1 className="text-3xl font-bold mb-6">Reports</h1>

//       {/* Content visible to all authenticated users */}
//       <div className="mb-8">
//         <h2 className="text-xl font-semibold mb-4">General Reports</h2>
//         <p>This content is visible to all authenticated users.</p>
//         {/* General report content */}
//       </div>

//       {/* Admin-only content */}
//       <RoleGuard allowedRoles={["Admin"]}>
//         <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-md">
//           <h2 className="text-xl font-semibold mb-4 text-red-800">
//             Admin Reports
//           </h2>
//           <p>This section is only visible to administrators.</p>
//           {/* Admin-specific reports */}
//         </div>
//       </RoleGuard>

//       {/* Manager content */}
//       <RoleGuard
//         allowedRoles={["Manager", "Team Lead"]}
//         fallback={
//           <div className="mb-8 p-4 bg-gray-100 rounded-md">
//             <p>You need manager permissions to view team reports.</p>
//           </div>
//         }
//       >
//         <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
//           <h2 className="text-xl font-semibold mb-4 text-blue-800">
//             Team Reports
//           </h2>
//           <p>This section is visible to managers and team leads.</p>
//           {/* Manager-specific reports */}
//         </div>
//       </RoleGuard>
//     </div>
//   );
// }

// // Protect this route - requires authentication but no specific roles
// export default withAuth(ReportsPage);

// // 5. SignIn component example

// // app/auth/signin/page.tsx
// ("use client");

// import { useAzureAuth } from "@/lib/azure-auth-context";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// export default function SignIn() {
//   const { signIn, isAuthenticated, isLoading } = useAzureAuth();
//   const router = useRouter();

//   useEffect(() => {
//     // If already authenticated, redirect to dashboard
//     if (isAuthenticated && !isLoading) {
//       router.replace("/dashboard");
//     }
//   }, [isAuthenticated, isLoading, router]);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold">Sign In to Your Account</h1>
//           <p className="mt-2 text-gray-600">
//             Use your Microsoft account to continue
//           </p>
//         </div>

//         <div className="mt-8 flex justify-center">
//           <button
//             onClick={() => signIn()}
//             className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="20"
//               height="20"
//               viewBox="0 0 48 48"
//             >
//               <rect width="10" height="10" x="2" y="2" fill="#f25022" />
//               <rect width="10" height="10" x="2" y="14" fill="#00a4ef" />
//               <rect width="10" height="10" x="14" y="2" fill="#7fba00" />
//               <rect width="10" height="10" x="14" y="14" fill="#ffb900" />
//             </svg>
//             Sign in with Microsoft
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // 6. NavBar component with auth-aware elements

// // components/NavBar.tsx
// ("use client");

// import Link from "next/link";
// import { useAzureAuth, RoleGuard } from "@/lib/azure-auth-context";

// export default function NavBar() {
//   const { user, isAuthenticated, signOut } = useAzureAuth();

//   return (
//     <nav className="bg-gray-800 text-white p-4">
//       <div className="container mx-auto flex justify-between items-center">
//         <Link href="/" className="text-xl font-bold">
//           YourApp
//         </Link>

//         <div className="flex items-center gap-6">
//           {isAuthenticated ? (
//             <>
//               <Link href="/dashboard" className="hover:text-blue-300">
//                 Dashboard
//               </Link>

//               {/* Only show specific nav items to users with certain roles */}
//               <RoleGuard allowedRoles={["Admin", "Manager"]}>
//                 <Link href="/admin" className="hover:text-blue-300">
//                   Admin
//                 </Link>
//               </RoleGuard>

//               <RoleGuard allowedRoles={["Analyst", "Reporter"]}>
//                 <Link href="/reports" className="hover:text-blue-300">
//                   Reports
//                 </Link>
//               </RoleGuard>

//               <div className="relative group">
//                 <button className="flex items-center gap-2">
//                   <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
//                     {user?.avatar ? (
//                       <img
//                         src={user.avatar}
//                         alt={user.name}
//                         className="rounded-full"
//                       />
//                     ) : (
//                       <span>{user?.name.charAt(0)}</span>
//                     )}
//                   </div>
//                   <span>{user?.name}</span>
//                 </button>

//                 <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg hidden group-hover:block">
//                   <div className="px-4 py-3 border-b">
//                     <p className="text-sm">{user?.email}</p>
//                     <p className="text-xs text-gray-500">
//                       {user?.roles.join(", ")}
//                     </p>
//                   </div>
//                   <Link
//                     href="/profile"
//                     className="block px-4 py-2 hover:bg-gray-100"
//                   >
//                     Your Profile
//                   </Link>
//                   <button
//                     onClick={() => signOut()}
//                     className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
//                   >
//                     Sign Out
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <Link
//               href="/auth/signin"
//               className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//             >
//               Sign In
//             </Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }
