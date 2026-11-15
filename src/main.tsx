import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { routes } from "./routes";

import "./index.css";
import { InitialLanguageContext, readInitialLanguage } from "./i18n/LanguageProvider";

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <InitialLanguageContext.Provider value={readInitialLanguage()}><HelmetProvider>
      <RouterProvider router={createBrowserRouter(routes)} />
    </HelmetProvider></InitialLanguageContext.Provider>
  </StrictMode>
);

// Production HTML already contains the page; attach interactions to that markup.
// The development server and unknown client-side routes still start with an empty root.
// A generic 404 file is served for arbitrary paths; render its actual links fresh.
const isErrorPage = document.querySelector('meta[name="robots"][content^="noindex"]');
if (root.hasChildNodes() && !isErrorPage) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
