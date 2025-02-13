import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router";

import loginUser from "api-calls/login";
import Error from "components/Error";

export default function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();
  const { mutate, isPending, isError, error, isSuccess } = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      localStorage.setItem("isLoggedIn", "true");
      setTimeout(() => {
        navigate("/dogs");
      }, 400);
    },
  });

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutate({ name, email });
  };

  return (
    <div className="login">
      <h3>Login</h3>
      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="name"
          onChange={handleName}
          value={name}
        />
        <input
          type="text"
          placeholder="email"
          onChange={handleEmail}
          value={email}
        />
        <button className="submit-button" type="submit" onClick={handleSubmit}>
          {isPending ? "Logging in..." : "Submit"}
        </button>
      </form>
      {isError && <Error message={error.message} />}
      {isSuccess && <p className="success-message">Logged in successfully!</p>}
    </div>
  );
}
