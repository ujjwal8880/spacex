import React from 'react';
import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'
import { QueryClientProvider, QueryClient } from 'react-query'

import HomePage from './component/homepage.page';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: 'Oops!!'
  },
]);

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
