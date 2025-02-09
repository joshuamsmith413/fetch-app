import React from "react";
import { Outlet } from "react-router";

import "styles/dogs.css";

export default function DogLayout() {
  return (
    <div className="dogs-layout">
      <Outlet />
    </div>
  );
}
