import { defineConfig, loadEnv } from "vite";
import type { UserConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default async ({ mode }: UserConfig) => {
  // @ts-expect-error - Vite does not have types for this
  import.meta.env = loadEnv(mode, process.cwd());
  await import("./src/env");

  return defineConfig({
    resolve: { tsconfigPaths: true },
    plugins: [
      tanstackRouter({
        target: "react",
        autoCodeSplitting: true,
        quoteStyle: "double",
      }),
      devtools(),
      tailwindcss(),
      viteReact(),
    ],
  });
};
