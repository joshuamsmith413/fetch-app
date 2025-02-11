import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";

import "index.css";
import App from "App";

const rootElement = document.getElementById("root");
const queryClient = new QueryClient();
if (!rootElement) {
  throw new Error(
    "Root element not found. Make sure you have <div id='root'></div> in index.html",
  );
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
