import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import localizeJsx from "./scripts/localize-jsx";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

export default defineConfig({ plugins: [react({ babel: { plugins: [localizeJsx] } }), {
  name: "preview-prerendered-routes",
  configurePreviewServer(server) {
    const dist = path.resolve(server.config.root, server.config.build.outDir);
    // Match the production Nginx route lookup before Vite's SPA fallback.
    server.middlewares.use((request, response, next) => {
      if (request.url && (request.method === "GET" || request.method === "HEAD")) {
        try {
          const url = new URL(request.url, "http://localhost");
          const pathname = decodeURIComponent(url.pathname);
          const route = pathname.replace(/\/index\.html$/, "").replace(/\/+$/, "") || "/";
          const retired: Record<string, string> = { "/products/sb-002": "/products/sb-001", "/products/tb-001": "/products/cp-001" };
          const canonical = retired[route] || route;
          if (pathname !== canonical) {
            response.writeHead(301, { Location: `${canonical}${url.search}` });
            response.end();
            return;
          }
          const entry = path.resolve(dist, `.${pathname}`, "index.html");
          if (entry.startsWith(`${dist}${path.sep}`) && existsSync(entry) && statSync(entry).isFile()) {
            request.url = `${url.pathname.replace(/\/$/, "")}/index.html${url.search}`;
          } else {
            const asset = path.resolve(dist, `.${pathname}`);
            if (!asset.startsWith(`${dist}${path.sep}`) || !existsSync(asset) || !statSync(asset).isFile() || pathname === "/404.html") {
              response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
              response.end(request.method === "HEAD" ? undefined : readFileSync(path.join(dist, "404.html")));
              return;
            }
          }
        } catch { /* Let Vite handle malformed request paths. */ }
      }
      next();
    });
  },
}], resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } } });
