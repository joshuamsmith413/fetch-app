import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { Route, Routes, NavLink, useNavigate } from "react-router";

import { logoutUser } from "api-calls/login";
import Error from "components/Error";
import Dogs from "dogs";
import DogLayout from "dogs/DogLayout";
import FavoriteDogs from "favorite-dogs";
import FavoriteLayout from "favorite-dogs/FavoriteLayout";
import Login from "login/Login";
import LoginLayout from "login/LoginLayout";

import "App.css";

export default function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.clear();
      navigate("/");
    },
    onError: (error: Error) => {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong",
      );
    },
  });

  const handleLogout = () => {
    mutation.mutate();
  };

  return (
    <div className="app">
      <nav className="nav">
        {!isLoggedIn ? (
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Login
          </NavLink>
        ) : (
          <NavLink to="/" className="nav-link" onClick={handleLogout}>
            Logout
          </NavLink>
        )}
        <NavLink
          to="/dogs"
          className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
        >
          Dogs
        </NavLink>
        {isLoggedIn && (
          <NavLink
            to="/favorites"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Favorites
          </NavLink>
        )}
      </nav>
      {errorMessage && <Error message={errorMessage} />}
      <Routes>
        <Route element={<LoginLayout />}>
          <Route path="/" element={<Login />} />
        </Route>
        <Route element={<DogLayout />}>
          <Route path="/dogs" element={<Dogs />} />
        </Route>
        <Route element={<FavoriteLayout />}>
          <Route path="favorites" element={<FavoriteDogs />} />
        </Route>
      </Routes>
    </div>
  );
}
