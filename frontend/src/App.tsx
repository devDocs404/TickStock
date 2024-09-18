// src/App.tsx
import { StrictMode, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { createRoutes } from "./Routes/Routes";

const App = () => {
  const [isDark, setIsDark] = useState(false);
  const routes = createRoutes(isDark, setIsDark);

  return (
    <StrictMode>
      <RouterProvider router={routes} />
    </StrictMode>
  );
};

export default App;
