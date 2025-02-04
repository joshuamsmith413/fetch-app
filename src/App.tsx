import React from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import Login from './login/Login';

import './App.css';

const queryClient = new QueryClient();

export default function App() {
  return (
    <div className="app">
      <div className="main">
        <QueryClientProvider client={queryClient}>
          <Login />
        </QueryClientProvider>
      </div>
    </div>
  );
}
