// import { authMe } from "@/data/actions";
// import { IUser } from "@/data/user";
// import { SIGN_IN } from "@/lib/routes";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// export function useAuth() {
//     const router = useRouter();
//     const [user, setUser] = useState<IUser | null>(null);

//     useEffect(() => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         router.push(SIGN_IN);
//         return;
//       }

//       authMe(token).then((data) => {
//         if (data.error) {
//           localStorage.removeItem("token");
//           router.push(SIGN_IN);
//         } else {
//           setUser(data.user);
//         }
//       });
//     }, [router]);

//     return [user];
// }
