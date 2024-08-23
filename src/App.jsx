import React from "react";
import { RouterProvider } from "react-router-dom";
import RoutesComponent from "./router";

const App = () => {
  const router = RoutesComponent();
  return <RouterProvider router={router} />;
};

export default App;
