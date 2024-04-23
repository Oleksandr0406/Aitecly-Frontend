import React, { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SendRequestWithToken_test } from "../Utils/FetchUtil";

const SignUp = () => {
  const navigator = useNavigate();
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      SendRequestWithToken_test(
        "auth/sign-up",
        {
          body: JSON.stringify({
            username: formData.get("firstname") + formData.get("lastname"),
            email: formData.get("email"),
            password: formData.get("password"),
            confirm_password: formData.get("confirm_password"),
          }),
        },
        () => {
          alert("Signed up successfully!");
          navigator("/sign-in");
        }
      );
    },
    [navigator]
  );
  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        {" "}
        <form onSubmit={handleSubmit}>
          <h3>Sign Up</h3>
          <div className="mb-3">
            <label>First name</label>
            <input
              type="text"
              className="form-control"
              placeholder="First name"
              name="firstname"
            />
          </div>
          <div className="mb-3">
            <label>Last name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Last name"
              name="lastname"
            />
          </div>
          <div className="mb-3">
            <label>Email address</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Enter email"
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Enter password"
            />
          </div>
          <div className="mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirm_password"
              className="form-control"
              placeholder="Enter password"
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </div>
          <p className="forgot-password text-right">
            Already registered <Link to="/sign-in">sign in?</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
