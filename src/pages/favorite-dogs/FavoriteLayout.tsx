import React from "react";
import { Outlet } from "react-router";

import "styles/FavoriteDogs.css";

export default function FavoriteLayout() {
  return (
    <div className="favorites-layout">
      <Outlet />
    </div>
  );
}
