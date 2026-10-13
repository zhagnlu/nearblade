import { RouteObject } from "react-router-dom";
import { Layout } from "./layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import About from "./pages/About";
import Equipment from "./pages/Equipment";
import Contact from "./pages/Contact";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";

export const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/products/:id",
        element: <ProductDetail />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/equipment",
        element: <Equipment />,
      },
      { path: "/blog", element: <Blog /> },
      { path: "/blog/:slug", element: <BlogDetail /> },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "*",
        element: <Home />,
      },
    ],
  },
];
