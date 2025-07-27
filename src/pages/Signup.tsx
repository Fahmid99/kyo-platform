import React from "react";

const SignUp: React.FC = () => {
  return (
    <div>
      <h1>Sign Up</h1>
      <p>Register your interest by using the form below:</p>
      <form>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
