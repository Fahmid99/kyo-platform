import { createContext, useReducer, useEffect, ReactNode } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import {
  authReducer,
  initialAuthState,
  AuthState,
  AuthAction,
  User,
} from "./authReducer";

interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const publicRoutes = ["/", "error"];

    if (publicRoutes.includes(location.pathname)) {
      // 👈 Skip auth check on guest pages
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }
    const checkAuth = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const res = await axios.get("/api/auth/whoami");
        const data = res.data;
        console.log(res);

        if (res.status === 200) {
          dispatch({
            type: "LOGIN",
            payload: data.user as User,
          });
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.log(error);
          console.log(error.status);
          const statusCode = error.status || 0; // Default to 0 if undefined
          console.log("Navigating to error page with:", statusCode);
          navigate("/error", { state: { errorCode: statusCode } });
        } else {
          navigate("/error", { state: { errorCode: null } }); // ✅ Handle unknown errors
        }
      } finally {
        dispatch({ type: "SET_LOADING", payload: false }); // Finish loading
      }
    };
    checkAuth();
  }, [location.pathname, navigate]);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
