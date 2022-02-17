import { createContext } from "react";

export interface IAuthContext {
  user: {
    username: string;
    displayName: string;
  };
  logout: () => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: {
    username: "",
    displayName: "",
  },
  logout: () => {},
});
