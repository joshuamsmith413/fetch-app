import { useMutation } from "@tanstack/react-query";
import React from "react";
import { Route, Routes, NavLink, useNavigate } from "react-router";

import { logoutUser } from "api-calls/login";
import Error from "components/Error";
import Dogs from "pages/dogs";
import DogLayout from "pages/dogs/DogLayout";
import FavoriteDogs from "pages/favorite-dogs";
import FavoriteLayout from "pages/favorite-dogs/FavoriteLayout";
import Login from "pages/login/Login";
import LoginLayout from "pages/login/LoginLayout";

import "App.css";

export default function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const navigate = useNavigate();
  const { mutate, error, isError } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.clear();
      navigate("/");
    },
  });

  const handleLogout = () => {
    mutate();
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
      {isError && <Error message={error.message} />}
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
