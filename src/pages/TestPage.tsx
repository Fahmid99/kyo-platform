import { Button } from "@mui/material";
import { useAuth } from "../hooks/useAuth";


const TestPage = () => {
  const { state, dispatch } = useAuth();
  const { isAuthenticated, user } = state;

  const handleLogin = () => {
    window.location.href = `/.auth/login/aad?post_login_redirect_uri=/dashboard`;
  };

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    window.location.href = "/.auth/logout?post_logout_redirect_uri/dashboard";
  };

  return (
    <div>
      <h1>TestPage</h1>

      {isAuthenticated ? (
        <>
          <p>Welcome, {user?.name}</p>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </>
      ) : (
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Login with Microsoft
        </Button>
      )}
    </div>
  );
};

export default TestPage;
