import { createContext } from "react";
import { ID, Models } from "react-native-appwrite";
import { account } from "./appwrite";

type AuthContextType = {
  user: Models.User<Models.Preferences> | null;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const authContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // REGISTRASE
  const signUp = async (email: string, password: string) => {
    try {
      await account.create(ID.unique(), email, password);
      await signIn(email, password);
      return null;
    } catch (error) {
      if (error instanceof Error) {
        return error.message;
      }
      return "An error ocurred during signup.";
    }
  };

  // INICIAR SESION
  const signIn = async (email: string, password: string) => {};
  return (
    <authContext.Provider value={{ user, signIn, signUp }}>
      {children}
    </authContext.Provider>
  );
}

export function useAuth() {
  return {};
}
