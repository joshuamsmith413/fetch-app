import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import Dogs from "dogs/Index";
import Login from "./login/Login";

import "./App.css";

const queryClient = new QueryClient();

export default function App() {
  return (
    <div className="app">
      <div className="main">
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/dogs" element={<Dogs />} />
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </div>
    </div>
  );
}
