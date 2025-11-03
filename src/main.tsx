import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router";
import { UserProvider } from "./context/UserContext";
import { MoviesProvider } from "./context/MoviesContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
        <MoviesProvider>
          <App />
        </MoviesProvider>
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
);
