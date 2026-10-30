import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import localizeJsx from "./scripts/localize-jsx";
import { existsSync } from "node:fs";
import path from "node:path";

export default defineConfig({ plugins: [react({ babel: { plugins: [localizeJsx] } }), {
  name: "preview-prerendered-routes",
  configurePreviewServer(server) {
    const dist = path.resolve(server.config.root, server.config.build.outDir);
    // Match the production Nginx route lookup before Vite's SPA fallback.
    server.middlewares.use((request, _response, next) => {
      if (request.url && (request.method === "GET" || request.method === "HEAD")) {
        try {
          const url = new URL(request.url, "http://localhost");
          const pathname = decodeURIComponent(url.pathname);
          const entry = path.resolve(dist, `.${pathname}`, "index.html");
          if (entry.startsWith(`${dist}${path.sep}`) && existsSync(entry)) {
            request.url = `${url.pathname.replace(/\/$/, "")}/index.html${url.search}`;
          }
        } catch { /* Let Vite handle malformed request paths. */ }
      }
      next();
    });
  },
}], resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } } });
