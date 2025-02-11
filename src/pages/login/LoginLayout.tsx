import React from "react";
import { Outlet } from "react-router";

import "styles/Login.css";

export default function LoginLayout() {
  return (
    <div className="login-layout">
      <Outlet />
    </div>
  );
}
