import React, { useCallback } from "react";
import { SendRequestWithToken_test } from "../Utils/FetchUtil";
import { setToken } from "../Utils/AuthUtil";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuthorized } from "../Slice/authSlice";
import { setChatBots } from "../Slice/chatbotSlice";
import { convert_db_data } from "../Utils/ChatbotUtil";
const SignIn = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const handleSubmit = useCallback(
    (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      SendRequestWithToken_test(
        "auth/sign-in",
        {
          body: JSON.stringify({
            email: formData.get("email"),
            password: formData.get("password"),
          }),
        },
        (result) => {
          alert("Signed in successfully!");
          setToken(result.access_token);
          dispatch(
            setAuthorized({
              user: result.user,
            })
          );
          SendRequestWithToken_test(
            "chatbot/find-all-chatbots",
            {},
            (result) => {
              dispatch(
                setChatBots(JSON.parse(result).map((d) => convert_db_data(d)))
              );
              console.log(result);
            }
          );
          navigator("/");
        }
      );
    },
    [dispatch, navigator]
  );
  return (
    <div className="auth-wrapper">
      <div className="auth-inner">
        <form onSubmit={handleSubmit}>
          <h3>Sign In</h3>
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
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="customCheck1"
              />
              <label className="custom-control-label" htmlFor="customCheck1">
                Remember me
              </label>
            </div>
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
          {/* <p className="forgot-password text-right">
            Forgot <a href="#">password?</a>
          </p> */}
        </form>
      </div>
    </div>
  );
};

export default SignIn;
