import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import localizeJsx from "./scripts/localize-jsx";
export default defineConfig({ plugins: [react({ babel: { plugins: [localizeJsx] } })], resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } } });
