import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { routes } from "./routes";

import "./index.css";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={createBrowserRouter(routes)} />
    </HelmetProvider>
  </StrictMode>
);

// Production HTML already contains the page; attach interactions to that markup.
// The development server and unknown client-side routes still start with an empty root.
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
