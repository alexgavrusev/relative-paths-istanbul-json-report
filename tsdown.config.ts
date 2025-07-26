import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["./src/index.ts"],
  platform: "node",
  format: ["cjs", "esm"],
  exports: true,
  dts: {
    isolatedDeclarations: true,
  },
  sourcemap: true,
  unbundle: true,
});
