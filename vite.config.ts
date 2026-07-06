import { fileURLToPath } from "node:url";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

// reactRouter() supplies the React (Babel/Fast Refresh) integration, so a
// standalone @vitejs/plugin-react is no longer needed. `~` resolves to app/.
export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
  // Pin the prerender preview server to IPv4 loopback so its self-reported URL
  // and the build-time fetch agree on the host.
  preview: { host: "127.0.0.1" },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./app", import.meta.url)),
    },
  },
});
