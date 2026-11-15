import { Navigate, RouteObject, useLocation, useParams } from "react-router-dom";
import { Layout } from "./layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Equipment from "./pages/Equipment";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import NotFound from "./pages/NotFound";

import { resolvePageRequest, publicPaths, retiredPaths } from './i18n/routing';
import { languageFromPrefix } from './i18n/paths';
import { LanguageProvider } from './i18n/LanguageProvider';

function LegacyRedirect() {
  const location = useLocation();
  const request = resolvePageRequest(location.pathname, location.search);
  return request?.redirect ? <Navigate to={request.redirect + location.hash} replace /> : <LanguageProvider><NotFound /></LanguageProvider>;
}
function LocaleLayout() {
  const { locale } = useParams();
  return <Layout invalidLocale={!languageFromPrefix(locale || '')} />;
}

export const routes: RouteObject[] = [
  ...[...publicPaths, ...Object.keys(retiredPaths)].map(path => ({ path, element: <LegacyRedirect /> })),
  {
    path: "/:locale",
    element: <LocaleLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "products/sb-002",
        element: <LegacyRedirect />,
      },
      {
        path: "products/tb-001",
        element: <LegacyRedirect />,
      },
      {
        path: "products/:id",
        element: <ProductDetail />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "equipment",
        element: <Equipment />,
      },
      { path: "blog", element: <Blog /> },
      { path: "blog/:slug", element: <BlogDetail /> },
      {
        path: "contact",
        element: <Contact />,
      },
      {
        path: "*",
        element: <LegacyRedirect />,
      },
    ],
  },
];
