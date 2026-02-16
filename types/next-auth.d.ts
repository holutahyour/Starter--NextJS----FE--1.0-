import "next-auth";

declare module "next-auth" {
  interface User {
    roles: string[];
    selectedRole: string;
  }
  
  interface Session {
    user: User;
  }
}