import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import localizeJsx from "./scripts/localize-jsx";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { resolvePageRequest } from "./src/i18n/routing";
import { splitLocalePath, languagePrefix } from "./src/i18n/paths";

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
          const page = resolvePageRequest(pathname, url.search);
          if (page?.redirect) {
            response.writeHead(301, { Location: page.redirect });
            response.end();
            return;
          }
          if (page) {
            response.setHeader('Content-Language', page.language);
            request.url = `${page.canonical.replace(/\/$/, '')}/index.html${url.search}`;
          } else {
            const asset = path.resolve(dist, `.${pathname}`);
            const isErrorPage = /(?:^|\/)404\.html$/.test(pathname);
            if (!asset.startsWith(`${dist}${path.sep}`) || !existsSync(asset) || !statSync(asset).isFile() || isErrorPage) {
              const language = splitLocalePath(pathname).language || 'en';
              const errorPage = path.join(dist, languagePrefix(language), '404.html');
              response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Language': language });
              response.end(request.method === 'HEAD' ? undefined : readFileSync(existsSync(errorPage) ? errorPage : path.join(dist, '404.html')));
              return;
            }
          }
        } catch { /* Let Vite handle malformed request paths. */ }
      }
      next();
    });
  },
}], resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } } });
