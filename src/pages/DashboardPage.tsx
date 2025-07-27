import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface UserClaim {
  typ: string;
  val: string;
}

interface DataObject {
  provider_name: string;
  user_claims: UserClaim[];
}

interface User {
  email: string;
  name: string;
  roles: string[];
}

const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const validateUser = async () => {
      try {
        const response = await axios.get("/api/auth/whoami");
        const data: DataObject = response.data;

        const tenantId = data.user_claims?.find(
          (claim) =>
            claim.typ ===
            "http://schemas.microsoft.com/identity/claims/tenantid"
        )?.val;

        const email = data.user_claims?.find(
          (claim) =>
            claim.typ ===
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
        )?.val;

        if (!tenantId || !email) {
          throw new Error("Missing tenantId or email");
        }

        const orgCheckResponse = await axios.get(`/api/platform/validate`, {
          headers: {
            "x-org-id": tenantId,
            "x-user-email": email,
          },
        });

        if (orgCheckResponse.status === 200) {
          setUser(orgCheckResponse.data.user);
          setLoading(false);
        } else if (orgCheckResponse.status === 404) {
          navigate("/signup");
        } else if (orgCheckResponse.status === 401) {
          navigate("/unauthorised");
        } else {
          throw new Error("Unexpected response");
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          navigate("/signup");
        } else if (
          axios.isAxiosError(error) &&
          error.response?.status === 401
        ) {
          navigate("/unauthorised");
        } else {
          navigate("/error");
        }
      }
    };

    validateUser();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const isPlatformAdmin = user?.roles.includes("organisation-admin");

  return (
    <div>
      <h1>Dashboard Page</h1>
      <p>Welcome, {user?.name}</p>

      {isPlatformAdmin && (
        <a
          href="/management"
          style={{ display: "inline-block", marginTop: "1rem" }}
        >
          Management
        </a>
      )}
    </div>
  );
};

export default DashboardPage;
