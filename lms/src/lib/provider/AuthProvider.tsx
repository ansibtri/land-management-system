import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { validateAuth } from "../axios/auth";

// Define user object
interface UserType {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  contact: string;
  country: string;
  province: string;
  profilePic: string | null;
  username:string;
}

// Define AuthObject Type
interface AuthType {
  isAuthenticated: boolean;
  authToken: string | null;
  user: UserType | null;
}

// Define Auth Context Type
interface AuthContextType {
  userAuth: AuthType | null;
  setUserAuth: React.Dispatch<React.SetStateAction<AuthType | null>>;
}

// Define type of Auth Provider's children
interface AuthProviderProps {
  children: ReactNode;
}

// Create Auth Context with proper default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Context Hook
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "Auth Context Hook's useAuth() must be used inside an AuthProvider."
    );
  }
  return context;
}

// Auth Context Provider
function AuthProvider({ children }: AuthProviderProps) {
  // Auth state
  const [userAuth, setUserAuth] = useState<AuthType | null>(null);

  // it will check every time the component is mounted or updated
  // so that the user is not null after reloading and it also ensure the userAuth variable is not null
  // when the component is mounted
  useEffect(() => {
    async function verifyAuthToken() {
      const verifyAuthToken = await validateAuth();
      
      if (verifyAuthToken?.isAuthenticated) {
        setUserAuth({
          isAuthenticated: verifyAuthToken?.isAuthenticated,
          authToken: verifyAuthToken?.authToken,
          user: verifyAuthToken?.user,
        });
      } else {
        setUserAuth({
          isAuthenticated: false,
          authToken: null,
          user:null
        });
      }
    }
    verifyAuthToken();
  }, []);
  return (
    <AuthContext.Provider value={{ userAuth, setUserAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export { useAuth, AuthProvider };
export type { AuthType };
