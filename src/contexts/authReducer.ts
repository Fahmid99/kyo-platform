import { User } from "../types/types";
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export type AuthAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean };

export const initialAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: true,
};

export function authReducer(state: AuthState, action: AuthAction) {
  switch (action.type) {
    case "LOGIN":
      return {
        isAuthenticated: true,
        user: action.payload,
        loading: false,
      };
    case "LOGOUT":
      return {
        isAuthenticated: false,
        user: null,
        loading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
}

export type { User };
