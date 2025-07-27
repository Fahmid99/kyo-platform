import React from "react";

const Unauthorised: React.FC = () => {
  return (
    <div>
      <h1>Unauthorised</h1>
      <p>You do not have permission to access this page.</p>
      <p>
        Please contact your organisation's platform administrator if you believe
        this is an error.
      </p>
    </div>
  );
};

export default Unauthorised;
