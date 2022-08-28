import { resolve } from "path"
import { defineConfig } from "vite"

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/ui/index.tsx"),
      name: "ui",
      fileName: "ui",
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, "/index.html"),
      },
      inlineDynamicImports: true,
      plugins: [],
    },
  },
  define: {
    "process.env": {},
  },
  optimizeDeps: {
    entries: [resolve(__dirname, "/index.html")],
    esbuildOptions: {
      plugins: [],
    },
  },
})
