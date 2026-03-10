// 'use server'

// import { users } from "./user";


// export const getToken = async ({ email, password }: { email: string, password: string }) => {
//     const user = users.find((u) => u.email === email && u.password === password);

//     if (!user) {
//         return { error: "Invalid credentials", token: '' };
//     }

//     return { error: null, token: user.id };
// }

// export const getUser = async (email: string) => {
//     const user = users.find((u) => u.email === email);

//     return user ?? null;
// }

// export const authMe = async (token: string) => {
//   const user = users.find((u) => u.id === token);

//   if (!user) {
//     return { error: "Invalid credentials", user: null };
//   }

//   return { error: null, user };
// }

// export const getAuthMe = async (token: string) => {
//     const user = users.find((u) => u.id === token);
    
//     return user ?? null;
// }
